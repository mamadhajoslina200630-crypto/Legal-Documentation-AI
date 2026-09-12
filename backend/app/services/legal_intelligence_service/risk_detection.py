"""Legal Intelligence Service - Risk detection and unfavorable clause flagging."""

from typing import Any, Dict, List
from sqlalchemy.orm import Session
from app.ai_layer.provider_router import provider_router
from app.ai_layer.prompts.risk_prompts import RISK_DETECTION_PROMPT


def detect_legal_risks(db: Session, document_id: str, document_text: str) -> List[Dict[str, Any]]:
    """Scan document text for unfavorable terms, missing caps on liability, and legal exposures."""
    # TODO (Task 4): Route through provider_router and persist to Risk table
    return [
        {
            "severity": "high",
            "category": "liability",
            "title": "Uncapped Indemnity Obligation",
            "description": "Clause 14 imposes uncapped indemnity without limitation of liability carve-outs.",
            "clause_reference": "Clause 14.1",
            "mitigation_suggestion": "Insert standard aggregate liability cap equal to 12 months fees paid.",
        },
        {
            "severity": "medium",
            "category": "termination",
            "title": "Unilateral Termination without Cause",
            "description": "Counterparty retains unilateral termination rights with only 7 days notice.",
            "clause_reference": "Clause 8.3",
            "mitigation_suggestion": "Request bilateral 30-day notice period.",
        },
    ]
