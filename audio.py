# backend/audio.py
from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from audio_generate import tts_save

router = APIRouter(prefix="/audio")

AUDIO_DIR = Path(__file__).with_name("media") / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/{name:path}")          # :path — разрешаем слэши/точки
async def get_audio(name: str):
    """
    /audio/{name}
    • если пришло «левый»   → сгенерируем/save «левый.mp3»
    • если пришло «левый.mp3» → то же самое (расширение отрежем)
    """
    bare = Path(name).stem           # ❱ 'левый.mp3' → 'левый'
    mp3  = AUDIO_DIR / f"{bare}.mp3" # ровно одно .mp3

    if not mp3.is_file():
        try:
            tts_save(text=bare, out_path=mp3)
        except Exception as e:
            print("[TTS error]", e)
            raise HTTPException(500, f"TTS generate failed: {e}")

    if not mp3.is_file():
        raise HTTPException(404, f"No audio for «{bare}»")

    return FileResponse(mp3, media_type="audio/mpeg")
