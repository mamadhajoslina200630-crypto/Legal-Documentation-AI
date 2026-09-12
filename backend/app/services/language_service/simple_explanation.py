"""Language Service - Plain-language legal simplification."""

from typing import Any, Dict
from app.ai_layer.provider_router import provider_router
from app.ai_layer.prompts.translation_prompts import SIMPLE_EXPLANATION_PROMPT


def simplify_legal_text(clause_text: str) -> Dict[str, Any]:
    """Convert convoluted legal jargon into plain language an ordinary citizen understands."""
    prompt = SIMPLE_EXPLANATION_PROMPT.format(clause_text=clause_text)
    ai_res = provider_router.generate_completion(prompt)
    return {
        "original_text": clause_text,
        "simple_explanation": ai_res.get("text", "Plain English explanation of rights and rules."),
    }
