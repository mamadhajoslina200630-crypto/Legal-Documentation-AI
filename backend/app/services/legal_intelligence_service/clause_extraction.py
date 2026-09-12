"""Legal Intelligence Service - Clause extraction and classification."""

from typing import Any, Dict, List
from sqlalchemy.orm import Session
from app.ai_layer.provider_router import provider_router
from app.ai_layer.prompts.analysis_prompts import CLAUSE_EXTRACTION_PROMPT


def extract_clauses(db: Session, document_id: str, document_text: str) -> List[Dict[str, Any]]:
    """Extract individual clauses, tag types (e.g. indemnity, confidentiality), and save to DB."""
    # TODO (Task 4): Call provider_router and populate Clause model instances
    return [
        {
            "clause_type": "Indemnity",
            "title": "Indemnification Clause",
            "text": "Party A shall indemnify and hold harmless Party B...",
            "page_number": 3,
        },
        {
            "clause_type": "Termination",
            "title": "Termination for Convenience",
            "text": "Either party may terminate upon 30 days notice...",
            "page_number": 5,
        },
    ]
