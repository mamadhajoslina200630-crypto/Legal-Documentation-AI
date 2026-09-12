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


@router.post("/judgment-summary")
def summarize_judgment(payload: JudgmentRequest, db: Session = Depends(get_db)):
    """Summarize Indian court judgments into structured facts, issues, and rulings."""
    return process_court_judgment(db, payload.judgment_text)


@router.post("/court-order")
def parse_court_order(payload: CourtOrderRequest, db: Session = Depends(get_db)):
    """Extract directions, injunctions, and next dates from court orders."""
    return process_court_order(db, payload.order_text)


@router.post("/context-qa")
def indian_qa(payload: IndianLegalQueryRequest):
    """Answer legal queries with specific Indian statutory context."""
    return answer_indian_legal_query(payload.question)
