# PROJECT REPORT

## EduVerse LMS — eLearning Management System with Multi-Role Admin Dashboard

---

**Project Title:** EduVerse LMS — Web-Based Learning Management System with Admin, Teacher, and Student Portals  

**Project Type:** Full-Stack Web Application  

**Document:** Technical Project Report  

---

## Abstract

This report presents the design, development, and implementation of **EduVerse LMS**, a web-based Learning Management System intended to support educational institutions in managing academic operations through a centralized platform. The system provides role-specific interfaces for administrators, teachers, and students, enabling user management, subject allocation, attendance tracking, announcement dissemination, examination and assignment management, and publication of academic results. The application follows a modern three-tier architecture comprising a React-based single-page frontend, a FastAPI REST backend, and a SQLite relational database. Authentication is enforced through JSON Web Tokens (JWT) with role-based access control. Real-time data refresh is supported via WebSocket connections. The report describes system requirements, architectural decisions, technology selection, module-wise functionality, security measures, and directions for future enhancement.

---

## 1. Introduction

### 1.1 Background

Educational institutions require integrated software systems to coordinate administrative tasks, classroom activities, and student-facing services. Traditional paper-based or fragmented spreadsheet workflows are error-prone, difficult to audit, and poorly suited to multi-stakeholder access patterns involving administrators, faculty, students, and parents. A Learning Management System (LMS) addresses these challenges by providing a unified digital environment for academic record-keeping, communication, and performance monitoring.

### 1.2 Motivation

The motivation for this project is to deliver a practical, deployable LMS prototype that demonstrates end-to-end full-stack development skills: secure authentication, RESTful API design, relational data modelling, responsive user interfaces, and optional real-time updates. The system prioritizes clarity of role separation so that each user category accesses only the functionality relevant to their responsibilities.

### 1.3 Problem Statement

Institutions often lack a single application through which administrators can onboard staff and students, assign teachers to subjects, record attendance, publish announcements, and manage results, while teachers can initiate student enrollment requests and students can view personalized academic information. The problem addressed by this project is the **absence of an integrated, role-aware LMS** that connects administrative control with teacher workflows and student self-service in one cohesive application.

---

## 2. Objectives

### 2.1 Primary Objectives

1. To design and implement a secure, multi-role web application for learning management.
2. To provide an **administrator portal** for managing teachers, students, parents, subjects, attendance, announcements, and results.
3. To provide a **teacher portal** for submitting student enrollment requests to administrators.
4. To provide a **student portal** for viewing subjects, exams, assignments, attendance, announcements, and results relevant to the logged-in user.
5. To persist all operational data in a relational database with version-controlled schema migrations.
6. To expose a documented REST API and support live UI refresh through WebSocket notifications.

### 2.2 Secondary Objectives

1. To use industry-standard frameworks (React, FastAPI) that support maintainability and scalability.
2. To ensure API request and response validation through schema-driven models.
3. To demonstrate a complete development lifecycle including seed data, environment configuration, and deployment-ready build scripts.

---

## 3. Scope of the Project

### 3.1 In Scope

- User authentication and authorization (admin, teacher, student; parent entity in database with limited UI).
- Admin dashboard with aggregate statistics.
- CRUD-oriented management of teachers, students, parents, and subjects.
- Class-wise filtering of subjects, attendance, and results.
- Teacher-to-admin student request workflow with approval and automatic account creation.
- Student-facing read-only views of academic data tied to enrollments.
- WebSocket-based cache invalidation for near real-time UI updates.
- Database migrations and demo data seeding.

### 3.2 Out of Scope

- Payment or fee collection gateway integration (dashboard may display summary placeholders only).
- Parent login portal (parent records exist; dedicated parent UI is not fully implemented).
- Mobile native applications (web responsive only).
- Email/SMS notification delivery.
- File upload storage for assignments (metadata and status tracking are supported at API level where applicable).
- Production deployment on cloud infrastructure (local development configuration is documented).

---

## 4. System Analysis

### 4.1 Functional Requirements

| ID | Requirement | Role |
|----|-------------|------|
| FR-01 | The system shall allow users to log in with username and password and receive a JWT. | All |
| FR-02 | The system shall restrict API routes based on user role. | All |
| FR-03 | The administrator shall view dashboard statistics (counts of users, subjects, etc.). | Admin |
| FR-04 | The administrator shall add, list, and manage teacher records. | Admin |
| FR-05 | The administrator shall list students and parents. | Admin |
| FR-06 | The administrator shall create, assign teachers to, and remove subjects by class. | Admin |
| FR-07 | The administrator shall view and export attendance by class and subject. | Admin |
| FR-08 | The administrator shall create announcements for selected audiences. | Admin |
| FR-09 | The administrator shall view class-wise examination results. | Admin |
| FR-10 | The administrator shall approve or reject teacher-initiated student requests. | Admin |
| FR-11 | Upon approval, the system shall create a student user account and enroll the student in the teacher’s subjects for that class. | Admin |
| FR-12 | The teacher shall submit a student join request for a class in which they teach. | Teacher |
| FR-13 | The teacher shall view the status of submitted requests. | Teacher |
| FR-14 | The student shall view enrolled subjects, exams, assignments, attendance, announcements, and results. | Student |
| FR-15 | The student shall submit assignment responses where applicable. | Student |
| FR-16 | The system shall broadcast events over WebSocket to connected clients by role. | System |

### 4.2 Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | **Security:** Passwords shall be stored using one-way hashing (PBKDF2-SHA256). |
| NFR-02 | **Performance:** API responses for list operations shall complete within acceptable time for demo-scale data (SQLite, local deployment). |
| NFR-03 | **Usability:** The interface shall be responsive and organized by role-specific navigation. |
| NFR-04 | **Maintainability:** Backend and frontend shall be separated; API contracts documented via OpenAPI. |
| NFR-05 | **Portability:** Database connection shall be configurable via environment variables. |
| NFR-06 | **Reliability:** Schema changes shall be applied through Alembic migrations. |

### 4.3 User Roles and Actors

| Actor | Description |
|-------|-------------|
| **Administrator** | Full operational control over institutional data and approval workflows. |
| **Teacher** | Faculty member assigned to subjects; may request enrollment of new students. |
| **Student** | Learner enrolled in subjects; consumes academic information. |
| **Parent** | Guardian record (data model present; dedicated portal not fully implemented). |

---

## 5. System Design

### 5.1 Architectural Overview

The system adopts a **client–server architecture** with a decoupled frontend and backend:

1. **Presentation Layer:** React SPA served by Vite during development; static assets after production build.
2. **Application Layer:** FastAPI application exposing REST endpoints and a WebSocket endpoint.
3. **Data Layer:** SQLite database accessed through SQLAlchemy ORM.

Communication between the browser and server uses HTTP/JSON for REST operations and WebSocket for push-style notifications. During development, the Vite development server proxies `/api` and `/ws` to the backend to avoid cross-origin issues.

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                          │
│  React SPA │ React Router │ React Query │ Axios │ WebSocket   │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP / WS
┌────────────────────────────▼────────────────────────────────┐
│                    SERVER (FastAPI + Uvicorn)                  │
│  Auth │ Admin API │ Student API │ Teacher API │ WS Manager     │
└────────────────────────────┬────────────────────────────────┘
                             │ SQLAlchemy ORM
┌────────────────────────────▼────────────────────────────────┐
│                    DATABASE (SQLite)                         │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Database Design

The relational schema includes the following principal entities and relationships:

| Entity | Description |
|--------|-------------|
| **User** | Authentication identity (username, password hash, role, active flag). |
| **Teacher** | Profile linked to User; department, email. |
| **Student** | Profile linked to User; class, roll number, email. |
| **Parent** | Profile linked to User; contact details. |
| **Subject** | Course offering (name, code, class, optional teacher_id). |
| **Enrollment** | Many-to-many link between Student and Subject. |
| **Announcement** | Title, description, audience, timestamp. |
| **Exam** | Scheduled assessment linked to Subject. |
| **Assignment** | Task linked to Subject; due date. |
| **AssignmentSubmission** | Student submission status per assignment. |
| **AttendanceSession** | Class session for a subject on a date. |
| **AttendanceMark** | Present/absent mark per student per session. |
| **Result** | Marks obtained per student per subject. |
| **TeacherStudentRequest** | Pending/approved/rejected enrollment request from teacher. |

Schema evolution is managed through **Alembic** migration scripts (e.g. initial schema, teacher student requests table).

### 5.3 Module Decomposition

| Module | Responsibility |
|--------|----------------|
| **Authentication** | Login, token issuance, `/auth/me`, logout. |
| **Administration** | CRUD and reporting for institutional entities. |
| **Student Services** | Read APIs scoped to enrolled student. |
| **Teacher Services** | Dashboard and student request submission. |
| **Real-time** | WebSocket connection manager and event broadcast. |
| **Onboarding Service** | Username generation and student account creation on request approval. |

---

## 6. Technology Stack

### 6.1 Frontend Technologies

| Technology | Purpose |
|------------|---------|
| React 18 | Component-based user interface |
| Vite 5 | Build tool and development server |
| React Router DOM v6 | Client-side routing |
| TanStack React Query v5 | Server state management and caching |
| Axios | HTTP client |
| Tailwind CSS 3 | Styling |
| shadcn/ui (Radix UI) | Accessible UI components |
| Recharts | Statistical charts on admin dashboard |
| Lucide React | Iconography |
| WebSocket API | Real-time event handling |

### 6.2 Backend Technologies

| Technology | Purpose |
|------------|---------|
| Python 3.x | Server-side language |
| FastAPI 0.115 | REST API framework |
| Uvicorn | ASGI application server |
| SQLAlchemy 2.0 | Object-relational mapping |
| Alembic | Database migrations |
| Pydantic v2 | Data validation and settings |
| python-jose | JWT encoding and decoding |
| passlib (PBKDF2-SHA256) | Password hashing |
| SQLite | Embedded relational database |

### 6.3 Justification for Technology Selection

**FastAPI** was selected over alternatives such as Flask because it provides native integration with Pydantic for automatic validation, auto-generated OpenAPI documentation, and first-class ASGI support including WebSockets. **React** was selected for its component ecosystem and suitability for single-page administrative dashboards. **SQLite** was chosen for simplicity in academic and demonstration deployments; the ORM layer allows migration to PostgreSQL or MySQL with minimal code change.

---

## 7. Implementation Details

### 7.1 Authentication and Authorization

Upon successful login, the server issues a JWT access token containing the subject (username) and role. The frontend stores the token in browser local storage and attaches it to subsequent API requests via an Axios interceptor. Protected routes on the backend use dependency injection (`require_role`) to permit only authorized roles. WebSocket connections require the token as a query parameter; invalid tokens result in connection rejection.

### 7.2 Administrator Module

The administrator interface includes:

- **Dashboard:** Displays live counts of students, teachers, parents, and LMS activity metrics sourced from `/api/admin/dashboard/stats`.
- **Teachers:** Lists faculty with subjects taught and class assignments derived from subject linkage.
- **Add Teacher:** Creates User and Teacher records with administrator-defined credentials.
- **Students and Parents:** Read-only listing from database records.
- **Subjects:** Class-filtered subject management; teachers assignable via dropdown; PATCH endpoint updates `teacher_id`.
- **Attendance:** Filter by class and subject; tabular view with percentage calculation; CSV export.
- **Announcements:** Create announcements for audiences (all, students, teachers, parents).
- **Results:** Class-wise aggregated results with per-student detail dialog.
- **Requests:** Review teacher-submitted student requests; approve (account creation) or reject.

### 7.3 Teacher Module

Teachers access `/teacher` after login. The dashboard summarizes subjects taught, enrolled student count, and pending requests. The **Request Student** form validates that the selected class is one in which the teacher is assigned to at least one subject. Submitted requests appear in the admin **Requests** tab with status tracking.

### 7.4 Student Module

Students access `/student` routes. All data is filtered server-side to the authenticated student’s enrollments and profile. Modules include Subjects (with teacher name), Exams, Assignments (with submission action), Attendance (aggregated by subject), Announcements (audience-filtered), and Results (with grade display).

### 7.5 Student Onboarding Workflow

When an administrator approves a teacher request:

1. A unique username is generated from the student’s full name (lowercase alphanumeric slug; numeric suffix if collision).
2. Password is set to `{username}123`.
3. User and Student rows are created.
4. Enrollments are created for all subjects taught by the requesting teacher in the specified class.
5. Credentials are returned once in the approval response for administrative distribution.
6. WebSocket events notify connected clients to refresh relevant queries.

### 7.6 Real-Time Updates

A `ConnectionManager` maintains WebSocket connections grouped by role. Backend operations (e.g. new announcement, result publication, request creation) trigger `broadcast` calls. The frontend invalidates React Query caches on any WebSocket message, prompting refetch of admin and student data without manual page reload.

---

## 8. Security Considerations

| Measure | Implementation |
|---------|----------------|
| Password storage | One-way hashing via PBKDF2-SHA256 (passlib) |
| Session/token | Stateless JWT with configurable expiry |
| API protection | Bearer token required; role checks per endpoint |
| CORS | Configurable allowed origins via environment |
| Input validation | Pydantic models on request bodies and query parameters |
| SQL injection mitigation | Parameterized queries through SQLAlchemy ORM |

**Recommendations for production:** Use HTTPS, strong `JWT_SECRET`, PostgreSQL with backups, rate limiting, and password policy enforcement beyond demo defaults.

---

## 9. Testing and Validation

Testing for this project was conducted primarily through **manual functional testing** and **API verification**:

| Activity | Method |
|----------|--------|
| Login and role routing | Manual UI testing per role |
| CRUD operations | Admin UI + Swagger `/docs` |
| Teacher request workflow | End-to-end scenario: request → approve → student login |
| Authorization | Access admin routes with student token (expect 403) |
| Database integrity | Alembic upgrade and seed script execution |
| Build verification | `npm run build` for frontend production bundle |

Automated unit and integration test suites are identified as a future enhancement.

---

## 10. Results and Discussion

The implemented system successfully demonstrates:

1. **Unified administration** of academic entities through a single dashboard.
2. **Workflow automation** for student onboarding via teacher requests and admin approval.
3. **Role isolation** ensuring students access only their own academic records.
4. **API-first design** enabling future mobile or third-party clients.
5. **Developer ergonomics** through OpenAPI documentation and hot-reload development servers.

The application runs locally with frontend on port **8080** and backend on port **8000**, with demo credentials provided by the seed script (`admin`/`admin123`, `teacher`/`teacher123`, `student`/`student123`).

---

## 11. Limitations

1. SQLite is suitable for demonstration but has concurrency limitations for large-scale production.
2. Parent portal functionality is not fully developed despite parent records in the database.
3. Fee management UI may display summary concepts without full financial transaction backend.
4. WebSocket scaling requires a shared pub/sub layer (e.g. Redis) in multi-server deployments.
5. Automated test coverage is limited.
6. Assignment file uploads are not fully implemented as binary storage.

---

## 12. Future Enhancements

1. Implement dedicated **parent portal** with child progress views.
2. Migrate production database to **PostgreSQL** with connection pooling.
3. Add **email notifications** for announcements and request status changes.
4. Introduce **automated test suites** (pytest, Vitest/React Testing Library).
5. Support **document upload** for assignments and teacher materials.
6. Add **analytics dashboards** (trends in attendance and performance).
7. Deploy using **Docker** and CI/CD pipelines.
8. Implement **password reset** and **profile management** for all roles.

---

## 13. Conclusion

The EduVerse LMS project delivers a functional, full-stack Learning Management System that addresses core institutional needs: user and subject management, attendance and results tracking, announcements, and a governed workflow for enrolling new students. By employing React and FastAPI with a clear separation of concerns, JWT-based security, and relational data modelling, the system provides a solid foundation for academic demonstration and further industrial hardening. The report has outlined requirements, design decisions, implementation modules, and a roadmap for future work. The project demonstrates competence in modern web development practices applicable to real-world educational technology solutions.

---

## 14. References

1. FastAPI Documentation — https://fastapi.tiangolo.com/  
2. React Documentation — https://react.dev/  
3. SQLAlchemy Documentation — https://docs.sqlalchemy.org/  
4. TanStack Query Documentation — https://tanstack.com/query/  
5. JWT (RFC 7519) — JSON Web Token specification  
6. Alembic Documentation — https://alembic.sqlalchemy.org/  
7. Tailwind CSS Documentation — https://tailwindcss.com/  
8. shadcn/ui Documentation — https://ui.shadcn.com/  

---

## Appendix A — Installation Summary

Refer to the project **README.md** for step-by-step setup of backend (Python virtual environment, Alembic, seed script, Uvicorn) and frontend (`npm install`, `npm run dev`).

## Appendix B — API Endpoint Summary

| Module | Base Path |
|--------|-----------|
| Authentication | `/api/auth` |
| Administration | `/api/admin` |
| Student | `/api/student` |
| Teacher | `/api/teacher` |
| Health | `/api/health` |
| WebSocket | `/ws` |
| Interactive API docs | `/docs` |

---

**End of Report**
