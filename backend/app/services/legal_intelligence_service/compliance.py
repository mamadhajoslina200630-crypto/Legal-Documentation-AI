"""Legal Intelligence Service - Statutory and regulatory compliance checks."""

from typing import Any, Dict
from sqlalchemy.orm import Session
from app.services.demo_response_service import process_demo_request

def check_compliance(db: Session, document_id: str, document_text: str = "") -> Dict[str, Any]:
    """Retrieve Indian regulatory and statutory compliance report (Mocked)."""
    return process_demo_request(db, document_id, "compliance")
