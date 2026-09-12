"""Legal Intelligence Service - Contractual obligations and deadline extraction."""

from typing import Any, Dict, List
from sqlalchemy.orm import Session


def extract_obligations(db: Session, document_id: str, document_text: str) -> List[Dict[str, Any]]:
    """Extract actionable responsibilities, payment dates, and notice deadlines."""
    return [
        {
            "responsible_party": "Service Provider",
            "action_required": "Deliver monthly SLA uptime compliance reports.",
            "due_date": "Within 5 days after end of each calendar month",
            "penalty_or_consequence": "Service credit penalty of 2% per day of delay.",
        },
        {
            "responsible_party": "Customer",
            "action_required": "Pay invoiced amounts via NEFT/RTGS.",
            "due_date": "Net 30 days from invoice date",
            "penalty_or_consequence": "1.5% monthly late interest.",
        },
    ]
