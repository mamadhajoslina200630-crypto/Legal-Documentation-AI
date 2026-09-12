"""Indian Legal Service package."""

from app.services.indian_legal_service.judgment_processing import process_court_judgment
from app.services.indian_legal_service.court_order_processing import process_court_order
from app.services.indian_legal_service.indian_context_qa import answer_indian_legal_query

__all__ = [
    "process_court_judgment",
    "process_court_order",
    "answer_indian_legal_query",
]
