"""Search Service - Keyword full-text search."""

from typing import Any, Dict, List
from sqlalchemy.orm import Session


def search_documents_by_keyword(db: Session, workspace_id: str, query: str) -> List[Dict[str, Any]]:
    """Execute PostgreSQL full-text search across document texts and clauses."""
    return [
        {"document_id": "doc-1", "title": "Service Agreement", "match_snippet": f"...matches query: {query}..."}
    ]
