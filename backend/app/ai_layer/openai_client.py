"""OpenAI Client wrapper stub."""

from typing import Any, Dict, Optional
from app.config import settings


class OpenAIClient:
    """Client for OpenAI GPT models."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.OPENAI_API_KEY

    def complete(
        self, prompt: str, system_prompt: Optional[str] = None, **kwargs
    ) -> Dict[str, Any]:
        """Generate completion using OpenAI."""
        return {
            "provider": "openai",
            "text": f"Stub OpenAI response for prompt: {prompt[:40]}...",
            "usage": {"prompt_tokens": 10, "completion_tokens": 10},
        }
