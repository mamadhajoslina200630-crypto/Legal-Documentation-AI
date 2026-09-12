"""Language routes: Bhashini translation, plain-language simplification, regional explanation."""

from fastapi import APIRouter
from pydantic import BaseModel
from app.services.language_service.translation import translate_legal_text
from app.services.language_service.simple_explanation import simplify_legal_text
from app.services.language_service.regional_explanation import explain_in_regional_language

router = APIRouter(prefix="/language", tags=["Language & Accessibility"])


class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "en"
    target_lang: str = "hi"


class SimplifyRequest(BaseModel):
    clause_text: str


class RegionalExplainRequest(BaseModel):
    text: str
    target_language: str = "Hindi"


@router.post("/translate")
def translate(payload: TranslateRequest):
    """Translate legal text into an Indian regional language."""
    return translate_legal_text(
        text=payload.text, source_lang=payload.source_lang, target_lang=payload.target_lang
    )


@router.post("/simplify")
def simplify(payload: SimplifyRequest):
    """Rewrite complex legal provisions in plain language."""
    return simplify_legal_text(clause_text=payload.clause_text)


@router.post("/regional-explain")
def regional_explain(payload: RegionalExplainRequest):
    """Explain legal implications in selected Indian language."""
    return explain_in_regional_language(text=payload.text, target_language=payload.target_language)
