from __future__ import annotations

from app.agents.content_agent import CONTENT_SYSTEM
from app.agents.coo_agent import COO_SYSTEM
from app.agents.qa_agent import QA_SYSTEM
from app.agents.research_agent import RESEARCH_SYSTEM
from app.api.websocket_manager import ws_manager
from app.config import settings
from app.models.task import AGENT_ORDER, AgentStatus, CommRow, ThinkingRow, utcnow
from app.services.claude_service import claude_service
from app.services.task_service import task_repo
from app.utils.logger import LOG

THINK_CHUNK = 160


async def _broadcast(task_id: str, payload: dict) -> None:
    await ws_manager.broadcast_json(task_id, payload)


async def _emit_status(task_id: str, agent: str, status: AgentStatus, details: str) -> None:
    await task_repo.update_agent(task_id, agent, status=status, details=details)
    await _broadcast(
        task_id,
        {
            "type": "agent_status_update",
            "agent": agent,
            "status": status.value,
            "details": details,
            "timestamp": utcnow(),
        },
    )


async def _emit_message(task_id: str, from_a: str, to_a: str, body: str) -> None:
    row = CommRow(from_agent=from_a, to_agent=to_a, body=body, created_at=utcnow())
    await task_repo.append_message(task_id, row)
    await _broadcast(
        task_id,
        {
            "type": "agent_message",
            "from": from_a,
            "to": to_a,
            "message": body,
            "timestamp": row.created_at,
        },
    )


async def _emit_thinking(task_id: str, agent: str, text: str) -> None:
    row = ThinkingRow(agent=agent, text=text, created_at=utcnow())
    await task_repo.append_thinking(task_id, row)
    await _broadcast(
        task_id,
        {
            "type": "agent_thinking",
            "agent": agent,
            "thinking": text,
            "timestamp": row.created_at,
        },
    )


async def _stream_agent(
    task_id: str,
    agent: str,
    *,
    model: str,
    system: str,
    user_prompt: str,
) -> str:
    buf: list[str] = []
    pending: list[str] = []
    pending_len = 0
    async for piece in claude_service.stream_text(
        model=model,
        system=system,
        user_prompt=user_prompt,
    ):
        buf.append(piece)
        pending.append(piece)
        pending_len += len(piece)
        if pending_len >= THINK_CHUNK:
            await _emit_thinking(task_id, agent, "".join(pending))
            pending.clear()
            pending_len = 0
    if pending:
        await _emit_thinking(task_id, agent, "".join(pending))
    return "".join(buf)


async def _fail(task_id: str, message: str) -> None:
    LOG.error("task failed task_id=%s msg=%s", task_id, message)
    await _emit_status(task_id, "COO", AgentStatus.ERROR, message)
    for name in AGENT_ORDER:
        if name == "COO":
            continue
        await _emit_status(task_id, name, AgentStatus.ERROR, "Stopped due to upstream error.")
    await _broadcast(
        task_id,
        {"type": "error", "message": message, "timestamp": utcnow()},
    )
    await task_repo.mark_terminal(task_id)


async def run_pipeline(task_id: str) -> None:
    try:
        rec = await task_repo.get(task_id)
        if not rec:
            return
        if not settings.claude_api_key:
            await _fail(task_id, "CLAUDE_API_KEY is not configured on the server.")
            return

        desc = rec.description

        for name in AGENT_ORDER:
            if name == "COO":
                await _emit_status(
                    task_id,
                    name,
                    AgentStatus.WORKING,
                    "Receiving task and aligning the team on objectives.",
                )
            else:
                await _emit_status(
                    task_id,
                    name,
                    AgentStatus.WAITING,
                    "Standing by for COO handoff.",
                )

        plan = await _stream_agent(
            task_id,
            "COO",
            model=settings.coo_model,
            system=COO_SYSTEM,
            user_prompt=(
                f"User task:\n{desc}\n\n"
                "Produce a concise numbered execution plan the Research, Content, and QA agents will follow."
            ),
        )
        plan_short = plan.strip()
        if len(plan_short) > 2400:
            plan_short = plan_short[:2400] + "\n\n…(truncated for status panel)"
        await _emit_status(
            task_id,
            "COO",
            AgentStatus.WORKING,
            f"Plan drafted. Monitoring execution.\n\n{plan_short}",
        )

        await _emit_message(
            task_id,
            "COO",
            "Research Agent",
            (
                "Please research supporting context for the user task below. "
                "Focus on definitions, constraints, risks, and best practices.\n\n"
                f"USER TASK:\n{desc}\n\nCOO PLAN:\n{plan.strip()}"
            ),
        )

        await _emit_status(
            task_id,
            "Research Agent",
            AgentStatus.WORKING,
            "Gathering structured research notes for Content and QA.",
        )
        research = await _stream_agent(
            task_id,
            "Research Agent",
            model=settings.worker_model,
            system=RESEARCH_SYSTEM,
            user_prompt=(
                f"Original user task:\n{desc}\n\nCOO plan:\n{plan.strip()}\n\n"
                "Deliver structured research notes in Markdown."
            ),
        )
        await _emit_status(
            task_id,
            "Research Agent",
            AgentStatus.COMPLETE,
            "Research packet ready for downstream agents.",
        )

        await _emit_message(
            task_id,
            "Research Agent",
            "Content Agent",
            "Sharing research findings for the draft deliverable.",
        )
        await _emit_message(
            task_id,
            "COO",
            "Content Agent",
            (
                "Draft the final user-facing deliverable in Markdown using the research packet. "
                "Match tone to a professional portfolio audience."
            ),
        )

        await _emit_status(
            task_id,
            "Content Agent",
            AgentStatus.WORKING,
            "Drafting Markdown deliverable from research and requirements.",
        )
        await _emit_status(task_id, "QA Agent", AgentStatus.WAITING, "Waiting for draft from Content.")
        draft = await _stream_agent(
            task_id,
            "Content Agent",
            model=settings.worker_model,
            system=CONTENT_SYSTEM,
            user_prompt=(
                f"User task:\n{desc}\n\nResearch findings:\n{research.strip()}\n\n"
                "Produce the final deliverable in polished Markdown."
            ),
        )
        await _emit_status(
            task_id,
            "Content Agent",
            AgentStatus.WAITING,
            "Draft complete; awaiting QA review.",
        )

        await _emit_message(
            task_id,
            "COO",
            "QA Agent",
            "Please review the Content Agent draft against the original task and plan.",
        )
        await _emit_status(
            task_id,
            "QA Agent",
            AgentStatus.WORKING,
            "Reviewing draft for clarity, completeness, and alignment.",
        )
        qa = await _stream_agent(
            task_id,
            "QA Agent",
            model=settings.worker_model,
            system=QA_SYSTEM,
            user_prompt=(
                f"User task:\n{desc}\n\nDraft markdown:\n{draft.strip()}\n\n"
                "Perform QA per your system instructions."
            ),
        )

        head = qa.upper()[:2000]
        needs_revise = "DECISION: REVISE" in head or "DECISION: APPROVED" not in head

        final_body = draft.strip()
        if needs_revise:
            await _emit_message(
                task_id,
                "QA Agent",
                "Content Agent",
                "Revision requested. See QA notes; please apply and return the full revised Markdown.",
            )
            await _emit_status(
                task_id,
                "Content Agent",
                AgentStatus.WORKING,
                "Applying QA feedback (single revision pass).",
            )
            final_body = await _stream_agent(
                task_id,
                "Content Agent",
                model=settings.worker_model,
                system=CONTENT_SYSTEM,
                user_prompt=(
                    f"Original user task:\n{desc}\n\nPrevious draft:\n{draft.strip()}\n\n"
                    f"QA feedback:\n{qa.strip()}\n\nReturn the full revised Markdown only."
                ),
            )
            await _emit_status(
                task_id,
                "Content Agent",
                AgentStatus.COMPLETE,
                "Revision complete; QA should re-verify mentally (demo caps at one pass).",
            )
        else:
            await _emit_status(
                task_id,
                "Content Agent",
                AgentStatus.COMPLETE,
                "Draft approved by QA.",
            )

        await _emit_status(
            task_id,
            "QA Agent",
            AgentStatus.COMPLETE,
            "QA cycle complete.",
        )
        await _emit_status(
            task_id,
            "COO",
            AgentStatus.COMPLETE,
            "All agents complete. Deliverable released.",
        )

        await task_repo.set_deliverable(task_id, final_body)
        await task_repo.mark_terminal(task_id)
        ts = utcnow()
        await _broadcast(
            task_id,
            {"type": "task_complete", "deliverable": final_body, "timestamp": ts},
        )
    except Exception as exc:  # noqa: BLE001
        LOG.exception("pipeline error task_id=%s", task_id)
        await _fail(task_id, f"Agent pipeline error: {exc!s}")
