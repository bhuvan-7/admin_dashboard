from __future__ import annotations

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.core.username import allocate_unique_username, default_student_password
from app.models.enrollment import Enrollment
from app.models.student import Student
from app.models.subject import Subject
from app.models.user import User


def create_student_account_and_enroll_for_teacher_class(
    db: Session,
    *,
    teacher_id: int,
    class_name: str,
    full_name: str,
    roll_no: str,
    email: str | None,
) -> tuple[Student, str, str]:
    username = allocate_unique_username(db, full_name)
    password = default_student_password(username)

    user = User(username=username, password_hash=hash_password(password), role="student", is_active=True)
    db.add(user)
    db.flush()

    student = Student(
        user_id=user.id,
        full_name=full_name.strip(),
        class_name=class_name,
        roll_no=roll_no.strip(),
        email=email,
    )
    db.add(student)
    db.flush()

    subjects = db.query(Subject).filter(Subject.teacher_id == teacher_id, Subject.class_name == class_name).all()
    if not subjects:
        raise HTTPException(
            status_code=400,
            detail="No subjects found for this teacher in this class; assign subjects before approving.",
        )

    for sub in subjects:
        exists = (
            db.query(Enrollment)
            .filter(Enrollment.student_id == student.id, Enrollment.subject_id == sub.id)
            .first()
        )
        if not exists:
            db.add(Enrollment(student_id=student.id, subject_id=sub.id))

    return student, username, password
