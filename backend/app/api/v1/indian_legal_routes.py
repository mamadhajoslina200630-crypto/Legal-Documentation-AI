"""Indian Legal routes: judgment summarization, court order processing, Indian law Q&A."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.services.indian_legal_service.judgment_processing import process_court_judgment
from app.services.indian_legal_service.court_order_processing import process_court_order
from app.services.indian_legal_service.indian_context_qa import answer_indian_legal_query

router = APIRouter(prefix="/indian-legal", tags=["Indian Legal Services"])


class JudgmentRequest(BaseModel):
    judgment_text: str


class CourtOrderRequest(BaseModel):
    order_text: str


class IndianLegalQueryRequest(BaseModel):
    question: str


@router.get("/{document_id}/judgment-summary")
def summarize_judgment(document_id: str, db: Session = Depends(get_db)):
    """Summarize Indian court judgments into structured facts (Mocked Demo)."""
    from app.services.demo_response_service import process_demo_request
    return process_demo_request(db, document_id, "judgment-summary")


@router.get("/{document_id}/court-order")
def parse_court_order(document_id: str, db: Session = Depends(get_db)):
    """Extract directions, injunctions, and next dates from court orders (Mocked Demo)."""
    from app.services.demo_response_service import process_demo_request
    return process_demo_request(db, document_id, "court-order")


@router.post("/context-qa")
def indian_qa(payload: IndianLegalQueryRequest):
    """Answer legal queries with specific Indian statutory context."""
    return answer_indian_legal_query(payload.question)
