from __future__ import annotations

from datetime import datetime, date, time

from pydantic import BaseModel


class IDResponse(BaseModel):
    id: int


class SubjectOut(BaseModel):
    id: int
    name: str
    code: str
    class_name: str
    teacher_id: int | None = None
    syllabus: str | None = None
    notes: str | None = None


class TeacherOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    department: str | None = None
    email: str | None = None


class StudentOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    class_name: str
    roll_no: str
    email: str | None = None


class ParentOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    phone: str | None = None
    email: str | None = None


class AnnouncementOut(BaseModel):
    id: int
    title: str
    description: str
    audience: str
    created_by: int | None = None
    created_at: datetime


class ExamOut(BaseModel):
    id: int
    subject_id: int
    exam_date: date
    start_time: time
    end_time: time
    venue: str
    status: str
    created_at: datetime


class AssignmentOut(BaseModel):
    id: int
    subject_id: int
    title: str
    description: str | None = None
    due_date: date
    created_by: int | None = None
    created_at: datetime


class ResultOut(BaseModel):
    id: int
    student_id: int
    subject_id: int
    exam_id: int | None = None
    marks_obtained: int
    max_marks: int
    created_at: datetime

