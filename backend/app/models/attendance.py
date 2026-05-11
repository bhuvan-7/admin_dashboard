from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class AttendanceSession(Base):
    __tablename__ = "attendance_sessions"
    __table_args__ = (
        UniqueConstraint("subject_id", "class_name", "session_date", name="uq_attendance_subject_class_date"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id"), index=True, nullable=False)
    class_name: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    session_date: Mapped[date] = mapped_column(Date, index=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)


class AttendanceMark(Base):
    __tablename__ = "attendance_marks"
    __table_args__ = (
        UniqueConstraint("attendance_session_id", "student_id", name="uq_attendance_session_student"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    attendance_session_id: Mapped[int] = mapped_column(ForeignKey("attendance_sessions.id"), index=True, nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"), index=True, nullable=False)
    present: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

