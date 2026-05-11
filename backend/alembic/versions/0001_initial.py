"""initial

Revision ID: 0001_initial
Revises: 
Create Date: 2026-05-11
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("username", sa.String(length=64), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=32), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_users_username", "users", ["username"], unique=True)
    op.create_index("ix_users_role", "users", ["role"], unique=False)

    op.create_table(
        "teachers",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("full_name", sa.String(length=120), nullable=False),
        sa.Column("department", sa.String(length=120), nullable=True),
        sa.Column("email", sa.String(length=120), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
    )
    op.create_index("ix_teachers_user_id", "teachers", ["user_id"], unique=True)

    op.create_table(
        "students",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("full_name", sa.String(length=120), nullable=False),
        sa.Column("class_name", sa.String(length=32), nullable=False),
        sa.Column("roll_no", sa.String(length=32), nullable=False),
        sa.Column("email", sa.String(length=120), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
    )
    op.create_index("ix_students_user_id", "students", ["user_id"], unique=True)
    op.create_index("ix_students_class_name", "students", ["class_name"], unique=False)
    op.create_index("ix_students_roll_no", "students", ["roll_no"], unique=False)

    op.create_table(
        "parents",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("full_name", sa.String(length=120), nullable=False),
        sa.Column("phone", sa.String(length=32), nullable=True),
        sa.Column("email", sa.String(length=120), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
    )
    op.create_index("ix_parents_user_id", "parents", ["user_id"], unique=True)

    op.create_table(
        "subjects",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("code", sa.String(length=64), nullable=False),
        sa.Column("class_name", sa.String(length=32), nullable=False),
        sa.Column("teacher_id", sa.Integer(), nullable=True),
        sa.Column("syllabus", sa.Text(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["teacher_id"], ["teachers.id"]),
    )
    op.create_index("ix_subjects_code", "subjects", ["code"], unique=False)
    op.create_index("ix_subjects_class_name", "subjects", ["class_name"], unique=False)

    op.create_table(
        "enrollments",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.Column("subject_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["student_id"], ["students.id"]),
        sa.ForeignKeyConstraint(["subject_id"], ["subjects.id"]),
        sa.UniqueConstraint("student_id", "subject_id", name="uq_enrollment_student_subject"),
    )
    op.create_index("ix_enrollments_student_id", "enrollments", ["student_id"], unique=False)
    op.create_index("ix_enrollments_subject_id", "enrollments", ["subject_id"], unique=False)

    op.create_table(
        "announcements",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("audience", sa.String(length=32), nullable=False),
        sa.Column("created_by", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["created_by"], ["users.id"]),
    )
    op.create_index("ix_announcements_audience", "announcements", ["audience"], unique=False)

    op.create_table(
        "exams",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("subject_id", sa.Integer(), nullable=False),
        sa.Column("exam_date", sa.Date(), nullable=False),
        sa.Column("start_time", sa.Time(), nullable=False),
        sa.Column("end_time", sa.Time(), nullable=False),
        sa.Column("venue", sa.String(length=120), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["subject_id"], ["subjects.id"]),
    )
    op.create_index("ix_exams_subject_id", "exams", ["subject_id"], unique=False)
    op.create_index("ix_exams_exam_date", "exams", ["exam_date"], unique=False)
    op.create_index("ix_exams_status", "exams", ["status"], unique=False)

    op.create_table(
        "assignments",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("subject_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("due_date", sa.Date(), nullable=False),
        sa.Column("created_by", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["subject_id"], ["subjects.id"]),
        sa.ForeignKeyConstraint(["created_by"], ["users.id"]),
    )
    op.create_index("ix_assignments_subject_id", "assignments", ["subject_id"], unique=False)
    op.create_index("ix_assignments_due_date", "assignments", ["due_date"], unique=False)

    op.create_table(
        "assignment_submissions",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("assignment_id", sa.Integer(), nullable=False),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("submitted_at", sa.DateTime(), nullable=True),
        sa.Column("grade", sa.String(length=32), nullable=True),
        sa.Column("feedback", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["assignment_id"], ["assignments.id"]),
        sa.ForeignKeyConstraint(["student_id"], ["students.id"]),
        sa.UniqueConstraint("assignment_id", "student_id", name="uq_submission_assignment_student"),
    )
    op.create_index("ix_assignment_submissions_assignment_id", "assignment_submissions", ["assignment_id"], unique=False)
    op.create_index("ix_assignment_submissions_student_id", "assignment_submissions", ["student_id"], unique=False)
    op.create_index("ix_assignment_submissions_status", "assignment_submissions", ["status"], unique=False)

    op.create_table(
        "attendance_sessions",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("subject_id", sa.Integer(), nullable=False),
        sa.Column("class_name", sa.String(length=32), nullable=False),
        sa.Column("session_date", sa.Date(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["subject_id"], ["subjects.id"]),
        sa.UniqueConstraint("subject_id", "class_name", "session_date", name="uq_attendance_subject_class_date"),
    )
    op.create_index("ix_attendance_sessions_subject_id", "attendance_sessions", ["subject_id"], unique=False)
    op.create_index("ix_attendance_sessions_class_name", "attendance_sessions", ["class_name"], unique=False)
    op.create_index("ix_attendance_sessions_session_date", "attendance_sessions", ["session_date"], unique=False)

    op.create_table(
        "attendance_marks",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("attendance_session_id", sa.Integer(), nullable=False),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.Column("present", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["attendance_session_id"], ["attendance_sessions.id"]),
        sa.ForeignKeyConstraint(["student_id"], ["students.id"]),
        sa.UniqueConstraint("attendance_session_id", "student_id", name="uq_attendance_session_student"),
    )
    op.create_index("ix_attendance_marks_attendance_session_id", "attendance_marks", ["attendance_session_id"], unique=False)
    op.create_index("ix_attendance_marks_student_id", "attendance_marks", ["student_id"], unique=False)

    op.create_table(
        "results",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.Column("subject_id", sa.Integer(), nullable=False),
        sa.Column("exam_id", sa.Integer(), nullable=True),
        sa.Column("marks_obtained", sa.Integer(), nullable=False),
        sa.Column("max_marks", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["student_id"], ["students.id"]),
        sa.ForeignKeyConstraint(["subject_id"], ["subjects.id"]),
        sa.ForeignKeyConstraint(["exam_id"], ["exams.id"]),
    )
    op.create_index("ix_results_student_id", "results", ["student_id"], unique=False)
    op.create_index("ix_results_subject_id", "results", ["subject_id"], unique=False)


def downgrade() -> None:
    op.drop_table("results")
    op.drop_table("attendance_marks")
    op.drop_table("attendance_sessions")
    op.drop_table("assignment_submissions")
    op.drop_table("assignments")
    op.drop_table("exams")
    op.drop_table("announcements")
    op.drop_table("enrollments")
    op.drop_table("subjects")
    op.drop_table("parents")
    op.drop_table("students")
    op.drop_table("teachers")
    op.drop_table("users")

