from pathlib import Path

import asyncpg, uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from auth          import router as auth_router,  init_users_table
from chat          import router as chat_router,  init_chat_schema
from gesture_model import router as model_router
from audio         import router as audio_router              # ← NEW

app = FastAPI()

# ───── media директория (создадим сразу) ────────────────────────────
MEDIA_DIR = Path(__file__).parent / "media"
MEDIA_DIR.mkdir(exist_ok=True)

# ───── подключаем роутеры ───────────────────────────────────────────
app.include_router(auth_router)
app.include_router(model_router)
app.include_router(chat_router)
app.include_router(audio_router)          # ← сначала кастомный аудио-роутер

# ───── а затем монтируем статику /media ─────────────────────────────
app.mount("/media", StaticFiles(directory=str(MEDIA_DIR)), name="media")

# ───── CORS ─────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", "http://localhost:5173",
        "http://127.0.0.1:3000", "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ───── PostgreSQL pool ──────────────────────────────────────────────
@app.on_event("startup")
async def open_pool():
    pool = await asyncpg.create_pool(
        host="localhost",
        port=5432,
        user="postgres",
        password="123",
        database="diploma",
    )
    app.state.db = pool
    await init_users_table(pool)
    await init_chat_schema(pool)
    print("✅  Connected to PostgreSQL 'diploma'")

@app.on_event("shutdown")
async def close_pool():
    await app.state.db.close()
    print("ℹ️  PostgreSQL pool closed")

# ───── run ──────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
