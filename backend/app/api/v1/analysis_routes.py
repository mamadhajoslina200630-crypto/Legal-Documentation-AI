"""Legal analysis routes: summary, clauses, key info, risks, compliance, obligations."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.services.legal_intelligence_service.analysis import run_full_analysis
from app.services.legal_intelligence_service.summary import generate_document_summary
from app.services.legal_intelligence_service.clause_extraction import extract_clauses
from app.services.legal_intelligence_service.info_extraction import extract_key_information
from app.services.legal_intelligence_service.risk_detection import detect_legal_risks
from app.services.legal_intelligence_service.compliance import check_compliance
from app.services.legal_intelligence_service.obligations import extract_obligations

router = APIRouter(prefix="/analysis", tags=["Legal Intelligence"])


@router.get("/{document_id}/summary")
def get_summary(document_id: str, db: Session = Depends(get_db)):
    """Retrieve document summary."""
    return generate_document_summary(db, document_id, document_text="")


@router.get("/{document_id}/key-info")
def get_key_info(document_id: str, db: Session = Depends(get_db)):
    """Retrieve extracted parties, dates, financials, and governing law."""
    return extract_key_information(db, document_id, document_text="")


@router.get("/{document_id}/clauses")
def get_clauses(document_id: str, db: Session = Depends(get_db)):
    """Retrieve structured legal clauses."""
    return extract_clauses(db, document_id, document_text="")


@router.get("/{document_id}/risks")
def get_risks(document_id: str, db: Session = Depends(get_db)):
    """Retrieve detected legal risks and unfavorable terms."""
    return detect_legal_risks(db, document_id, document_text="")


@router.get("/{document_id}/compliance")
def get_compliance(document_id: str, db: Session = Depends(get_db)):
    """Retrieve Indian regulatory and statutory compliance report."""
    return check_compliance(db, document_id, document_text="")


@router.get("/{document_id}/obligations")
def get_obligations(document_id: str, db: Session = Depends(get_db)):
    """Retrieve contractual responsibilities, notice deadlines, and payment schedules."""
    return extract_obligations(db, document_id, document_text="")
