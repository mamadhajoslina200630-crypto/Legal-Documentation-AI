"""Legal Intelligence Service - Document summarization with demo matching priority."""

from typing import Any, Dict
from sqlalchemy.orm import Session
from app.ai_layer.provider_router import provider_router
from app.ai_layer.prompts.analysis_prompts import SUMMARY_PROMPT_TEMPLATE
from app.services.demo_response_service import get_predefined_answer
from app.data.postgres.models.document import Document


def generate_document_summary(db: Session, document_id: str, document_text: str = "") -> Dict[str, Any]:
    """Generate structured summary of legal document with strict demo matching."""
    from app.services.demo_response_service import process_demo_request
    return process_demo_request(db, document_id, "summary")
