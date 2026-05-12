from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User


def seed_demo_users(db: Session) -> None:
    demos = [
        ("admin", "admin123", "admin"),
        ("student", "student123", "student"),
        ("teacher", "teacher123", "teacher"),
        ("parent", "parent123", "parent"),
    ]

    for username, password, role in demos:
        existing = db.query(User).filter(User.username == username).first()
        pw_hash = hash_password(password)
        if existing:
            # Always refresh demo passwords so re-seeding fixes stale hashes
            # (e.g. after switching hash algorithm or a bad first seed).
            existing.password_hash = pw_hash
            existing.role = role
            existing.is_active = True
        else:
            db.add(
                User(
                    username=username,
                    password_hash=pw_hash,
                    role=role,
                    is_active=True,
                )
            )

    db.commit()


def seed_demo_lms_data(db) -> None:
    """Shared subjects, enrollments, and sample rows so Admin + Student UIs read the same DB."""
    from datetime import date, time

    from app.models.announcement import Announcement
    from app.models.assignment import Assignment
    from app.models.attendance import AttendanceMark, AttendanceSession
    from app.models.enrollment import Enrollment
    from app.models.exam import Exam
    from app.models.parent import Parent
    from app.models.result import Result
    from app.models.student import Student
    from app.models.subject import Subject
    from app.models.teacher import Teacher
    from app.models.user import User

    st_user = db.query(User).filter(User.username == "student").first()
    t_user = db.query(User).filter(User.username == "teacher").first()
    adm_user = db.query(User).filter(User.username == "admin").first()
    par_user = db.query(User).filter(User.username == "parent").first()
    if not st_user or not t_user:
        return

    student = db.query(Student).filter(Student.user_id == st_user.id).first()
    if not student:
        student = Student(
            user_id=st_user.id,
            full_name="Demo Student",
            class_name="10",
            roll_no="R001",
            email="student@lms.com",
        )
        db.add(student)
        db.flush()

    teacher = db.query(Teacher).filter(Teacher.user_id == t_user.id).first()
    if not teacher:
        teacher = Teacher(
            user_id=t_user.id,
            full_name="Demo Teacher",
            department="Sciences",
            email="teacher@lms.com",
        )
        db.add(teacher)
        db.flush()

    if par_user and not db.query(Parent).filter(Parent.user_id == par_user.id).first():
        db.add(
            Parent(
                user_id=par_user.id,
                full_name="Demo Parent",
                phone="+911234567890",
                email="parent@lms.com",
            )
        )
        db.flush()

    if db.query(Subject).filter(Subject.code == "DEMO-MATH-10").first():
        db.commit()
        return

    subj_math = Subject(
        name="Mathematics",
        code="DEMO-MATH-10",
        class_name="10",
        teacher_id=teacher.id,
        syllabus="Algebra, geometry, and statistics for class 10 (demo data shared with student portal).",
        notes="Check the Assignments tab for homework.",
    )
    subj_eng = Subject(
        name="English",
        code="DEMO-ENG-10",
        class_name="10",
        teacher_id=teacher.id,
        syllabus="Reading comprehension, writing, and grammar.",
        notes="Submit essays before the due date.",
    )
    db.add_all([subj_math, subj_eng])
    db.flush()

    db.add_all(
        [
            Enrollment(student_id=student.id, subject_id=subj_math.id),
            Enrollment(student_id=student.id, subject_id=subj_eng.id),
        ]
    )

    if adm_user:
        db.add(
            Announcement(
                title="Welcome to EduVerse LMS",
                description="This announcement is stored in the database. Admin and Student dashboards now read the same data after seeding.",
                audience="students",
                created_by=adm_user.id,
            )
        )

    exam1 = Exam(
        subject_id=subj_math.id,
        exam_date=date(2026, 6, 10),
        start_time=time(10, 0),
        end_time=time(12, 0),
        venue="Main Hall",
        status="Upcoming",
    )
    db.add(exam1)
    db.flush()

    db.add(
        Assignment(
            subject_id=subj_math.id,
            title="Chapter 3 problem set",
            description="Complete exercises 1–12 from the textbook.",
            due_date=date(2026, 6, 1),
            created_by=adm_user.id if adm_user else None,
        )
    )
    db.flush()

    sess = AttendanceSession(subject_id=subj_math.id, class_name="10", session_date=date(2026, 5, 1))
    db.add(sess)
    db.flush()
    db.add(AttendanceMark(attendance_session_id=sess.id, student_id=student.id, present=True))

    db.add(
        Result(
            student_id=student.id,
            subject_id=subj_math.id,
            exam_id=exam1.id,
            marks_obtained=82,
            max_marks=100,
        )
    )
    db.add(
        Result(
            student_id=student.id,
            subject_id=subj_eng.id,
            exam_id=None,
            marks_obtained=77,
            max_marks=100,
        )
    )
    db.commit()

