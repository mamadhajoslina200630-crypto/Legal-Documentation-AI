"""Application Configuration Module.

Configurations are structured using OOP patterns (Composition) to ensure modularity.
All environment variables, secrets, and feature flags are loaded from .env.
"""

import secrets
from typing import Optional, List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import BaseModel


class DatabaseSettings(BaseModel):
    """Database configurations."""
    url: str = "sqlite:///./legal_ai.db"
    redis_url: Optional[str] = None
    celery_broker_url: Optional[str] = None
    celery_result_backend: Optional[str] = None


class VectorDBSettings(BaseModel):
    """Vector Database (Qdrant) configurations."""
    host: str = "localhost"
    port: int = 6333
    api_key: Optional[str] = None


class AISettings(BaseModel):
    """AI Provider configurations."""
    active_provider: str = "gemini"  # "gemini" | "openai" | "claude"
    gemini_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
    claude_api_key: Optional[str] = None


class SecuritySettings(BaseModel):
    """Security, Auth, and CORS configurations."""
    secret_key: str = "insecure_dev_secret_key_please_change"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    cors_origins: List[str] = ["*"]

    def get_secure_secret_key(self) -> str:
        """Fallback to a robust random key if the default insecure key is still used."""
        if self.secret_key == "insecure_dev_secret_key_please_change":
            return secrets.token_urlsafe(32)
        return self.secret_key


class Settings(BaseSettings):
    """Master application settings composed of modular config blocks."""

    # Project metadata
    PROJECT_NAME: str = "Legal AI Simplifier"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    STORAGE_DIR: str = "./storage_data"

    # We map flat env variables to these nested models during instantiation in `get_settings`
    # However, to keep it simple and strictly compatible with flat .env files,
    # we can define flat variables here and compose them dynamically via properties.

    # Flat environment variables for pydantic_settings injection
    DATABASE_URL: str = "sqlite:///./legal_ai.db"
    REDIS_URL: Optional[str] = None
    CELERY_BROKER_URL: Optional[str] = None
    CELERY_RESULT_BACKEND: Optional[str] = None
    
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333
    QDRANT_API_KEY: Optional[str] = None

    ACTIVE_AI_PROVIDER: str = "gemini"
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    CLAUDE_API_KEY: Optional[str] = None

    SECRET_KEY: str = "insecure_dev_secret_key_please_change"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    CORS_ORIGINS: str = "*"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def db(self) -> DatabaseSettings:
        return DatabaseSettings(
            url=self.DATABASE_URL,
            redis_url=self.REDIS_URL,
            celery_broker_url=self.CELERY_BROKER_URL,
            celery_result_backend=self.CELERY_RESULT_BACKEND
        )

    @property
    def vector_db(self) -> VectorDBSettings:
        return VectorDBSettings(
            host=self.QDRANT_HOST,
            port=self.QDRANT_PORT,
            api_key=self.QDRANT_API_KEY
        )

    @property
    def ai(self) -> AISettings:
        return AISettings(
            active_provider=self.ACTIVE_AI_PROVIDER,
            gemini_api_key=self.GEMINI_API_KEY,
            openai_api_key=self.OPENAI_API_KEY,
            claude_api_key=self.CLAUDE_API_KEY
        )

    @property
    def security(self) -> SecuritySettings:
        origins = [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
        return SecuritySettings(
            secret_key=self.SECRET_KEY,
            algorithm=self.ALGORITHM,
            access_token_expire_minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES,
            cors_origins=origins
        )


def get_settings() -> Settings:
    """Factory method for injecting settings."""
    return Settings()

settings = get_settings()
