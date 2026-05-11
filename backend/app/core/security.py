from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings


# NOTE: Using pbkdf2_sha256 to avoid bcrypt binary issues on some Python/Windows combos.
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)


def _now() -> datetime:
    return datetime.now(timezone.utc)


def create_access_token(*, subject: str, role: str) -> str:
    expire = _now() + timedelta(minutes=settings.jwt_access_token_expire_minutes)
    payload: dict[str, Any] = {"sub": subject, "role": role, "type": "access", "exp": expire}
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def create_refresh_token(*, subject: str, role: str) -> str:
    expire = _now() + timedelta(days=settings.jwt_refresh_token_expire_days)
    payload: dict[str, Any] = {"sub": subject, "role": role, "type": "refresh", "exp": expire}
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


class TokenError(Exception):
    pass


def decode_token(token: str, expected_type: str) -> dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except JWTError as e:
        raise TokenError("Invalid token") from e

    token_type = payload.get("type")
    if token_type != expected_type:
        raise TokenError("Invalid token type")
    if not payload.get("sub"):
        raise TokenError("Invalid token subject")
    return payload

