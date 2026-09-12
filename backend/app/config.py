"""Application Configuration Module.

All environment variables, secrets, and feature flags live here and are
loaded from .env. Never hardcode secrets in code.
"""

from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Global application settings and environment variables."""

    # Project metadata
    PROJECT_NAME: str = "Legal AI Simplifier"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database (defaults to local SQLite)
    DATABASE_URL: str = "sqlite:///./legal_ai.db"

    # Cache & Queue (optional for local run)
    REDIS_URL: Optional[str] = None
    CELERY_BROKER_URL: Optional[str] = None
    CELERY_RESULT_BACKEND: Optional[str] = None

    # Vector Database (optional for local run)
    QDRANT_HOST: Optional[str] = "localhost"
    QDRANT_PORT: Optional[int] = 6333
    QDRANT_API_KEY: Optional[str] = None

    # Object Storage
    STORAGE_DIR: str = "./storage_data"

    # AI Provider routing
    ACTIVE_AI_PROVIDER: str = "gemini"  # "gemini" | "openai" | "claude"
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    CLAUDE_API_KEY: Optional[str] = None

    # JWT Authentication
    SECRET_KEY: str = "insecure_dev_secret_key_please_change"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
