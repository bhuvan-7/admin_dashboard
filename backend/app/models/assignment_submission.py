from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"
    __table_args__ = (UniqueConstraint("assignment_id", "student_id", name="uq_submission_assignment_student"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    assignment_id: Mapped[int] = mapped_column(ForeignKey("assignments.id"), index=True, nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"), index=True, nullable=False)

    status: Mapped[str] = mapped_column(String(32), index=True, nullable=False)  # pending/submitted/graded
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    grade: Mapped[str | None] = mapped_column(String(32), nullable=True)
    feedback: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

