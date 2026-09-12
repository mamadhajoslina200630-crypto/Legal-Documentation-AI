"""Legal Intelligence Service - Comprehensive legal document analysis."""

from typing import Any, Dict
from sqlalchemy.orm import Session
from app.ai_layer.provider_router import provider_router


def run_full_analysis(db: Session, document_id: str, document_text: str) -> Dict[str, Any]:
    """Perform holistic legal document assessment through provider router.

    TODO (Task 4): Route prompt through provider_router and persist to AnalysisResult table.
    """
    prompt = f"Analyze this legal document:\n{document_text[:1000]}"
    ai_result = provider_router.generate_completion(prompt)
    return {
        "document_id": document_id,
        "assessment": ai_result.get("text", "Standard legal assessment."),
        "status": "completed",
    }
