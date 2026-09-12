"""Drafting Service - Clause rewriting and improvement."""

from typing import Any, Dict
from app.ai_layer.provider_router import provider_router
from app.ai_layer.prompts.drafting_prompts import CLAUSE_REWRITE_PROMPT


def rewrite_clause(clause_text: str, target_party: str, objective: str = "make more balanced") -> Dict[str, Any]:
    """Rewrite an existing clause to optimize legal protection or clarity."""
    prompt = CLAUSE_REWRITE_PROMPT.format(party=target_party, clause_text=clause_text)
    ai_res = provider_router.generate_completion(prompt)
    return {
        "original_clause": clause_text,
        "rewritten_clause": ai_res.get("text", "Rewritten balanced clause text."),
        "objective": objective,
    }
