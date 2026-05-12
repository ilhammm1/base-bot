from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(..., description="Message role: system, user, or assistant")
    content: str = Field(..., description="Message content")


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(..., description="Conversation history")
    model: str = Field(default="MiMo-V2.5-Pro", description="Model to use")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(default=4096, ge=1, le=131072)
    stream: bool = Field(default=False, description="Enable streaming response")


class ChatResponse(BaseModel):
    content: str
    model: str
    usage: dict


class ImageAnalysisRequest(BaseModel):
    prompt: str = Field(
        default="Describe this image in detail.",
        description="Analysis prompt",
    )
    model: str = Field(default="MiMo-V2.5", description="Multimodal model")
    max_tokens: int = Field(default=2048, ge=1, le=131072)


class CodeRequest(BaseModel):
    prompt: str = Field(..., description="Code task description")
    language: str = Field(default="python", description="Programming language")
    model: str = Field(default="MiMo-V2.5-Pro", description="Model to use")
    max_tokens: int = Field(default=8192, ge=1, le=131072)


class TTSRequest(BaseModel):
    text: str = Field(..., description="Text to convert to speech")
    voice: str = Field(default="alloy", description="Voice ID to use")
    model: str = Field(default="MiMo-V2.5-TTS", description="TTS model")
    speed: float = Field(default=1.0, ge=0.25, le=4.0)


class VoiceCloneRequest(BaseModel):
    text: str = Field(..., description="Text to speak in cloned voice")
    model: str = Field(
        default="MiMo-V2.5-TTS-VoiceClone",
        description="Voice clone model",
    )


class TranslationRequest(BaseModel):
    text: str = Field(..., description="Text to translate")
    source_lang: str = Field(default="auto", description="Source language")
    target_lang: str = Field(..., description="Target language")
    model: str = Field(default="MiMo-V2.5-Pro", description="Model to use")


class SummarizationRequest(BaseModel):
    text: str = Field(..., description="Text to summarize")
    style: str = Field(
        default="concise",
        description="Summary style: concise, detailed, bullet_points",
    )
    model: str = Field(default="MiMo-V2.5-Pro", description="Model to use")
    max_tokens: int = Field(default=2048, ge=1, le=131072)
