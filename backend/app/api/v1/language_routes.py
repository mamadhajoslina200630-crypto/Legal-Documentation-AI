"""Language routes: Bhashini translation, plain-language simplification, regional explanation."""

from enum import Enum
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.language_service.translation import (
    translate_legal_text,
    SUPPORTED_LANGUAGES,
    ISO_TO_INDICTRANS2,
)
from app.services.language_service.simple_explanation import simplify_legal_text
from app.services.language_service.regional_explanation import explain_in_regional_language

router = APIRouter(prefix="/language", tags=["Language & Accessibility"])


class SupportedLanguage(str, Enum):
    EN = "en"
    TA = "ta"
    ML = "ml"
    HI = "hi"
    TE = "te"


class TranslateRequest(BaseModel):
    text: str = Field(..., description="Legal clause or document text to translate")
    source_lang: str = Field(default="en", description="Source ISO-639-1 language code (e.g. en)")
    target_lang: str = Field(default="ml", description="Target ISO-639-1 language code (e.g. ml, ta, hi)")


class SimplifyRequest(BaseModel):
    clause_text: str = Field(..., description="Complex legal text to simplify into layperson terms")
    target_lang: Optional[str] = Field(default="en", description="Language of simplified output")


class RegionalExplainRequest(BaseModel):
    text: str = Field(..., description="Legal concept or clause to explain")
    target_language: str = Field(default="Malayalam", description="Name of regional Indian language")


# --- Direct Text-Based Endpoints ---

@router.post("/translate")
def translate_direct(req: TranslateRequest):
    """Translate legal text directly via Bhashini / IndicTrans2 pipeline."""
    return translate_legal_text(req.text, source_lang=req.source_lang, target_lang=req.target_lang)


@router.post("/simplify")
def simplify_direct(req: SimplifyRequest):
    """Rewrite complex legal provisions in plain language."""
    return simplify_legal_text(req.clause_text)


@router.post("/regional-explain")
def regional_explain_direct(req: RegionalExplainRequest):
    """Explain legal implications in a selected Indian regional language."""
    return explain_in_regional_language(req.text, target_language=req.target_language)


@router.get("/supported-languages")
def get_supported_languages():
    """Get list of supported Indian and international languages with IndicTrans2 mappings."""
    return {
        "languages": [
            {"code": code, "name": name, "flores_code": ISO_TO_INDICTRANS2.get(code)}
            for code, name in SUPPORTED_LANGUAGES.items()
        ]
    }


# --- Document-Linked Endpoints (Demo / Workspace) ---

@router.get("/{document_id}/translate")
def translate(
    document_id: str,
    target_lang: str = Query(default="ml", description="Target language code: ml, ta, hi"),
    db: Session = Depends(get_db),
):
    """Translate legal text into an Indian regional language (Mocked / Demo / Document)."""
    from app.services.demo_response_service import process_demo_request
    action = f"translation_{target_lang}" if target_lang else "translation"
    return process_demo_request(db, document_id, action)


@router.get("/{document_id}/simplify")
def simplify(document_id: str, db: Session = Depends(get_db)):
    """Rewrite complex legal provisions in plain language (Mocked / Document)."""
    from app.services.demo_response_service import process_demo_request
    return process_demo_request(db, document_id, "simplify")


@router.get("/{document_id}/voice")
def regional_explain(
    document_id: str,
    lang: str = Query(default="ml", description="Voice language code (ml, ta, hi)"),
    db: Session = Depends(get_db),
):
    """Explain legal implications via Voice Assistant mapping (Mocked / Document)."""
    from app.services.demo_response_service import process_demo_request
    return process_demo_request(db, document_id, f"voice_{lang}" if lang else "voice")
