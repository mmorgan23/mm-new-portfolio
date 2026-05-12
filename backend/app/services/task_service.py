from __future__ import annotations

import asyncio
from typing import Any
from uuid import uuid4

from app.models.task import AgentState, AgentStatus, CommRow, TaskRecord, ThinkingRow, utcnow
class TaskRepository:
    def __init__(self) -> None:
        self._tasks: dict[str, TaskRecord] = {}
        self._lock = asyncio.Lock()

    async def create(self, description: str) -> TaskRecord:
        task_id = str(uuid4())
        rec = TaskRecord.new(task_id, description)
        async with self._lock:
            self._tasks[task_id] = rec
        return rec

    async def get(self, task_id: str) -> TaskRecord | None:
        async with self._lock:
            return self._tasks.get(task_id)

    async def update_agent(
        self,
        task_id: str,
        agent: str,
        *,
        status: AgentStatus,
        details: str,
    ) -> None:
        async with self._lock:
            rec = self._tasks.get(task_id)
            if not rec:
                return
            if agent not in rec.agents:
                rec.agents[agent] = AgentState()
            st = rec.agents[agent]
            st.status = status
            st.details = details
            st.updated_at = utcnow()

    async def append_message(self, task_id: str, row: CommRow) -> None:
        async with self._lock:
            rec = self._tasks.get(task_id)
            if not rec:
                return
            rec.messages.append(row)

    async def append_thinking(self, task_id: str, row: ThinkingRow) -> None:
        async with self._lock:
            rec = self._tasks.get(task_id)
            if not rec:
                return
            rec.thinking_log.append(row)

    async def set_deliverable(self, task_id: str, text: str) -> None:
        async with self._lock:
            rec = self._tasks.get(task_id)
            if not rec:
                return
            rec.deliverable = text

    async def mark_terminal(self, task_id: str) -> None:
        async with self._lock:
            rec = self._tasks.get(task_id)
            if not rec:
                return
            rec.terminal = True

    async def snapshot_dict(self, task_id: str) -> dict[str, Any] | None:
        async with self._lock:
            rec = self._tasks.get(task_id)
            if not rec:
                return None
            return rec.snapshot()


task_repo = TaskRepository()
