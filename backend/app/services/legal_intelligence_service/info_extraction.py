"""Legal Intelligence Service - Key information extraction (dates, parties, financials)."""

from typing import Any, Dict
from sqlalchemy.orm import Session
from app.services.demo_response_service import process_demo_request

def extract_key_information(db: Session, document_id: str, document_text: str = "") -> Dict[str, Any]:
    """Retrieve extracted parties, dates, financials, and governing law (Mocked)."""
    return process_demo_request(db, document_id, "key_info")
