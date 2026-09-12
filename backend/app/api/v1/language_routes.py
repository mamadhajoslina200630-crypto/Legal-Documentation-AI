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


@router.get("/{document_id}/translate")
def translate(document_id: str, db: Session = Depends(get_db)):
    """Translate legal text into an Indian regional language (Mocked)."""
    from app.services.demo_response_service import process_demo_request
    return process_demo_request(db, document_id, "translate")


@router.get("/{document_id}/simplify")
def simplify(document_id: str, db: Session = Depends(get_db)):
    """Rewrite complex legal provisions in plain language (Mocked)."""
    from app.services.demo_response_service import process_demo_request
    return process_demo_request(db, document_id, "simplify")


@router.get("/{document_id}/voice")
def regional_explain(document_id: str, db: Session = Depends(get_db)):
    """Explain legal implications via Voice Assistant mapping (Mocked)."""
    from app.services.demo_response_service import process_demo_request
    return process_demo_request(db, document_id, "voice")
