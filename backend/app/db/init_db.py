from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User


def seed_demo_users(db: Session) -> None:
    demos = [
        ("admin", "admin123", "admin"),
        ("student", "student123", "student"),
        ("teacher", "teacher123", "teacher"),
        ("parent", "parent123", "parent"),
    ]

    for username, password, role in demos:
        existing = db.query(User).filter(User.username == username).first()
        pw_hash = hash_password(password)
        if existing:
            # Always refresh demo passwords so re-seeding fixes stale hashes
            # (e.g. after switching hash algorithm or a bad first seed).
            existing.password_hash = pw_hash
            existing.role = role
            existing.is_active = True
        else:
            db.add(
                User(
                    username=username,
                    password_hash=pw_hash,
                    role=role,
                    is_active=True,
                )
            )

    db.commit()

