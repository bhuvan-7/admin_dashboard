"""teacher student requests

Revision ID: 0002_teacher_student_requests
Revises: 0001_initial
Create Date: 2026-05-12
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0002_teacher_student_requests"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "teacher_student_requests",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("teacher_id", sa.Integer(), nullable=False),
        sa.Column("full_name", sa.String(length=120), nullable=False),
        sa.Column("class_name", sa.String(length=32), nullable=False),
        sa.Column("roll_no", sa.String(length=32), nullable=False),
        sa.Column("email", sa.String(length=120), nullable=True),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("processed_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["teacher_id"], ["teachers.id"]),
    )
    op.create_index("ix_teacher_student_requests_teacher_id", "teacher_student_requests", ["teacher_id"])
    op.create_index("ix_teacher_student_requests_class_name", "teacher_student_requests", ["class_name"])
    op.create_index("ix_teacher_student_requests_roll_no", "teacher_student_requests", ["roll_no"])
    op.create_index("ix_teacher_student_requests_status", "teacher_student_requests", ["status"])


def downgrade() -> None:
    op.drop_table("teacher_student_requests")
