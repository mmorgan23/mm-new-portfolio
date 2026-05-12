from __future__ import annotations

from collections import defaultdict

from fastapi import WebSocket

from app.utils.logger import LOG


class WebSocketManager:
    def __init__(self) -> None:
        self._rooms: dict[str, set[WebSocket]] = defaultdict(set)

    async def connect(self, task_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self._rooms[task_id].add(websocket)
        LOG.info("ws connected task_id=%s clients=%s", task_id, len(self._rooms[task_id]))

    def disconnect(self, task_id: str, websocket: WebSocket) -> None:
        self._rooms[task_id].discard(websocket)
        if not self._rooms[task_id]:
            self._rooms.pop(task_id, None)

    async def broadcast_json(self, task_id: str, payload: dict) -> None:
        clients = list(self._rooms.get(task_id, set()))
        stale: list[WebSocket] = []
        for ws in clients:
            try:
                await ws.send_json(payload)
            except Exception as exc:  # noqa: BLE001
                LOG.warning("ws send failed: %s", exc)
                stale.append(ws)
        for ws in stale:
            self._rooms[task_id].discard(ws)


ws_manager = WebSocketManager()
