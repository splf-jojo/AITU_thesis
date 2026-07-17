# audio_generate.py  –  вспомогательный модуль
import io, soundfile as sf
from pathlib import Path
import torch

# загрузим один раз при импорте
TTS_MODEL, _ = torch.hub.load(
    repo_or_dir='snakers4/silero-models',
    model='silero_tts',
    language='ru',
    speaker='v4_ru'      # или 'aidar' (м)
)

AUDIO_DIR = Path(__file__).parent / 'media' / 'audio'
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

# audio_generate.py
def tts_save(text: str, out_path: Path) -> Path:
    """
    Генерирует mp3 для `text`, если файла ещё нет.
    out_path ДОЛЖЕН включать правильное имя + .mp3
    """
    # ── out_path мог прийти с повторным .mp3 ───────────────
    if out_path.suffix.lower() != ".mp3":          # ← проверяем
        out_path = out_path.with_suffix(".mp3")    #   ставим ровно один раз

    if out_path.is_file():
        return out_path            # уже сгенерирован – выходим

    # ① TTS → wav (в память)
    with torch.no_grad():
        wav = TTS_MODEL.apply_tts(text, sample_rate=48_000)

    # ② wav → mp3
    data = io.BytesIO()
    sf.write(data, wav, 48_000, format="WAV")
    data.seek(0)

    from pydub import AudioSegment
    AudioSegment.from_wav(data).export(out_path, format="mp3")

    print(f"[AUDIO GEN] '{text}'  →  {out_path.name}")
    return out_path
