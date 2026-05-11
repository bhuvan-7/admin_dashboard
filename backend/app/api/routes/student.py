from __future__ import annotations

from datetime import datetime
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
from app.schemas.common import AnnouncementOut, AssignmentOut, ExamOut, ResultOut, SubjectOut


router = APIRouter()


def _get_student_row(db: Session, user: User) -> Student:
    student = db.query(Student).filter(Student.user_id == user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student


@router.get("/subjects", response_model=list[SubjectOut])
def my_subjects(user: User = Depends(require_role(["student"])), db: Session = Depends(db_session)):
    student = _get_student_row(db, user)
    subject_ids = [r[0] for r in db.query(Enrollment.subject_id).filter(Enrollment.student_id == student.id).all()]
    rows = db.query(Subject).filter(Subject.id.in_(subject_ids) if subject_ids else False).all()
    return [SubjectOut(**s.__dict__) for s in rows]


@router.get("/exams", response_model=list[ExamOut])
def my_exams(user: User = Depends(require_role(["student"])), db: Session = Depends(db_session)):
    student = _get_student_row(db, user)
    subject_ids = [r[0] for r in db.query(Enrollment.subject_id).filter(Enrollment.student_id == student.id).all()]
    rows = db.query(Exam).filter(Exam.subject_id.in_(subject_ids) if subject_ids else False).order_by(Exam.exam_date.asc()).all()
    return [ExamOut(**e.__dict__) for e in rows]


class AssignmentWithStatus(AssignmentOut):
    submission_status: str


@router.get("/assignments", response_model=list[AssignmentWithStatus])
def my_assignments(user: User = Depends(require_role(["student"])), db: Session = Depends(db_session)):
    student = _get_student_row(db, user)
    subject_ids = [r[0] for r in db.query(Enrollment.subject_id).filter(Enrollment.student_id == student.id).all()]
    rows = db.query(Assignment).filter(Assignment.subject_id.in_(subject_ids) if subject_ids else False).order_by(Assignment.due_date.asc()).all()

    submissions = db.query(AssignmentSubmission).filter(AssignmentSubmission.student_id == student.id).all()
    submission_by_assignment = {s.assignment_id: s for s in submissions}

    out: list[AssignmentWithStatus] = []
    for a in rows:
        sub = submission_by_assignment.get(a.id)
        out.append(AssignmentWithStatus(**a.__dict__, submission_status=sub.status if sub else "pending"))
    return out


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

    row = (
        db.query(AssignmentSubmission)
        .filter(AssignmentSubmission.assignment_id == assignment_id, AssignmentSubmission.student_id == student.id)
        .first()
    )
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
    # realtime
    try:
        import asyncio

        asyncio.create_task(
            manager.broadcast(
                event="assignment.submission.updated",
                data={"assignment_id": assignment_id, "student_id": student.id, "status": payload.status},
                roles=["admin"],
            )
        )
    except RuntimeError:
        pass
    return {"status": "ok"}


@router.get("/attendance", response_model=list[dict[str, Any]])
def my_attendance(user: User = Depends(require_role(["student"])), db: Session = Depends(db_session)):
    student = _get_student_row(db, user)
    subject_ids = [r[0] for r in db.query(Enrollment.subject_id).filter(Enrollment.student_id == student.id).all()]

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

