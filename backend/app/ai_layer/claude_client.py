"""Anthropic Claude Client wrapper stub."""

from typing import Any, Dict, Optional
from app.config import settings


class ClaudeClient:
    """Client for Anthropic Claude models."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.CLAUDE_API_KEY

    def complete(
        self, prompt: str, system_prompt: Optional[str] = None, **kwargs
    ) -> Dict[str, Any]:
        """Generate completion using Claude."""
        return {
            "provider": "claude",
            "text": f"Stub Claude response for prompt: {prompt[:40]}...",
            "usage": {"prompt_tokens": 10, "completion_tokens": 10},
        }
