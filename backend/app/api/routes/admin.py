from __future__ import annotations

from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import db_session, require_role
from app.core.security import hash_password
from app.models.announcement import Announcement
from app.models.assignment import Assignment
from app.models.attendance import AttendanceMark, AttendanceSession
from app.models.exam import Exam
from app.models.parent import Parent
from app.models.result import Result
from app.models.student import Student
from app.models.subject import Subject
from app.models.teacher import Teacher
from app.models.user import User
from app.realtime.manager import manager
from app.schemas.common import (
    AnnouncementOut,
    AssignmentOut,
    ExamOut,
    ParentOut,
    ResultOut,
    StudentOut,
    SubjectOut,
    TeacherOut,
)


router = APIRouter()


class DashboardStats(BaseModel):
    total_students: int
    total_teachers: int
    total_parents: int


@router.get("/dashboard/stats", response_model=DashboardStats)
def dashboard_stats(_: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    return DashboardStats(
        total_students=db.query(Student).count(),
        total_teachers=db.query(Teacher).count(),
        total_parents=db.query(Parent).count(),
    )


class CreateTeacher(BaseModel):
    username: str
    password: str
    full_name: str
    department: str | None = None
    email: str | None = None


@router.get("/teachers", response_model=list[TeacherOut])
def list_teachers(_: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    rows = db.query(Teacher).all()
    return [TeacherOut(**t.__dict__) for t in rows]


@router.post("/teachers", response_model=TeacherOut, status_code=status.HTTP_201_CREATED)
def create_teacher(payload: CreateTeacher, _: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")

    user = User(username=payload.username, password_hash=hash_password(payload.password), role="teacher", is_active=True)
    db.add(user)
    db.flush()
    teacher = Teacher(user_id=user.id, full_name=payload.full_name, department=payload.department, email=payload.email)
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return TeacherOut(**teacher.__dict__)


@router.get("/teachers/{teacher_id}", response_model=TeacherOut)
def get_teacher(teacher_id: int, _: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return TeacherOut(**teacher.__dict__)


class PatchTeacher(BaseModel):
    full_name: str | None = None
    department: str | None = None
    email: str | None = None


@router.patch("/teachers/{teacher_id}", response_model=TeacherOut)
def patch_teacher(
    teacher_id: int, payload: PatchTeacher, _: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)
):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(teacher, k, v)
    db.commit()
    db.refresh(teacher)
    return TeacherOut(**teacher.__dict__)


@router.delete("/teachers/{teacher_id}")
def delete_teacher(teacher_id: int, _: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    db.delete(teacher)
    db.commit()
    return {"status": "ok"}


class CreateStudent(BaseModel):
    username: str
    password: str
    full_name: str
    class_name: str
    roll_no: str
    email: str | None = None


@router.get("/students", response_model=list[StudentOut])
def list_students(_: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    rows = db.query(Student).all()
    return [StudentOut(**s.__dict__) for s in rows]


@router.post("/students", response_model=StudentOut, status_code=status.HTTP_201_CREATED)
def create_student(payload: CreateStudent, _: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    user = User(username=payload.username, password_hash=hash_password(payload.password), role="student", is_active=True)
    db.add(user)
    db.flush()
    student = Student(
        user_id=user.id,
        full_name=payload.full_name,
        class_name=payload.class_name,
        roll_no=payload.roll_no,
        email=payload.email,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return StudentOut(**student.__dict__)


@router.get("/students/{student_id}", response_model=StudentOut)
def get_student(student_id: int, _: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return StudentOut(**student.__dict__)


@router.get("/parents", response_model=list[ParentOut])
def list_parents(_: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    rows = db.query(Parent).all()
    return [ParentOut(**p.__dict__) for p in rows]


class CreateSubject(BaseModel):
    name: str
    code: str
    class_name: str
    teacher_id: int | None = None
    syllabus: str | None = None
    notes: str | None = None


@router.get("/subjects", response_model=list[SubjectOut])
def list_subjects(class_name: str | None = None, _: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    q = db.query(Subject)
    if class_name:
        q = q.filter(Subject.class_name == class_name)
    rows = q.all()
    return [SubjectOut(**s.__dict__) for s in rows]


@router.post("/subjects", response_model=SubjectOut, status_code=status.HTTP_201_CREATED)
def create_subject(payload: CreateSubject, _: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    subject = Subject(**payload.model_dump())
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return SubjectOut(**subject.__dict__)


@router.delete("/subjects/{subject_id}")
def delete_subject(subject_id: int, _: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(subject)
    db.commit()
    return {"status": "ok"}


@router.get("/attendance/classes", response_model=list[str])
def attendance_classes(_: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    classes = [r[0] for r in db.query(Student.class_name).distinct().all()]
    return sorted([c for c in classes if c])


class CreateAttendanceSession(BaseModel):
    subject_id: int
    class_name: str
    session_date: date


@router.post("/attendance/sessions", status_code=status.HTTP_201_CREATED)
def create_attendance_session(
    payload: CreateAttendanceSession, _: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)
):
    session = AttendanceSession(**payload.model_dump())
    db.add(session)
    db.commit()
    db.refresh(session)
    return {"id": session.id}


class AttendanceMarkIn(BaseModel):
    student_id: int
    present: bool


class BulkMarks(BaseModel):
    marks: list[AttendanceMarkIn]


@router.post("/attendance/sessions/{session_id}/marks")
def bulk_marks(
    session_id: int, payload: BulkMarks, _: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)
):
    session = db.query(AttendanceSession).filter(AttendanceSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Attendance session not found")
    for m in payload.marks:
        row = (
            db.query(AttendanceMark)
            .filter(AttendanceMark.attendance_session_id == session_id, AttendanceMark.student_id == m.student_id)
            .first()
        )
        if row:
            row.present = m.present
        else:
            db.add(AttendanceMark(attendance_session_id=session_id, student_id=m.student_id, present=m.present))
    db.commit()
    # realtime
    try:
        import asyncio

        asyncio.create_task(manager.broadcast(event="attendance.updated", data={"session_id": session_id}, roles=["student"]))
    except RuntimeError:
        pass
    return {"status": "ok"}


@router.get("/attendance", response_model=list[dict[str, Any]])
def admin_attendance(
    class_name: str,
    subject_id: int,
    q: str | None = None,
    _: User = Depends(require_role(["admin"])),
    db: Session = Depends(db_session),
):
    query = db.query(Student).filter(Student.class_name == class_name)
    if q:
        query = query.filter(Student.full_name.ilike(f"%{q}%"))

    students = query.all()
    # Aggregate attendance across sessions for this subject
    sessions = db.query(AttendanceSession).filter(AttendanceSession.subject_id == subject_id, AttendanceSession.class_name == class_name).all()
    session_ids = [s.id for s in sessions]
    marks = (
        db.query(AttendanceMark)
        .filter(AttendanceMark.attendance_session_id.in_(session_ids) if session_ids else False)
        .all()
    )
    # Map student -> present count / total
    totals: dict[int, dict[str, int]] = {s.id: {"total": 0, "present": 0} for s in students}
    for sid in session_ids:
        # each session counts as 1 total for each student (even if missing mark -> absent)
        for st in students:
            totals[st.id]["total"] += 1
    present_by_student: dict[int, int] = {}
    for m in marks:
        if m.present:
            present_by_student[m.student_id] = present_by_student.get(m.student_id, 0) + 1
    for st in students:
        totals[st.id]["present"] = present_by_student.get(st.id, 0)

    return [
        {
            "id": st.id,
            "name": st.full_name,
            "total": totals[st.id]["total"],
            "present": totals[st.id]["present"],
        }
        for st in students
    ]


class CreateAnnouncement(BaseModel):
    title: str
    description: str
    audience: str  # all/students/teachers/parents


@router.get("/announcements", response_model=list[AnnouncementOut])
def list_announcements(_: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    rows = db.query(Announcement).order_by(Announcement.created_at.desc()).all()
    return [AnnouncementOut(**a.__dict__) for a in rows]


@router.post("/announcements", response_model=AnnouncementOut, status_code=status.HTTP_201_CREATED)
def create_announcement(
    payload: CreateAnnouncement, admin: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)
):
    ann = Announcement(title=payload.title, description=payload.description, audience=payload.audience, created_by=admin.id)
    db.add(ann)
    db.commit()
    db.refresh(ann)
    # realtime
    roles: list[str] = []
    if payload.audience in ("all", "students"):
        roles.append("student")
    if payload.audience in ("all", "teachers"):
        roles.append("teacher")
    if payload.audience in ("all", "parents"):
        roles.append("parent")
    if roles:
        try:
            import asyncio

            asyncio.create_task(
                manager.broadcast(
                    event="announcement.created",
                    data=AnnouncementOut(**ann.__dict__).model_dump(),
                    roles=roles,
                )
            )
        except RuntimeError:
            pass
    return AnnouncementOut(**ann.__dict__)


@router.get("/results", response_model=list[ResultOut])
def list_results(class_name: str, _: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    # results joined via student
    student_ids = [r[0] for r in db.query(Student.id).filter(Student.class_name == class_name).all()]
    rows = db.query(Result).filter(Result.student_id.in_(student_ids) if student_ids else False).all()
    return [ResultOut(**r.__dict__) for r in rows]


class CreateResult(BaseModel):
    student_id: int
    subject_id: int
    exam_id: int | None = None
    marks_obtained: int
    max_marks: int


class BulkResults(BaseModel):
    results: list[CreateResult]


@router.post("/results", status_code=status.HTTP_201_CREATED)
def create_results(payload: BulkResults, _: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    for r in payload.results:
        db.add(Result(**r.model_dump()))
    db.commit()
    # realtime
    try:
        import asyncio

        asyncio.create_task(manager.broadcast(event="result.published", data={"count": len(payload.results)}, roles=["student"]))
    except RuntimeError:
        pass
    return {"status": "ok"}


class CreateExam(BaseModel):
    subject_id: int
    exam_date: date
    start_time: str
    end_time: str
    venue: str
    status: str


@router.post("/exams", response_model=ExamOut, status_code=status.HTTP_201_CREATED)
def create_exam(payload: CreateExam, _: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    from datetime import time as _time

    def parse(t: str) -> _time:
        h, m = t.split(":")
        return _time(hour=int(h), minute=int(m))

    exam = Exam(
        subject_id=payload.subject_id,
        exam_date=payload.exam_date,
        start_time=parse(payload.start_time),
        end_time=parse(payload.end_time),
        venue=payload.venue,
        status=payload.status,
    )
    db.add(exam)
    db.commit()
    db.refresh(exam)
    # realtime
    try:
        import asyncio

        asyncio.create_task(manager.broadcast(event="exam.updated", data=ExamOut(**exam.__dict__).model_dump(), roles=["student"]))
    except RuntimeError:
        pass
    return ExamOut(**exam.__dict__)


@router.get("/exams", response_model=list[ExamOut])
def list_exams(_: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    rows = db.query(Exam).order_by(Exam.exam_date.asc()).all()
    return [ExamOut(**e.__dict__) for e in rows]


class CreateAssignment(BaseModel):
    subject_id: int
    title: str
    description: str | None = None
    due_date: date


@router.post("/assignments", response_model=AssignmentOut, status_code=status.HTTP_201_CREATED)
def create_assignment(
    payload: CreateAssignment, admin: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)
):
    a = Assignment(**payload.model_dump(), created_by=admin.id)
    db.add(a)
    db.commit()
    db.refresh(a)
    # realtime
    try:
        import asyncio

        asyncio.create_task(manager.broadcast(event="assignment.created", data=AssignmentOut(**a.__dict__).model_dump(), roles=["student"]))
    except RuntimeError:
        pass
    return AssignmentOut(**a.__dict__)


@router.get("/assignments", response_model=list[AssignmentOut])
def list_assignments(_: User = Depends(require_role(["admin"])), db: Session = Depends(db_session)):
    rows = db.query(Assignment).order_by(Assignment.created_at.desc()).all()
    return [AssignmentOut(**a.__dict__) for a in rows]

