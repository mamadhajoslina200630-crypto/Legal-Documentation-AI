"""Language Service package."""

from app.services.language_service.translation import translate_legal_text
from app.services.language_service.simple_explanation import simplify_legal_text
from app.services.language_service.regional_explanation import explain_in_regional_language

__all__ = [
    "translate_legal_text",
    "simplify_legal_text",
    "explain_in_regional_language",
]
