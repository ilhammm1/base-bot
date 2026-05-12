import logging

from fastapi import APIRouter, HTTPException

from app.mimo_client import summarize_text, translate_text
from app.models import SummarizationRequest, TranslationRequest

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/tools", tags=["AI Tools"])


@router.post("/translate")
async def translate_endpoint(request: TranslationRequest):
    try:
        result = await translate_text(
            text=request.text,
            source_lang=request.source_lang,
            target_lang=request.target_lang,
            model=request.model,
        )
        return result

    except Exception as e:
        logger.error("Translation error: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/summarize")
async def summarize_endpoint(request: SummarizationRequest):
    try:
        result = await summarize_text(
            text=request.text,
            style=request.style,
            model=request.model,
            max_tokens=request.max_tokens,
        )
        return result

    except Exception as e:
        logger.error("Summarization error: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e
