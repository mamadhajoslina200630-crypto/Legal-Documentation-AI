"""Drafting routes: document generation, clause creation, and clause rewrites."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_workspace
from app.services.drafting_service.document_generation import generate_document_draft
from app.services.drafting_service.clause_generation import generate_clause
from app.services.drafting_service.clause_rewrite import rewrite_clause

router = APIRouter(prefix="/drafting", tags=["Drafting & Rewriting"])


class GenerateDraftRequest(BaseModel):
    agreement_type: str
    parties: str
    key_terms: str
    jurisdiction: str = "India"


class GenerateClauseRequest(BaseModel):
    clause_type: str
    requirements: str
    governing_law: str = "Indian Law"


class RewriteClauseRequest(BaseModel):
    clause_text: str
    target_party: str
    objective: str = "make more balanced"


@router.post("/document")
@router.post("/generate")
def draft_doc(
    payload: GenerateDraftRequest,
    db: Session = Depends(get_db),
    workspace: dict = Depends(get_current_workspace),
):
    """Generate a first draft of a legal agreement."""
    return generate_document_draft(
        db=db,
        workspace_id=workspace["id"],
        agreement_type=payload.agreement_type,
        parties=payload.parties,
        key_terms=payload.key_terms,
        jurisdiction=payload.jurisdiction,
    )


@router.post("/clause")
def draft_clause(payload: GenerateClauseRequest):
    """Generate a single legal clause from specifications."""
    return generate_clause(
        clause_type=payload.clause_type,
        requirements=payload.requirements,
        governing_law=payload.governing_law,
    )


@router.post("/rewrite")
@router.post("/rewrite-clause")
def rewrite(payload: RewriteClauseRequest):
    """Rewrite a clause to optimize protection or clarity."""
    return rewrite_clause(
        clause_text=payload.clause_text,
        target_party=payload.target_party,
        objective=payload.objective,
    )
