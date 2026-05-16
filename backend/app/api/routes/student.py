from __future__ import annotations

from datetime import date, datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import db_session, require_role
from app.models.announcement import Announcement
from app.models.assignment import Assignment
from app.models.assignment_submission import AssignmentSubmission
from app.models.attendance import AttendanceMark, AttendanceSession
from app.models.enrollment import Enrollment
from app.models.exam import Exam
from app.models.result import Result
from app.models.student import Student
from app.models.subject import Subject
from app.models.user import User
from app.realtime.manager import manager
from app.schemas.common import AnnouncementOut, AssignmentOut, ExamOut, ResultOut, SubjectWithTeacherOut
from app.services.student_portal import (
    assert_enrolled,
    assignment_rows_for_student,
    attendance_percentage,
    enrolled_subject_ids,
    overall_result_percentage,
    recent_announcements,
    subject_with_teacher,
    upcoming_exams,
)

router = APIRouter()


def _get_student_row(db: Session, user: User) -> Student:
    student = db.query(Student).filter(Student.user_id == user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student


class StudentProfileOut(BaseModel):
    id: int
    user_id: int
    username: str
    full_name: str
    class_name: str
    roll_no: str
    email: str | None = None


@router.get("/me", response_model=StudentProfileOut)
def student_me(user: User = Depends(require_role(["student"])), db: Session = Depends(db_session)):
    student = _get_student_row(db, user)
    return StudentProfileOut(
        id=student.id,
        user_id=student.user_id,
        username=user.username,
        full_name=student.full_name,
        class_name=student.class_name,
        roll_no=student.roll_no,
        email=student.email,
    )


class ExamWithSubjectOut(ExamOut):
    subject_name: str


class StudentDashboardSummary(BaseModel):
    profile: StudentProfileOut
    subject_count: int
    upcoming_exam_count: int
    pending_assignment_count: int
    attendance_percentage: float
    overall_result_percentage: float | None
    announcement_count: int
    recent_pending_assignments: list["AssignmentWithStatus"]
    recent_upcoming_exams: list[ExamWithSubjectOut]
    recent_announcements: list[AnnouncementOut]


class AssignmentWithStatus(AssignmentOut):
    submission_status: str
    submitted_at: datetime | None = None
    grade: str | None = None
    feedback: str | None = None


StudentDashboardSummary.model_rebuild()


@router.get("/dashboard/summary", response_model=StudentDashboardSummary)
def student_dashboard(user: User = Depends(require_role(["student"])), db: Session = Depends(db_session)):
    student = _get_student_row(db, user)
    subject_ids = enrolled_subject_ids(db, student.id)
    subjects = db.query(Subject).filter(Subject.id.in_(subject_ids) if subject_ids else False).all()
    subject_names = {s.id: s.name for s in subjects}

    assignment_rows = assignment_rows_for_student(db, student, subject_ids)
    pending = [a for a in assignment_rows if (a.get("submission_status") or "").lower() == "pending"]
    exams_upcoming = upcoming_exams(db, subject_ids)
    announcements = recent_announcements(db, limit=100)
    ann_recent = recent_announcements(db, limit=3)

    profile = StudentProfileOut(
        id=student.id,
        user_id=student.user_id,
        username=user.username,
        full_name=student.full_name,
        class_name=student.class_name,
        roll_no=student.roll_no,
        email=student.email,
    )

    def to_assignment(row: dict) -> AssignmentWithStatus:
        return AssignmentWithStatus(
            id=row["id"],
            subject_id=row["subject_id"],
            title=row["title"],
            description=row.get("description"),
            due_date=row["due_date"],
            created_by=row.get("created_by"),
            created_at=row["created_at"],
            submission_status=row["submission_status"],
            submitted_at=row.get("submitted_at"),
            grade=row.get("grade"),
            feedback=row.get("feedback"),
        )

    recent_exam_models: list[ExamWithSubjectOut] = []
    for e in exams_upcoming[:4]:
        recent_exam_models.append(
            ExamWithSubjectOut(
                **e.__dict__,
                subject_name=subject_names.get(e.subject_id, f"Subject #{e.subject_id}"),
            )
        )

    return StudentDashboardSummary(
        profile=profile,
        subject_count=len(subject_ids),
        upcoming_exam_count=len(exams_upcoming),
        pending_assignment_count=len(pending),
        attendance_percentage=attendance_percentage(db, student, subject_ids),
        overall_result_percentage=overall_result_percentage(db, student.id),
        announcement_count=len(announcements),
        recent_pending_assignments=[to_assignment(a) for a in pending[:4]],
        recent_upcoming_exams=recent_exam_models,
        recent_announcements=[AnnouncementOut(**a.__dict__) for a in ann_recent],
    )


@router.get("/subjects", response_model=list[SubjectWithTeacherOut])
def my_subjects(user: User = Depends(require_role(["student"])), db: Session = Depends(db_session)):
    student = _get_student_row(db, user)
    subject_ids = enrolled_subject_ids(db, student.id)
    rows = db.query(Subject).filter(Subject.id.in_(subject_ids) if subject_ids else False).all()
    return [SubjectWithTeacherOut(**subject_with_teacher(db, s)) for s in rows]


@router.get("/subjects/{subject_id}", response_model=SubjectWithTeacherOut)
def get_subject(
    subject_id: int,
    user: User = Depends(require_role(["student"])),
    db: Session = Depends(db_session),
):
    student = _get_student_row(db, user)
    assert_enrolled(db, student.id, subject_id)
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return SubjectWithTeacherOut(**subject_with_teacher(db, subject))


@router.get("/exams", response_model=list[ExamOut])
def my_exams(user: User = Depends(require_role(["student"])), db: Session = Depends(db_session)):
    student = _get_student_row(db, user)
    subject_ids = enrolled_subject_ids(db, student.id)
    rows = db.query(Exam).filter(Exam.subject_id.in_(subject_ids) if subject_ids else False).order_by(Exam.exam_date.asc()).all()
    return [ExamOut(**e.__dict__) for e in rows]


@router.get("/assignments", response_model=list[AssignmentWithStatus])
def my_assignments(user: User = Depends(require_role(["student"])), db: Session = Depends(db_session)):
    student = _get_student_row(db, user)
    subject_ids = enrolled_subject_ids(db, student.id)
    rows = assignment_rows_for_student(db, student, subject_ids)
    return [
        AssignmentWithStatus(
            id=r["id"],
            subject_id=r["subject_id"],
            title=r["title"],
            description=r.get("description"),
            due_date=r["due_date"],
            created_by=r.get("created_by"),
            created_at=r["created_at"],
            submission_status=r["submission_status"],
            submitted_at=r.get("submitted_at"),
            grade=r.get("grade"),
            feedback=r.get("feedback"),
        )
        for r in rows
    ]


@router.get("/assignments/{assignment_id}", response_model=AssignmentWithStatus)
def get_assignment(
    assignment_id: int,
    user: User = Depends(require_role(["student"])),
    db: Session = Depends(db_session),
):
    student = _get_student_row(db, user)
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    assert_enrolled(db, student.id, assignment.subject_id)

    sub = (
        db.query(AssignmentSubmission)
        .filter(AssignmentSubmission.assignment_id == assignment_id, AssignmentSubmission.student_id == student.id)
        .first()
    )
    return AssignmentWithStatus(
        **assignment.__dict__,
        submission_status=sub.status if sub else "pending",
        submitted_at=sub.submitted_at if sub else None,
        grade=sub.grade if sub else None,
        feedback=sub.feedback if sub else None,
    )


class SubmitAssignmentRequest(BaseModel):
    status: str = "submitted"


@router.post("/assignments/{assignment_id}/submit")
def submit_assignment(
    assignment_id: int,
    payload: SubmitAssignmentRequest,
    user: User = Depends(require_role(["student"])),
    db: Session = Depends(db_session),
):
    student = _get_student_row(db, user)
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    assert_enrolled(db, student.id, assignment.subject_id)

    if payload.status not in ("submitted", "pending"):
        raise HTTPException(status_code=400, detail="Invalid submission status.")

    row = (
        db.query(AssignmentSubmission)
        .filter(AssignmentSubmission.assignment_id == assignment_id, AssignmentSubmission.student_id == student.id)
        .first()
    )
    if row and (row.status or "").lower() == "graded":
        raise HTTPException(status_code=400, detail="This assignment has already been graded.")

    if row:
        row.status = payload.status
        row.submitted_at = datetime.utcnow()
    else:
        db.add(
            AssignmentSubmission(
                assignment_id=assignment_id,
                student_id=student.id,
                status=payload.status,
                submitted_at=datetime.utcnow(),
            )
        )
    db.commit()
    try:
        import asyncio

        asyncio.create_task(
            manager.broadcast(
                event="assignment.submission.updated",
                data={"assignment_id": assignment_id, "student_id": student.id, "status": payload.status},
                roles=["admin", "student"],
            )
        )
    except RuntimeError:
        pass
    return {"status": "ok"}


@router.get("/attendance", response_model=list[dict[str, Any]])
def my_attendance(user: User = Depends(require_role(["student"])), db: Session = Depends(db_session)):
    student = _get_student_row(db, user)
    subject_ids = enrolled_subject_ids(db, student.id)

    subjects = db.query(Subject).filter(Subject.id.in_(subject_ids) if subject_ids else False).all()
    sessions = (
        db.query(AttendanceSession)
        .filter(AttendanceSession.subject_id.in_(subject_ids) if subject_ids else False, AttendanceSession.class_name == student.class_name)
        .all()
    )
    session_ids = [s.id for s in sessions]
    marks = (
        db.query(AttendanceMark)
        .filter(AttendanceMark.attendance_session_id.in_(session_ids) if session_ids else False, AttendanceMark.student_id == student.id)
        .all()
    )
    present_by_session = {m.attendance_session_id: m.present for m in marks}

    totals: dict[int, dict[str, int]] = {sub.id: {"total": 0, "present": 0} for sub in subjects}
    for ses in sessions:
        totals[ses.subject_id]["total"] += 1
        if present_by_session.get(ses.id):
            totals[ses.subject_id]["present"] += 1

    return [
        {"subject_id": sub.id, "subject": sub.name, "total": totals[sub.id]["total"], "present": totals[sub.id]["present"]}
        for sub in subjects
    ]


class AttendanceHistoryItem(BaseModel):
    session_id: int
    subject_id: int
    subject: str
    session_date: date
    present: bool


@router.get("/attendance/history", response_model=list[AttendanceHistoryItem])
def attendance_history(user: User = Depends(require_role(["student"])), db: Session = Depends(db_session)):
    student = _get_student_row(db, user)
    subject_ids = enrolled_subject_ids(db, student.id)
    if not subject_ids:
        return []

    subjects = db.query(Subject).filter(Subject.id.in_(subject_ids)).all()
    subject_names = {s.id: s.name for s in subjects}

    sessions = (
        db.query(AttendanceSession)
        .filter(AttendanceSession.subject_id.in_(subject_ids), AttendanceSession.class_name == student.class_name)
        .order_by(AttendanceSession.session_date.desc())
        .all()
    )
    session_ids = [s.id for s in sessions]
    marks = (
        db.query(AttendanceMark)
        .filter(AttendanceMark.attendance_session_id.in_(session_ids), AttendanceMark.student_id == student.id)
        .all()
    )
    present_by_session = {m.attendance_session_id: m.present for m in marks}

    return [
        AttendanceHistoryItem(
            session_id=ses.id,
            subject_id=ses.subject_id,
            subject=subject_names.get(ses.subject_id, f"Subject #{ses.subject_id}"),
            session_date=ses.session_date,
            present=bool(present_by_session.get(ses.id)),
        )
        for ses in sessions
    ]


@router.get("/announcements", response_model=list[AnnouncementOut])
def my_announcements(user: User = Depends(require_role(["student"])), db: Session = Depends(db_session)):
    rows = (
        db.query(Announcement)
        .filter(Announcement.audience.in_(["all", "students"]))
        .order_by(Announcement.created_at.desc())
        .all()
    )
    return [AnnouncementOut(**a.__dict__) for a in rows]


@router.get("/results", response_model=list[ResultOut])
def my_results(user: User = Depends(require_role(["student"])), db: Session = Depends(db_session)):
    student = _get_student_row(db, user)
    rows = db.query(Result).filter(Result.student_id == student.id).all()
    return [ResultOut(**r.__dict__) for r in rows]
