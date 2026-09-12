"""AI Provider Router.

Single shared abstraction that routes any service's AI request to the active model provider
(Gemini, OpenAI, or Claude) configured in config.py. Services never call model clients directly.
"""

from typing import Any, Dict, Optional
from app.config import settings
from app.ai_layer.gemini_client import GeminiClient
from app.ai_layer.openai_client import OpenAIClient
from app.ai_layer.claude_client import ClaudeClient


class ProviderRouter:
    """Routes completion and chat requests to configured LLM provider."""

    def __init__(self):
        self.gemini = GeminiClient()
        self.openai = OpenAIClient()
        self.claude = ClaudeClient()

    def generate_completion(
        self, prompt: str, system_prompt: Optional[str] = None, **kwargs
    ) -> Dict[str, Any]:
        """Route generation request to active provider.

        Args:
            prompt: User or task prompt string.
            system_prompt: Optional system instruction.
            **kwargs: Generation parameters (temperature, max_tokens, etc.)
        """
        provider = settings.ACTIVE_AI_PROVIDER.lower()
        if provider == "openai":
            return self.openai.complete(prompt, system_prompt=system_prompt, **kwargs)
        elif provider == "claude":
            return self.claude.complete(prompt, system_prompt=system_prompt, **kwargs)
        else:
            return self.gemini.complete(prompt, system_prompt=system_prompt, **kwargs)


provider_router = ProviderRouter()
