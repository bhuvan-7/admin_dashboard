# EduVerse LMS — Admin Dashboard

A full-stack **Learning Management System (LMS)** with separate portals for **admin**, **teacher**, and **student** roles. Admins manage users, subjects, attendance, announcements, and results; teachers request new students for approval; students view their enrolled subjects, exams, assignments, attendance, and grades.

---

## Architecture

| Layer | Technology |
|--------|------------|
| **Pattern** | SPA (Single Page Application) + REST API + WebSocket |
| **Frontend** | React 18 + Vite 5 |
| **Backend** | FastAPI (Python) on Uvicorn (ASGI) |
| **Database** | SQLite (SQLAlchemy ORM) |
| **Auth** | JWT access tokens + role-based access control (RBAC) |
| **Real-time** | WebSocket (`/ws`) with server-side broadcast by role |

```
Browser (React @ :8080)
    │  HTTP  /api/*  ──► Vite proxy ──► FastAPI @ :8000
    │  WS    /ws     ──► Vite proxy ──► FastAPI WebSocket
    └── SQLite (backend/lms.db)
```

---

## Tech stack (detailed)

### Frontend

| Category | Technologies |
|----------|----------------|
| **Core** | React 18, React DOM, Vite 5, `@vitejs/plugin-react-swc` |
| **Language** | JavaScript (JSX) for pages; TypeScript for config and many UI components |
| **Routing** | React Router DOM v6 |
| **HTTP client** | Axios (`/api` base URL) |
| **Server state** | TanStack React Query v5 (caching, refetch, invalidation on WebSocket events) |
| **Styling** | Tailwind CSS 3, PostCSS, Autoprefixer, `tailwindcss-animate` |
| **UI kit** | [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives + Tailwind) |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Notifications** | Sonner + Radix Toast |
| **Forms (available)** | React Hook Form, Zod, `@hookform/resolvers` |
| **Utilities** | `clsx`, `tailwind-merge`, `class-variance-authority` |
| **Fonts** | Google Fonts — Poppins |
| **Real-time** | Native WebSocket API (`src/lib/ws.js`) |
| **Linting** | ESLint 9, TypeScript ESLint, React Hooks plugin |

### Backend

| Category | Technologies |
|----------|----------------|
| **Runtime** | Python 3.x |
| **Framework** | FastAPI 0.115 |
| **Server** | Uvicorn (ASGI) |
| **ORM** | SQLAlchemy 2.0 |
| **Migrations** | Alembic |
| **Database** | SQLite (`sqlite:///./lms.db`) |
| **Validation** | Pydantic v2, pydantic-settings |
| **Auth** | python-jose (JWT), passlib (`pbkdf2_sha256` password hashing) |
| **CORS** | FastAPI CORSMiddleware |
| **API docs** | OpenAPI / Swagger at `/docs` |
| **Real-time** | Starlette WebSockets + custom `ConnectionManager` |

### API modules

| Prefix | Purpose |
|--------|---------|
| `/api/auth` | Login, refresh, logout, current user |
| `/api/admin` | Dashboard stats, teachers, students, parents, subjects, attendance, announcements, results, requests |
| `/api/student` | Enrolled subjects, exams, assignments, attendance, announcements, results |
| `/api/teacher` | Dashboard summary, student join requests |
| `/api/health` | Health check |
| `/ws` | Real-time events (JWT via query `token`) |

### Domain models (database)

Users, Teachers, Students, Parents, Subjects, Enrollments, Announcements, Exams, Assignments, Assignment submissions, Attendance sessions & marks, Results, Teacher student requests.

---

## Features by role

### Admin
- Dashboard overview (live counts from API)
- Manage teachers, students, parents
- Subjects per class (assign teachers to subjects)
- Attendance by class and subject
- Announcements (multi-audience)
- Results by class
- Approve or decline **teacher student requests** (creates student login on approve)

### Teacher
- Teacher dashboard (`/teacher`)
- Request new students for classes they teach
- Track request status (pending / approved / rejected)

### Student
- Student portal (`/student/*`)
- Subjects, exams, assignments, attendance, announcements, results

### Credentials rules
- **Teachers** (added by admin): username and password set on **Add Teacher** form.
- **Students** (approved from teacher request): username derived from full name (e.g. `janedoe`), password **`{username}123`** (shown once to admin on approve).
- **Demo users** (after seed): see below.

---

## Project structure

```
admin_dashboard/
├── src/                    # React frontend
│   ├── pages/              # Route pages (admin, student, teacher)
│   ├── components/         # UI, layout, dialogs
│   ├── lib/                # axios, websocket, utils
│   └── App.jsx             # Routes & auth shell
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── api/routes/     # auth, admin, student, teacher
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic (e.g. student onboarding)
│   │   ├── realtime/       # WebSocket manager
│   │   └── main.py
│   ├── alembic/            # Migrations
│   ├── scripts/seed.py     # Demo data
│   └── requirements.txt
├── vite.config.ts          # Dev server + API/WS proxy
└── package.json
```

---

## Getting started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+ (3.11+ recommended)
- Windows: PowerShell; if venv activation is blocked:  
  `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

### 1. Backend setup

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
$env:PYTHONPATH = "."
alembic upgrade head
py scripts\seed.py
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- API health: http://127.0.0.1:8000/api/health  
- Swagger docs: http://127.0.0.1:8000/docs  

More backend notes: [backend/README.md](backend/README.md)

### 2. Frontend setup

From the **project root**:

```powershell
npm install
npm run dev
```

- App: http://localhost:8080  
- Vite proxies `/api` and `/ws` to `http://127.0.0.1:8000` (no extra env vars needed in dev).

### 3. Run both in one terminal (optional, PowerShell)

From project root:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
Start-Job -ScriptBlock { Set-Location backend; if (!(Test-Path .venv)) { py -m venv .venv }; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt; alembic upgrade head; py scripts\seed.py; uvicorn app.main:app --reload --port 8000 } | Out-Null; npm run dev
```

---

## Demo logins (after `seed.py`)

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Student | `student` | `student123` |
| Teacher | `teacher` | `teacher123` |

On the login screen, select the matching **role tile**, then enter the credentials.

If login fails after DB changes, run `py scripts\seed.py` again from `backend`.

---

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Default `sqlite:///./lms.db` |
| `JWT_SECRET` | Change in production |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | Default 15 |
| `FRONTEND_ORIGINS` | CORS allowed origins (comma-separated) |

### Frontend (optional)

Only needed if **not** using the Vite proxy:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_WS_BASE_URL=ws://127.0.0.1:8000/ws
```

---

## NPM scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 8080) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Why FastAPI (for evaluators)

This project uses **FastAPI** instead of Flask because it fits a typed JSON API with auth and WebSockets: **Pydantic** validates requests/responses, **OpenAPI** docs are generated at `/docs`, and **ASGI** supports async I/O and WebSockets on the same server. **SQLAlchemy** and **Alembic** keep the database layer portable (SQLite for demo; PostgreSQL is a config change via `DATABASE_URL`).

---

## License

Private / academic project.
