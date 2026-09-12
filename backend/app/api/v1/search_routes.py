"""Search routes: keyword full-text, semantic similarity, and section locator."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_workspace
from app.services.search_service.keyword_search import search_documents_by_keyword
from app.services.search_service.semantic_search import search_semantically
from app.services.search_service.section_locator import locate_section

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("/keyword")
def search_keyword(
    q: str, db: Session = Depends(get_db), workspace: dict = Depends(get_current_workspace)
):
    """Full-text keyword search across workspace documents."""
    return search_documents_by_keyword(db, workspace_id=workspace["id"], query=q)


@router.get("/semantic")
def search_vector(q: str, workspace: dict = Depends(get_current_workspace)):
    """Vector similarity search across workspace knowledge."""
    return search_semantically(workspace_id=workspace["id"], query=q)


@router.get("/locate")
def locate(document_id: str, section: str):
    """Pinpoint exact section/clause offset and page in document."""
    return locate_section(document_id=document_id, section_name=section)
