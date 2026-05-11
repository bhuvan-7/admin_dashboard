from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.core.security import TokenError, decode_token
from app.realtime.manager import manager


app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=4401)
        return

    try:
        payload = decode_token(token, expected_type="access")
    except TokenError:
        await websocket.close(code=4401)
        return

    role = payload.get("role") or "unknown"

    await manager.connect(websocket, role=role)
    try:
        while True:
            # Keep connection alive; client can send pings.
            await websocket.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect(websocket, role=role)

