from __future__ import annotations

import asyncio
from collections import defaultdict
from typing import Any

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self._lock = asyncio.Lock()
        self._sockets_by_role: dict[str, set[WebSocket]] = defaultdict(set)

    async def connect(self, websocket: WebSocket, role: str) -> None:
        await websocket.accept()
        async with self._lock:
            self._sockets_by_role[role].add(websocket)

    async def disconnect(self, websocket: WebSocket, role: str) -> None:
        async with self._lock:
            self._sockets_by_role[role].discard(websocket)

    async def broadcast(self, *, event: str, data: Any, roles: list[str]) -> None:
        payload = {"event": event, "data": data}
        async with self._lock:
            targets: set[WebSocket] = set()
            for r in roles:
                targets |= self._sockets_by_role.get(r, set())

        for ws in list(targets):
            try:
                await ws.send_json(payload)
            except Exception:
                # Ignore failures; socket cleanup happens on disconnect.
                pass


manager = ConnectionManager()

