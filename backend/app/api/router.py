from fastapi import APIRouter

from app.api.routes import auth
from app.api.routes import admin
from app.api.routes import student


api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(student.router, prefix="/student", tags=["student"])

@api_router.get("/health")
def health():
    return {"status": "ok"}

