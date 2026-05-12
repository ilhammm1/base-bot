import json
import logging

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.mimo_client import chat_completion
from app.models import ChatRequest, ChatResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        messages = [{"role": m.role, "content": m.content} for m in request.messages]

        if request.stream:
            return StreamingResponse(
                stream_chat(messages, request),
                media_type="text/event-stream",
            )

        result = await chat_completion(
            messages=messages,
            model=request.model,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )
        return ChatResponse(**result)

    except Exception as e:
        logger.error("Chat error: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e


async def stream_chat(messages: list[dict], request: ChatRequest):
    stream = await chat_completion(
        messages=messages,
        model=request.model,
        temperature=request.temperature,
        max_tokens=request.max_tokens,
        stream=True,
    )

    async for chunk in stream:
        if chunk.choices[0].delta.content:
            data = json.dumps({"content": chunk.choices[0].delta.content})
            yield f"data: {data}\n\n"

    yield "data: [DONE]\n\n"
