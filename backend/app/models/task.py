from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


def utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


class AgentStatus(str, Enum):
    IDLE = "IDLE"
    WORKING = "WORKING"
    WAITING = "WAITING"
    COMPLETE = "COMPLETE"
    ERROR = "ERROR"


AGENT_ORDER = ("COO", "Research Agent", "Content Agent", "QA Agent")


class AgentState(BaseModel):
    status: AgentStatus = AgentStatus.IDLE
    details: str = ""
    updated_at: str = Field(default_factory=utcnow)


class CommRow(BaseModel):
    from_agent: str
    to_agent: str
    body: str
    created_at: str = Field(default_factory=utcnow)


class ThinkingRow(BaseModel):
    agent: str
    text: str
    created_at: str = Field(default_factory=utcnow)


class TaskRecord(BaseModel):
    task_id: str
    description: str
    created_at: str = Field(default_factory=utcnow)
    agents: dict[str, AgentState] = Field(default_factory=dict)
    messages: list[CommRow] = Field(default_factory=list)
    thinking_log: list[ThinkingRow] = Field(default_factory=list)
    deliverable: str | None = None
    terminal: bool = False

    @staticmethod
    def new(task_id: str, description: str) -> TaskRecord:
        agents = {name: AgentState() for name in AGENT_ORDER}
        return TaskRecord(task_id=task_id, description=description, agents=agents)

    def snapshot(self) -> dict[str, Any]:
        return {
            "type": "snapshot",
            "agents": {
                k: {
                    "status": v.status.value,
                    "details": v.details,
                    "updated_at": v.updated_at,
                }
                for k, v in self.agents.items()
            },
            "messages": [m.model_dump() for m in self.messages],
            "thinking_log": [t.model_dump() for t in self.thinking_log],
            "deliverable": self.deliverable,
            "terminal": self.terminal,
        }

    def to_public(self) -> dict[str, Any]:
        snap = self.snapshot()
        snap.pop("type", None)
        return {
            "task_id": self.task_id,
            "description": self.description,
            **snap,
        }
