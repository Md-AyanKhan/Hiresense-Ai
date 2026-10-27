from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "HireSense AI API"
    environment: str = "development"
    database_url: str = "mysql+pymysql://root:password@localhost:3306/hiresense_ai"
    secret_key: str = Field(default="change-this-to-a-long-random-secret", min_length=16)
    access_token_expire_minutes: int = 60 * 24
    frontend_origin: str = "http://localhost:5173"
    admin_email: str = "param5saxena@gmail.com"
    upload_dir: Path = Path("storage/uploads")
    openai_api_key: str | None = None
    enable_openai: bool = False
    groq_api_key: str | None = None
    groq_model: str = "openai/gpt-oss-20b"
    groq_base_url: str = "https://api.groq.com/openai/v1"
    sentence_transformer_model: str = "all-MiniLM-L6-v2"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
