from __future__ import annotations

import re

from sqlalchemy.orm import Session

from app.models.user import User


def slug_username_base(full_name: str) -> str:
    raw = (full_name or "").strip().lower()
    slug = re.sub(r"[^a-z0-9]+", "", raw)
    return slug or "student"


def allocate_unique_username(db: Session, full_name: str, max_len: int = 64) -> str:
    base = slug_username_base(full_name)[: max_len - 8]
    if not base:
        base = "student"
    candidate = base[:max_len]
    n = 1
    while db.query(User.id).filter(User.username == candidate).first():
        suffix = str(n)
        candidate = (base[: max_len - len(suffix)] + suffix)[:max_len]
        n += 1
    return candidate


def default_student_password(username: str) -> str:
    return f"{username}123"
