from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mimo_api_key: str = ""
    mimo_base_url: str = "https://api.xiaomimimo.com/v1"

    app_host: str = "0.0.0.0"
    app_port: int = 8000
    app_env: str = "development"
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    default_chat_model: str = "MiMo-V2.5-Pro"
    default_multimodal_model: str = "MiMo-V2.5"
    default_tts_model: str = "MiMo-V2.5-TTS"
    default_voice_clone_model: str = "MiMo-V2.5-TTS-VoiceClone"

    max_requests_per_minute: int = 60
    max_tokens_per_request: int = 4096

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
