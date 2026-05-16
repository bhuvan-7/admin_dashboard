from __future__ import annotations

from datetime import date, datetime

from sqlalchemy.orm import Session

from app.models.announcement import Announcement
from app.models.assignment import Assignment
from app.models.assignment_submission import AssignmentSubmission
from app.models.attendance import AttendanceMark, AttendanceSession
from app.models.enrollment import Enrollment
from app.models.exam import Exam
from app.models.result import Result
from app.models.student import Student
from app.models.subject import Subject
from app.models.teacher import Teacher


def enrolled_subject_ids(db: Session, student_id: int) -> list[int]:
    return [r[0] for r in db.query(Enrollment.subject_id).filter(Enrollment.student_id == student_id).all()]


def assert_enrolled(db: Session, student_id: int, subject_id: int) -> None:
    if subject_id not in enrolled_subject_ids(db, student_id):
        from fastapi import HTTPException

        raise HTTPException(status_code=403, detail="You are not enrolled in this subject.")


def subject_with_teacher(db: Session, subject: Subject) -> dict:
    tname = None
    if subject.teacher_id:
        t = db.query(Teacher).filter(Teacher.id == subject.teacher_id).first()
        tname = t.full_name if t else None
    return {
        "id": subject.id,
        "name": subject.name,
        "code": subject.code,
        "class_name": subject.class_name,
        "teacher_id": subject.teacher_id,
        "syllabus": subject.syllabus,
        "notes": subject.notes,
        "teacher_name": tname,
    }


def attendance_percentage(db: Session, student: Student, subject_ids: list[int]) -> float:
    if not subject_ids:
        return 0.0
    sessions = (
        db.query(AttendanceSession)
        .filter(AttendanceSession.subject_id.in_(subject_ids), AttendanceSession.class_name == student.class_name)
        .all()
    )
    if not sessions:
        return 0.0
    session_ids = [s.id for s in sessions]
    marks = (
        db.query(AttendanceMark)
        .filter(AttendanceMark.attendance_session_id.in_(session_ids), AttendanceMark.student_id == student.id)
        .all()
    )
    present_by_session = {m.attendance_session_id: m.present for m in marks}
    total = len(sessions)
    present = sum(1 for s in sessions if present_by_session.get(s.id))
    return round((present / total) * 100, 1) if total else 0.0


def overall_result_percentage(db: Session, student_id: int) -> float | None:
    rows = db.query(Result).filter(Result.student_id == student_id).all()
    if not rows:
        return None
    total = sum(r.marks_obtained for r in rows)
    max_marks = sum(r.max_marks for r in rows)
    return round((total / max_marks) * 100, 1) if max_marks else 0.0


def upcoming_exams(db: Session, subject_ids: list[int]) -> list[Exam]:
    if not subject_ids:
        return []
    today = date.today()
    rows = (
        db.query(Exam)
        .filter(Exam.subject_id.in_(subject_ids))
        .order_by(Exam.exam_date.asc())
        .all()
    )
    out: list[Exam] = []
    for e in rows:
        st = (e.status or "").lower()
        if st == "completed":
            continue
        if e.exam_date >= today or st in ("upcoming", "ongoing"):
            out.append(e)
    return out


def assignment_rows_for_student(db: Session, student: Student, subject_ids: list[int]) -> list[dict]:
    if not subject_ids:
        return []
    assignments = (
        db.query(Assignment)
        .filter(Assignment.subject_id.in_(subject_ids))
        .order_by(Assignment.due_date.asc())
        .all()
    )
    submissions = db.query(AssignmentSubmission).filter(AssignmentSubmission.student_id == student.id).all()
    submission_by_assignment = {s.assignment_id: s for s in submissions}
    out: list[dict] = []
    for a in assignments:
        sub = submission_by_assignment.get(a.id)
        out.append(
            {
                **a.__dict__,
                "submission_status": sub.status if sub else "pending",
                "submitted_at": sub.submitted_at if sub else None,
                "grade": sub.grade if sub else None,
                "feedback": sub.feedback if sub else None,
            }
        )
    return out


def recent_announcements(db: Session, limit: int = 5) -> list[Announcement]:
    return (
        db.query(Announcement)
        .filter(Announcement.audience.in_(["all", "students"]))
        .order_by(Announcement.created_at.desc())
        .limit(limit)
        .all()
    )
