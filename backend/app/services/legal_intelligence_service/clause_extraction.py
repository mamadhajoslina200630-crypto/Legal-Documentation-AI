"""Legal Intelligence Service - Clause extraction and classification."""

from typing import Any, Dict, List
from sqlalchemy.orm import Session
from app.ai_layer.provider_router import provider_router
from app.ai_layer.prompts.analysis_prompts import CLAUSE_EXTRACTION_PROMPT


def extract_clauses(db: Session, document_id: str, document_text: str = "") -> Dict[str, Any]:
    """Extract individual clauses, tag types, and save to DB (Mocked)."""
    from app.services.demo_response_service import process_demo_request
    return process_demo_request(db, document_id, "clauses")
