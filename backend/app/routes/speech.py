import logging

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import Response

from app.mimo_client import text_to_speech, voice_clone_tts
from app.models import TTSRequest

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/speech", tags=["Speech"])


@router.post("/tts")
async def tts_endpoint(request: TTSRequest):
    try:
        audio_bytes = await text_to_speech(
            text=request.text,
            voice=request.voice,
            model=request.model,
            speed=request.speed,
        )
        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={"Content-Disposition": "attachment; filename=speech.mp3"},
        )

    except Exception as e:
        logger.error("TTS error: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/voice-clone")
async def voice_clone_endpoint(
    text: str = Form(...),
    reference_audio: UploadFile = File(...),
    model: str = Form(default="MiMo-V2.5-TTS-VoiceClone"),
):
    if not reference_audio.content_type or not reference_audio.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Reference file must be audio")

    try:
        audio_data = await reference_audio.read()
        result_audio = await voice_clone_tts(
            text=text,
            reference_audio=audio_data,
            model=model,
        )

        if not result_audio:
            raise HTTPException(status_code=500, detail="Voice cloning produced no output")

        return Response(
            content=result_audio,
            media_type="audio/wav",
            headers={"Content-Disposition": "attachment; filename=cloned_speech.wav"},
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Voice clone error: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e
