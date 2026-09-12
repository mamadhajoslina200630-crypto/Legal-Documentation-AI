"""Legal Intelligence Service package."""

from app.services.legal_intelligence_service.analysis import run_full_analysis
from app.services.legal_intelligence_service.summary import generate_document_summary
from app.services.legal_intelligence_service.clause_extraction import extract_clauses
from app.services.legal_intelligence_service.info_extraction import extract_key_information
from app.services.legal_intelligence_service.risk_detection import detect_legal_risks
from app.services.legal_intelligence_service.compliance import check_compliance
from app.services.legal_intelligence_service.obligations import extract_obligations

__all__ = [
    "run_full_analysis",
    "generate_document_summary",
    "extract_clauses",
    "extract_key_information",
    "detect_legal_risks",
    "check_compliance",
    "extract_obligations",
]
