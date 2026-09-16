"""Legal Intelligence Service - Risk detection and analysis."""

from typing import Any, Dict
from sqlalchemy.orm import Session
from app.services.demo_response_service import process_demo_request

def detect_legal_risks(db: Session, document_id: str, document_text: str = "") -> Dict[str, Any]:
    """Detect legal risks and unfavorable terms (Mocked)."""
    return process_demo_request(db, document_id, "risks")
