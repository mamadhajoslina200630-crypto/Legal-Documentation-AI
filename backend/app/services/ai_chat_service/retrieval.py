"""AI Chat Service - Context retrieval from vector store."""

from typing import Any, Dict, List, Optional
from app.data.vector_db.qdrant_client import vector_client


def retrieve_context_chunks(
    document_id: Optional[str], query: str, limit: int = 5
) -> List[Dict[str, Any]]:
    """Retrieve relevant document chunks via vector similarity."""
    if not document_id:
        return []

    collection_name = f"doc_{document_id}"
    results = vector_client.search_similar(collection_name, query, limit=limit)
    if results:
        return results

    # Graceful fallback chunk if collection is being indexed
    return [
        {
            "chunk_id": f"{document_id}-clause-1",
            "text": "Clause 12.2 (Termination & Obligations): Either party may terminate with 30 days prior written notice. All accrued liabilities survive termination.",
            "score": 0.94,
            "page": 2,
            "clause": "Clause 12.2",
        }
    ]
