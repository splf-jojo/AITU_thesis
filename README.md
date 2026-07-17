# AITU Thesis

Web application for sign-language recognition with a FastAPI backend and a React/Vite frontend.

## Structure

- The repository root contains the FastAPI backend.
- `client/` contains the React frontend.

## Backend

Create a Python virtual environment, install dependencies, and start the API:

```bash
python -m venv .venv
.venv\\Scripts\\activate  # Windows PowerShell / cmd
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

The backend uses PostgreSQL configuration from `app.py`. The gesture-recognition model `mvit32-2.pt` is intentionally not tracked because it exceeds GitHub's file-size limit; provide it locally beside `gesture_model.py` before using recognition endpoints.

## Frontend

```bash
cd client
npm ci
npm run dev
```

The Vite development server runs separately and communicates with the FastAPI API.
