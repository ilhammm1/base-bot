import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routes import chat, code, multimodal, speech, tools

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="MiMo Multi-Modal AI Platform",
    description=(
        "A comprehensive AI platform powered by Xiaomi MiMo V2.5 models. "
        "Features include intelligent chat, multi-modal analysis (image & audio), "
        "code generation & review, text-to-speech, voice cloning, translation, "
        "and text summarization."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

origins = [o.strip() for o in settings.cors_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(multimodal.router)
app.include_router(code.router)
app.include_router(speech.router)
app.include_router(tools.router)


@app.get("/")
async def root():
    return {
        "name": "MiMo Multi-Modal AI Platform",
        "version": "1.0.0",
        "status": "running",
        "models": {
            "chat": settings.default_chat_model,
            "multimodal": settings.default_multimodal_model,
            "tts": settings.default_tts_model,
            "voice_clone": settings.default_voice_clone_model,
        },
        "endpoints": {
            "chat": "/api/chat/",
            "image_analysis": "/api/multimodal/analyze-image",
            "audio_analysis": "/api/multimodal/analyze-audio",
            "code_generate": "/api/code/generate",
            "code_review": "/api/code/review",
            "code_explain": "/api/code/explain",
            "tts": "/api/speech/tts",
            "voice_clone": "/api/speech/voice-clone",
            "translate": "/api/tools/translate",
            "summarize": "/api/tools/summarize",
            "docs": "/docs",
        },
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "api_configured": bool(settings.mimo_api_key)}
