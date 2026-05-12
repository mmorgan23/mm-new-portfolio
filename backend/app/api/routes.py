from __future__ import annotations

import asyncio

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field

from app.api.websocket_manager import ws_manager
from app.config import settings
from app.services.agent_orchestrator import run_pipeline
from app.services.task_service import task_repo

router = APIRouter()


class CreateTaskBody(BaseModel):
    description: str = Field(..., min_length=3)


@router.get("/health")
async def health() -> dict[str, bool]:
    return {"ok": True}


@router.post("/api/tasks")
async def post_tasks(body: CreateTaskBody) -> dict[str, str]:
    text = body.description.strip()
    if len(text) > settings.max_task_chars:
        raise HTTPException(status_code=400, detail="Description too long")
    rec = await task_repo.create(text)
    asyncio.create_task(run_pipeline(rec.task_id))
    return {"task_id": rec.task_id, "ws_path": f"/ws/tasks/{rec.task_id}"}


@router.get("/api/tasks/{task_id}")
async def get_task(task_id: str) -> dict:
    rec = await task_repo.get(task_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Unknown task")
    return rec.to_public()


@router.websocket("/ws/tasks/{task_id}")
async def ws_tasks(websocket: WebSocket, task_id: str) -> None:
    rec = await task_repo.get(task_id)
    if not rec:
        await websocket.close(code=4404)
        return
    await ws_manager.connect(task_id, websocket)
    snap = await task_repo.snapshot_dict(task_id)
    if snap:
        await websocket.send_json(snap)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(task_id, websocket)
