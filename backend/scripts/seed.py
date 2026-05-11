from __future__ import annotations

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, ".."))
sys.path.insert(0, ROOT)

from app.db.session import SessionLocal, engine  # noqa: E402
from app.db.base import Base  # noqa: E402
from app.db.init_db import seed_demo_users  # noqa: E402

# Ensure models are imported so SQLAlchemy knows tables.
from app import models  # noqa: F401,E402


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_demo_users(db)
        print("Seeded demo users (admin/student/teacher/parent).")
    finally:
        db.close()


if __name__ == "__main__":
    main()

