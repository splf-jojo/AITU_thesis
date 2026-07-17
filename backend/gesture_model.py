from __future__ import annotations

import json, os, uuid
from pathlib import Path
from tempfile import NamedTemporaryFile
from typing import List

import numpy as np
import torch
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from auth import get_db, verify_token
from constants import classes
from video_utils import extract_frames, preprocess, sample_frames

# --------------------------------------------------------------------------- #
#                         Static / model initialisation                       #
# --------------------------------------------------------------------------- #
router = APIRouter()

MODEL_PATH = "mvit32-2.pt"
NUM_FRAMES = 32

print("Загрузка модели жестов…")
_model = torch.jit.load(MODEL_PATH).eval()
_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
_model = _model.to(_device)
print("Модель готова, устройство:", _device)

# папка media та же, что монтируется в app.py
MEDIA_DIR: Path = Path(__file__).with_name("media")
MEDIA_DIR.mkdir(exist_ok=True)

# --------------------------------------------------------------------------- #
#                                 helpers                                     #
# --------------------------------------------------------------------------- #
def _unique_name(original: str) -> str:
    """Генерируем UUID + сохраняем исходное расширение."""
    ext = Path(original).suffix or ".mp4"
    return f"{uuid.uuid4().hex}{ext}"


def _infer_frames(frames: list[np.ndarray]) -> List[dict]:
    """Запуск модели на подготовленных кадрах."""
    x = np.stack(frames)
    x = np.transpose(x, (1, 0, 2, 3))[None, None]
    x = torch.from_numpy(x.astype(np.float32)).to(_device)

    with torch.no_grad():
        probs = torch.softmax(_model(x), dim=1)[0].cpu().numpy()

    top = probs.argsort()[::-1][:10]
    return [
        {"gesture": classes[i], "probability": (float(probs[i])*100)}
        for i in top
    ]


async def _store_messages(conn, chat_id: int, fname: str, preds: list[dict]):
    """Пишем сразу два сообщения — видео пользователя и ответ модели."""
    await conn.executemany(
        """
        INSERT INTO messages (chat_id, is_user, type, content)
        VALUES ($1, $2, $3, $4::jsonb)
        """,
        [
            (chat_id, True,  "video",      json.dumps({"name": fname})),
            (chat_id, False, "prediction", json.dumps(preds)),
        ],
    )

# --------------------------------------------------------------------------- #
#                                   endpoint                                  #
# --------------------------------------------------------------------------- #
@router.post("/predict")
async def predict(
    session_id: int,
    file: UploadFile = File(...),
    user=Depends(verify_token),
    db=Depends(get_db),
):
    """
    * сохраняем видео в папку **media/** под уникальным именем
    * прогоняем модель → топ-10 жестов
    * пишем оба сообщения в таблицу **messages**
    * возвращаем JSON с результатом
    """
    # ---------- 1. сохраняем -------------------------------------------------
    unique_fname = _unique_name(file.filename)
    saved_path = MEDIA_DIR / unique_fname

    # В Docker media может быть отдельным volume. Создаём временный файл в
    # той же файловой системе, чтобы os.replace оставался атомарным.
    with NamedTemporaryFile(dir=MEDIA_DIR, delete=False) as tmp:
        tmp.write(await file.read())
        tmp.flush()

    try:
        os.replace(tmp.name, saved_path)  # атомарно перемещаем в media/
    finally:
        # если os.replace не прошёл, tmp удалится GC-ом; если прошёл — файла уже нет
        if os.path.exists(tmp.name):
            os.remove(tmp.name)

    # ---------- 2. извлекаем кадры ------------------------------------------
    frames = extract_frames(str(saved_path))
    if not frames:
        saved_path.unlink(missing_ok=True)
        raise HTTPException(400, "Видео не читается или пустое")

    frames = [preprocess(f) for f in frames]
    frames = sample_frames(frames, NUM_FRAMES)

    # ---------- 3. инференс --------------------------------------------------
    preds = _infer_frames(frames)

    # ---------- 4. БД --------------------------------------------------------
    async with db.acquire() as conn:
        await _store_messages(conn, session_id, unique_fname, preds)

    # ---------- 5. ответ -----------------------------------------------------
    return JSONResponse({"top_predictions": preds})
