"""Drafting Service - Individual clause generation."""

from typing import Any, Dict
from app.ai_layer.provider_router import provider_router


def generate_clause(clause_type: str, requirements: str, governing_law: str = "Indian Law") -> Dict[str, Any]:
    """Draft a single tailored legal clause."""
    prompt = f"Draft a {clause_type} clause under {governing_law} satisfying: {requirements}"
    ai_res = provider_router.generate_completion(prompt)
    return {
        "clause_type": clause_type,
        "text": ai_res.get("text", "Drafted clause text."),
    }
