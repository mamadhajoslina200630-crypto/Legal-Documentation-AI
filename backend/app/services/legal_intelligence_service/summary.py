"""Legal Intelligence Service - Document summarization with demo matching priority."""

from typing import Any, Dict
from sqlalchemy.orm import Session
from app.ai_layer.provider_router import provider_router
from app.ai_layer.prompts.analysis_prompts import SUMMARY_PROMPT_TEMPLATE
from app.services.demo_response_service import get_predefined_answer
from app.data.postgres.models.document import Document


def generate_document_summary(db: Session, document_id: str, document_text: str) -> Dict[str, Any]:
    """Generate structured summary of legal document with predefined demo matching."""
    doc_filename = ""
    if db and document_id:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if doc:
            doc_filename = doc.filename

    predefined = get_predefined_answer(doc_filename, "summary") if doc_filename else None
    if predefined:
        return {
            "document_id": document_id,
            "summary": predefined,
        }

    prompt = SUMMARY_PROMPT_TEMPLATE.format(document_text=document_text[:4000])
    res = provider_router.generate_completion(prompt)
    return {
        "document_id": document_id,
        "summary": res.get("text", "Executive summary of contract obligations."),
    }
