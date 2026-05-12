import base64
import logging
from pathlib import Path

from openai import AsyncOpenAI

from app.config import settings

logger = logging.getLogger(__name__)


def get_client() -> AsyncOpenAI:
    return AsyncOpenAI(
        api_key=settings.mimo_api_key,
        base_url=settings.mimo_base_url,
    )


async def chat_completion(
    messages: list[dict],
    model: str = "MiMo-V2.5-Pro",
    temperature: float = 0.7,
    max_tokens: int = 4096,
    stream: bool = False,
):
    client = get_client()
    response = await client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
        stream=stream,
    )

    if stream:
        return response

    choice = response.choices[0]
    return {
        "content": choice.message.content or "",
        "model": response.model,
        "usage": {
            "prompt_tokens": response.usage.prompt_tokens if response.usage else 0,
            "completion_tokens": response.usage.completion_tokens if response.usage else 0,
            "total_tokens": response.usage.total_tokens if response.usage else 0,
        },
    }


async def analyze_image(
    image_data: bytes,
    prompt: str = "Describe this image in detail.",
    model: str = "MiMo-V2.5",
    max_tokens: int = 2048,
) -> dict:
    client = get_client()
    b64_image = base64.b64encode(image_data).decode("utf-8")

    response = await client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{b64_image}"},
                    },
                ],
            }
        ],
        max_tokens=max_tokens,
    )

    choice = response.choices[0]
    return {
        "content": choice.message.content or "",
        "model": response.model,
        "usage": {
            "prompt_tokens": response.usage.prompt_tokens if response.usage else 0,
            "completion_tokens": response.usage.completion_tokens if response.usage else 0,
            "total_tokens": response.usage.total_tokens if response.usage else 0,
        },
    }


async def analyze_audio(
    audio_data: bytes,
    prompt: str = "Describe the contents of this audio.",
    model: str = "MiMo-V2.5",
    max_tokens: int = 2048,
) -> dict:
    client = get_client()
    b64_audio = base64.b64encode(audio_data).decode("utf-8")

    response = await client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "input_audio",
                        "input_audio": {"data": b64_audio, "format": "wav"},
                    },
                ],
            }
        ],
        max_tokens=max_tokens,
    )

    choice = response.choices[0]
    return {
        "content": choice.message.content or "",
        "model": response.model,
        "usage": {
            "prompt_tokens": response.usage.prompt_tokens if response.usage else 0,
            "completion_tokens": response.usage.completion_tokens if response.usage else 0,
            "total_tokens": response.usage.total_tokens if response.usage else 0,
        },
    }


async def generate_code(
    prompt: str,
    language: str = "python",
    model: str = "MiMo-V2.5-Pro",
    max_tokens: int = 8192,
) -> dict:
    system_prompt = (
        f"You are an expert {language} programmer. Write clean, well-documented, "
        f"production-ready {language} code. Include type hints, error handling, "
        "and follow best practices. Only output code with brief inline comments."
    )

    return await chat_completion(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ],
        model=model,
        temperature=0.3,
        max_tokens=max_tokens,
    )


async def text_to_speech(
    text: str,
    voice: str = "alloy",
    model: str = "MiMo-V2.5-TTS",
    speed: float = 1.0,
) -> bytes:
    client = get_client()
    response = await client.audio.speech.create(
        model=model,
        voice=voice,
        input=text,
        speed=speed,
    )
    return response.content


async def voice_clone_tts(
    text: str,
    reference_audio: bytes,
    model: str = "MiMo-V2.5-TTS-VoiceClone",
) -> bytes:
    client = get_client()
    b64_audio = base64.b64encode(reference_audio).decode("utf-8")

    response = await client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_audio",
                        "input_audio": {"data": b64_audio, "format": "wav"},
                    },
                    {"type": "text", "text": text},
                ],
            }
        ],
        modalities=["text", "audio"],
        audio={"voice": "alloy", "format": "wav"},
    )

    if response.choices[0].message.audio:
        audio_b64 = response.choices[0].message.audio.data
        return base64.b64decode(audio_b64)
    return b""


async def translate_text(
    text: str,
    source_lang: str = "auto",
    target_lang: str = "en",
    model: str = "MiMo-V2.5-Pro",
) -> dict:
    lang_instruction = (
        f"from {source_lang} " if source_lang != "auto" else ""
    )
    system_prompt = (
        f"You are a professional translator. Translate the following text "
        f"{lang_instruction}to {target_lang}. "
        "Only output the translation, nothing else."
    )

    return await chat_completion(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text},
        ],
        model=model,
        temperature=0.3,
        max_tokens=4096,
    )


async def summarize_text(
    text: str,
    style: str = "concise",
    model: str = "MiMo-V2.5-Pro",
    max_tokens: int = 2048,
) -> dict:
    style_instructions = {
        "concise": "Provide a concise summary in 2-3 sentences.",
        "detailed": "Provide a detailed summary covering all key points.",
        "bullet_points": "Summarize the text as bullet points, highlighting the main ideas.",
    }

    system_prompt = (
        f"You are a professional content summarizer. "
        f"{style_instructions.get(style, style_instructions['concise'])}"
    )

    return await chat_completion(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Summarize this:\n\n{text}"},
        ],
        model=model,
        temperature=0.3,
        max_tokens=max_tokens,
    )


async def save_upload_file(upload_file, upload_dir: str = "/tmp/mimo-uploads") -> Path:
    Path(upload_dir).mkdir(parents=True, exist_ok=True)
    file_path = Path(upload_dir) / upload_file.filename
    content = await upload_file.read()
    file_path.write_bytes(content)
    return file_path
