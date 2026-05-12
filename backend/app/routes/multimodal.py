import logging

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.mimo_client import analyze_audio, analyze_image

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/multimodal", tags=["Multimodal"])


@router.post("/analyze-image")
async def analyze_image_endpoint(
    file: UploadFile = File(...),
    prompt: str = Form(default="Describe this image in detail."),
    model: str = Form(default="MiMo-V2.5"),
    max_tokens: int = Form(default=2048),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        image_data = await file.read()
        result = await analyze_image(
            image_data=image_data,
            prompt=prompt,
            model=model,
            max_tokens=max_tokens,
        )
        return result

    except Exception as e:
        logger.error("Image analysis error: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/analyze-audio")
async def analyze_audio_endpoint(
    file: UploadFile = File(...),
    prompt: str = Form(default="Transcribe and describe this audio."),
    model: str = Form(default="MiMo-V2.5"),
    max_tokens: int = Form(default=2048),
):
    if not file.content_type or not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be an audio file")

    try:
        audio_data = await file.read()
        result = await analyze_audio(
            audio_data=audio_data,
            prompt=prompt,
            model=model,
            max_tokens=max_tokens,
        )
        return result

    except Exception as e:
        logger.error("Audio analysis error: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e
