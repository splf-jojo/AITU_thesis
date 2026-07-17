from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from pydantic import BaseModel, EmailStr
from jose import jwt, JWTError
import asyncpg, os

# ------------------------------ конфиг --------------------------------------
JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-demo-key")
JWT_ALG    = "HS256"
JWT_TTL    = timedelta(hours=6)

router = APIRouter()

# ------------------------------ модель --------------------------------------
class Creds(BaseModel):
    email: EmailStr
    password: str

# ------------------------------ DDL -----------------------------------------
async def init_users_table(pool):
    ddl = """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );
    """
    async with pool.acquire() as c:
        await c.execute(ddl)

# ------------------------------ deps ----------------------------------------
def get_db(request: Request):
    return request.app.state.db

def create_token(user_id: int, email: str) -> str:
    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": datetime.utcnow() + JWT_TTL,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

async def verify_token(
    authorization: Optional[str] = Header(None, alias="Authorization"),
    db = Depends(get_db),
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.removeprefix("Bearer ").strip()
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        uid = int(payload["sub"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid / expired token")

    async with db.acquire() as c:
        user = await c.fetchrow("SELECT id, email FROM users WHERE id=$1", uid)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user   # можно вернуть id/email

# ------------------------------ endpoints -----------------------------------
@router.post("/register", status_code=201)
async def register(creds: Creds, db=Depends(get_db)):
    async with db.acquire() as c:
        exists = await c.fetchval("SELECT 1 FROM users WHERE email=$1", creds.email)
        if exists:
            raise HTTPException(409, "User already exists")
        row = await c.fetchrow(
            "INSERT INTO users (email, password) VALUES ($1,$2) RETURNING id",
            creds.email, creds.password        # TODO: hash!
        )
    token = create_token(row["id"], creds.email)
    return {"access_token": token}

@router.post("/login")
async def login(creds: Creds, db=Depends(get_db)):
    async with db.acquire() as c:
        row = await c.fetchrow(
            "SELECT id FROM users WHERE email=$1 AND password=$2",
            creds.email, creds.password,
        )
        if not row:
            raise HTTPException(401, "Invalid credentials")
    token = create_token(row["id"], creds.email)
    return {"access_token": token}
