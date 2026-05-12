from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import db_session, require_role
from app.models.enrollment import Enrollment
from app.models.student import Student
from app.models.subject import Subject
from app.models.teacher import Teacher
from app.models.teacher_student_request import TeacherStudentRequest
from app.models.user import User
from app.realtime.manager import manager
from app.schemas.common import TeacherOut

router = APIRouter()


def _get_teacher(db: Session, user: User) -> Teacher:
    t = db.query(Teacher).filter(Teacher.user_id == user.id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Teacher profile not found")
    return t


def _teacher_classes(db: Session, teacher_id: int) -> list[str]:
    rows = db.query(Subject.class_name).filter(Subject.teacher_id == teacher_id).distinct().all()
    return sorted({r[0] for r in rows if r[0]})


@router.get("/me", response_model=TeacherOut)
def teacher_me(user: User = Depends(require_role(["teacher"])), db: Session = Depends(db_session)):
    t = _get_teacher(db, user)
    return TeacherOut(**t.__dict__)


class TeacherDashboardSummary(BaseModel):
    full_name: str
    class_names: list[str]
    subject_count: int
    enrolled_student_count: int
    pending_student_requests: int


@router.get("/dashboard/summary", response_model=TeacherDashboardSummary)
def teacher_dashboard(user: User = Depends(require_role(["teacher"])), db: Session = Depends(db_session)):
    t = _get_teacher(db, user)
    subs = db.query(Subject).filter(Subject.teacher_id == t.id).all()
    class_names = sorted({s.class_name for s in subs if s.class_name})
    subject_ids = [s.id for s in subs]
    if subject_ids:
        enrolled = (
            db.query(func.count(func.distinct(Enrollment.student_id)))
            .filter(Enrollment.subject_id.in_(subject_ids))
            .scalar()
            or 0
        )
    else:
        enrolled = 0
    pending = (
        db.query(TeacherStudentRequest)
        .filter(TeacherStudentRequest.teacher_id == t.id, TeacherStudentRequest.status == "pending")
        .count()
    )
    return TeacherDashboardSummary(
        full_name=t.full_name,
        class_names=class_names,
        subject_count=len(subs),
        enrolled_student_count=enrolled,
        pending_student_requests=pending,
    )


class CreateTeacherStudentRequest(BaseModel):
    full_name: str
    class_name: str
    roll_no: str
    email: str | None = None


class TeacherStudentRequestOut(BaseModel):
    id: int
    full_name: str
    class_name: str
    roll_no: str
    email: str | None
    status: str
    created_at: datetime


@router.get("/student-requests", response_model=list[TeacherStudentRequestOut])
def list_my_student_requests(user: User = Depends(require_role(["teacher"])), db: Session = Depends(db_session)):
    t = _get_teacher(db, user)
    rows = (
        db.query(TeacherStudentRequest)
        .filter(TeacherStudentRequest.teacher_id == t.id)
        .order_by(TeacherStudentRequest.created_at.desc())
        .all()
    )
    return [
        TeacherStudentRequestOut(
            id=r.id,
            full_name=r.full_name,
            class_name=r.class_name,
            roll_no=r.roll_no,
            email=r.email,
            status=r.status,
            created_at=r.created_at,
        )
        for r in rows
    ]


@router.post("/student-requests", response_model=TeacherStudentRequestOut, status_code=status.HTTP_201_CREATED)
def create_student_request(
    payload: CreateTeacherStudentRequest, user: User = Depends(require_role(["teacher"])), db: Session = Depends(db_session)
):
    t = _get_teacher(db, user)
    cls = payload.class_name.strip()
    if cls not in _teacher_classes(db, t.id):
        raise HTTPException(
            status_code=400,
            detail="You can only request students for a class where you are assigned to at least one subject.",
        )

    roll = payload.roll_no.strip()
    name = payload.full_name.strip()
    if not name or not roll:
        raise HTTPException(status_code=400, detail="Full name and roll number are required.")

    dup_student = db.query(Student).filter(Student.class_name == cls, Student.roll_no == roll).first()
    if dup_student:
        raise HTTPException(status_code=400, detail="A student with this roll number already exists in this class.")

    dup_pending = (
        db.query(TeacherStudentRequest)
        .filter(
            TeacherStudentRequest.teacher_id == t.id,
            TeacherStudentRequest.class_name == cls,
            TeacherStudentRequest.roll_no == roll,
            TeacherStudentRequest.status == "pending",
        )
        .first()
    )
    if dup_pending:
        raise HTTPException(status_code=400, detail="You already have a pending request for this roll number.")

    req = TeacherStudentRequest(
        teacher_id=t.id,
        full_name=name,
        class_name=cls,
        roll_no=roll,
        email=(payload.email.strip() if payload.email else None) or None,
        status="pending",
    )
    db.add(req)
    db.commit()
    db.refresh(req)

    try:
        import asyncio

        asyncio.create_task(
            manager.broadcast(
                event="teacher.student_request.created",
                data={"id": req.id, "teacher_id": t.id},
                roles=["admin"],
            )
        )
    except RuntimeError:
        pass

    return TeacherStudentRequestOut(
        id=req.id,
        full_name=req.full_name,
        class_name=req.class_name,
        roll_no=req.roll_no,
        email=req.email,
        status=req.status,
        created_at=req.created_at,
    )
