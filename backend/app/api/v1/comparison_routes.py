"""Document comparison routes."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.services.comparison_service.document_diff import compare_two_documents
from app.services.comparison_service.version_compare import compare_document_versions
from app.services.comparison_service.clause_diff import compare_clauses

router = APIRouter(prefix="/comparison", tags=["Document Comparison"])


class CompareDocsRequest(BaseModel):
    doc_a_id: str
    doc_b_id: str


class CompareClausesRequest(BaseModel):
    clause_a: str
    clause_b: str


@router.post("/documents")
def diff_documents(payload: CompareDocsRequest, db: Session = Depends(get_db)):
    """Compare two documents and highlight additions, deletions, and modifications."""
    return compare_two_documents(db, doc_a_id=payload.doc_a_id, doc_b_id=payload.doc_b_id)


@router.post("/clauses")
def diff_clauses(payload: CompareClausesRequest):
    """Compare two clauses for granular wording and semantic drift."""
    return compare_clauses(payload.clause_a, payload.clause_b)


@router.get("/{document_id}/versions/{v1}/{v2}")
def diff_versions(document_id: str, v1: int, v2: int, db: Session = Depends(get_db)):
    """Compare two versions of a document."""
    return compare_document_versions(db, document_id, version_a=v1, version_b=v2)
