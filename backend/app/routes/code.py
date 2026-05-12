import logging

from fastapi import APIRouter, HTTPException

from app.mimo_client import generate_code
from app.models import CodeRequest

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/code", tags=["Code Assistant"])


@router.post("/generate")
async def generate_code_endpoint(request: CodeRequest):
    try:
        result = await generate_code(
            prompt=request.prompt,
            language=request.language,
            model=request.model,
            max_tokens=request.max_tokens,
        )
        return result

    except Exception as e:
        logger.error("Code generation error: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/review")
async def review_code_endpoint(request: CodeRequest):
    try:
        review_prompt = (
            f"Review the following {request.language} code. "
            "Identify bugs, security issues, performance problems, and suggest improvements. "
            "Be specific and provide corrected code snippets.\n\n"
            f"```{request.language}\n{request.prompt}\n```"
        )
        result = await generate_code(
            prompt=review_prompt,
            language=request.language,
            model=request.model,
            max_tokens=request.max_tokens,
        )
        return result

    except Exception as e:
        logger.error("Code review error: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/explain")
async def explain_code_endpoint(request: CodeRequest):
    try:
        explain_prompt = (
            f"Explain the following {request.language} code in detail. "
            "Cover what it does, how it works, and any notable patterns used.\n\n"
            f"```{request.language}\n{request.prompt}\n```"
        )
        result = await generate_code(
            prompt=explain_prompt,
            language=request.language,
            model=request.model,
            max_tokens=request.max_tokens,
        )
        return result

    except Exception as e:
        logger.error("Code explanation error: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e
