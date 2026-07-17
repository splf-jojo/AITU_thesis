# backend/chat.py
from __future__ import annotations

import json
from datetime import datetime, date
from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from auth import get_db, verify_token

router = APIRouter()

# ────────────────────────────────────────────────────────────────────
#                           DB schema (DDL)
# ────────────────────────────────────────────────────────────────────
async def init_chat_schema(pool):
    ddl = """
    CREATE TABLE IF NOT EXISTS chats (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title      TEXT,
        created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS messages (
        id         SERIAL PRIMARY KEY,
        chat_id    INTEGER REFERENCES chats(id) ON DELETE CASCADE,
        is_user    BOOLEAN,
        type       TEXT,
        content    JSONB,
        created_at TIMESTAMP DEFAULT NOW()
    );
    """
    async with pool.acquire() as con:
        await con.execute(ddl)

# ────────────────────────────────────────────────────────────────────
#                               DTO
# ────────────────────────────────────────────────────────────────────
class ChatOut(BaseModel):
    id: int
    title: str | None
    created_at: datetime


class MsgOut(BaseModel):
    id: int
    is_user: bool
    type: str
    content: Any           # dict / list
    created_at: datetime


class TitleIn(BaseModel):
    title: str = Field(..., min_length=1, max_length=80)

# ────────────────────────────────────────────────────────────────────
#                       internal helpers
# ────────────────────────────────────────────────────────────────────
def _row_to_chat(row) -> dict:
    return {
        "id":         row["id"],
        "title":      row["title"],
        "created_at": row["created_at"],
    }


MEDIA_DIR = Path("media")
MEDIA_URL = "/media/"


def make_video_url(name: str) -> str:
    return f"{MEDIA_URL}{name}"


def _row_to_msg(row) -> dict:
    data = json.loads(row["content"])
    if row["type"] == "video" and isinstance(data, dict) and "name" in data:
        data = {"url": make_video_url(data["name"])}
    return {
        "id":         row["id"],
        "is_user":    row["is_user"],
        "type":       row["type"],
        "content":    data,
        "created_at": row["created_at"],
    }

# ────────────────────────────────────────────────────────────────────
#                             CRUD
# ────────────────────────────────────────────────────────────────────
@router.post("/sessions", response_model=ChatOut, status_code=201)
async def create_session(db=Depends(get_db), user=Depends(verify_token)):
    """
    Создаёт новый чат.
    Заголовок формируется автоматически:

    • первый чат дня → «Chat DD.MM.YYYY»
    • второй и далее  → «Chat DD.MM.YYYY N»
    """
    today: date = date.today()

    async with db.acquire() as con:
        # сколько чатов у пользователя уже есть СЕГОДНЯ
        count_today: int = await con.fetchval(
            """SELECT COUNT(*) FROM chats
               WHERE user_id=$1 AND DATE(created_at) = $2""",
            user["id"], today,
        )

        idx = count_today + 1
        date_str = today.strftime("%d.%m.%Y")
        title = f"Чат {date_str}" if idx == 1 else f"Чат {date_str} {idx}"

        row = await con.fetchrow(
            "INSERT INTO chats (user_id,title) VALUES ($1,$2) RETURNING *",
            user["id"], title
        )

    return _row_to_chat(row)


@router.get("/sessions", response_model=list[ChatOut])
async def list_sessions(db=Depends(get_db), user=Depends(verify_token)):
    async with db.acquire() as con:
        rows = await con.fetch(
            "SELECT * FROM chats WHERE user_id=$1 ORDER BY created_at DESC",
            user["id"],
        )
    return [_row_to_chat(r) for r in rows]


@router.patch("/sessions/{chat_id}", response_model=ChatOut)
async def rename_chat(
    chat_id: int, body: TitleIn,
    db=Depends(get_db), user=Depends(verify_token),
):
    async with db.acquire() as con:
        row = await con.fetchrow(
            """UPDATE chats SET title=$1
               WHERE id=$2 AND user_id=$3
               RETURNING *""",
            body.title, chat_id, user["id"],
        )
    if not row:
        raise HTTPException(404, detail="Chat not found")
    return _row_to_chat(row)


@router.delete("/sessions/{chat_id}", status_code=204)
async def delete_chat(
    chat_id: int,
    db=Depends(get_db), user=Depends(verify_token),
):
    async with db.acquire() as con:
        await con.execute(
            "DELETE FROM chats WHERE id=$1 AND user_id=$2",
            chat_id, user["id"],
        )

# ────────────────────────────────────────────────────────────────────
#                     messages inside a chat
# ────────────────────────────────────────────────────────────────────
@router.get("/messages", response_model=list[MsgOut])
async def list_messages(
    session_id: int,
    db=Depends(get_db), user=Depends(verify_token),
):
    async with db.acquire() as con:
        rows = await con.fetch(
            """SELECT m.* FROM messages m
               JOIN chats c ON c.id=m.chat_id
               WHERE c.id=$1 AND c.user_id=$2
               ORDER BY m.created_at""",
            session_id, user["id"],
        )
    return [_row_to_msg(r) for r in rows]
