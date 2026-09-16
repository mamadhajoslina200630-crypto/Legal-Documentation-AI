"""Legal Intelligence Service - Contractual obligations and deadline extraction."""

from typing import Any, Dict, List
from sqlalchemy.orm import Session


def extract_obligations(db: Session, document_id: str, document_text: str = "") -> Dict[str, Any]:
    """Extract obligations (Mocked)."""
    from app.services.demo_response_service import process_demo_request
    return process_demo_request(db, document_id, "obligations")
