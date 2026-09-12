"""Language Service - Regional Indian language legal explanations."""

from typing import Any, Dict
from app.ai_layer.provider_router import provider_router
from app.ai_layer.prompts.translation_prompts import REGIONAL_EXPLANATION_PROMPT


def explain_in_regional_language(text: str, target_language: str = "Hindi") -> Dict[str, Any]:
    """Explain legal rights and implications in selected Indian language (Hindi, Tamil, Telugu, etc.)."""
    prompt = REGIONAL_EXPLANATION_PROMPT.format(language=target_language, clause_text=text)
    ai_res = provider_router.generate_completion(prompt)
    return {
        "target_language": target_language,
        "explanation": ai_res.get("text", f"Explanation provided in {target_language}."),
    }
