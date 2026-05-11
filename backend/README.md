# EduVerse LMS Backend (FastAPI)

## Setup (Windows PowerShell)

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
set PYTHONPATH=.
alembic upgrade head
py scripts\seed.py
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Demo logins after seed: **admin** / **admin123**, **student** / **student123**. If those stop working, run **`py scripts\seed.py`** again from `backend` (it resets demo password hashes).

Backend will be available at:
- `http://127.0.0.1:8000/api/health`
- Swagger: `http://127.0.0.1:8000/docs`

With the repo’s **Vite dev proxy**, you usually **do not** need `VITE_*` vars: the UI calls `/api` and Vite forwards to `http://127.0.0.1:8000`. Run the UI with `npm run dev` (port **8080** in this project).

Only set explicit URLs if you skip the proxy, for example in the project root `.env`:

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_WS_BASE_URL=ws://127.0.0.1:8000/ws
```

## Windows: `WinError 10013` when starting Uvicorn

That error means Windows refused the bind (port blocked, reserved, or in use). Try, in order:

1. **Use another port** (often fixes it immediately):  
   `uvicorn app.main:app --reload --host 127.0.0.1 --port 8080`  
   Then set `VITE_API_BASE_URL` / `VITE_WS_BASE_URL` to match.

2. **See if the port is in an excluded range** (Hyper-V / NAT):  
   Run in an elevated PowerShell:  
   `netsh interface ipv4 show excludedportrange protocol=tcp`  
   If your port falls inside a range, pick a port outside those ranges.

3. **Check something else is not already listening**:  
   `netstat -ano | findstr :8000` (or whatever port you chose).

