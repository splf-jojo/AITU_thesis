# AITU Thesis

Web application for sign-language recognition with a FastAPI backend and a React/Vite frontend.

## Structure

```text
backend/   FastAPI API, PostgreSQL access, gesture model, and media endpoints
frontend/  React/Vite web client
```

## Backend

```bash
cd backend
python -m venv .venv

# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# Linux / WSL
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

PostgreSQL settings are currently in `backend/app.py`. The gesture-recognition model `backend/mvit32-2.pt` is intentionally not tracked because it exceeds GitHub's file-size limit; place it beside `backend/gesture_model.py` before using recognition endpoints.

## Frontend

```bash
cd frontend
npm ci
npm run dev
```

The Vite development server runs separately and communicates with the FastAPI API at `http://localhost:8000`.
