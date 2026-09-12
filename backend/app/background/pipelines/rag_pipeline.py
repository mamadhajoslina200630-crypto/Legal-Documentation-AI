"""RAG Pipeline: doc → chunks via utils/text_chunking.py → embeddings → local/Qdrant vector client."""

from typing import Any, Dict
from app.utils.text_chunking import chunk_legal_text
from app.data.vector_db.qdrant_client import vector_client


def run_rag_pipeline(document_id: str, document_text: str) -> Dict[str, Any]:
    """Chunk document text, compute vector embeddings, and populate vector collection."""
    chunks = chunk_legal_text(document_text or "Default legal agreement provisions.", chunk_size=600, overlap=120)
    collection_name = f"doc_{document_id}"

    processed_chunks = []
    for i, c in enumerate(chunks):
        processed_chunks.append({
            "id": f"{document_id}-chunk-{i+1}",
            "text": c.get("text", ""),
            "page": (i // 2) + 1,
            "clause": f"Section {i+1}",
        })

    vector_client.upsert_chunks(collection_name, processed_chunks)

    return {
        "document_id": document_id,
        "chunks_indexed": len(processed_chunks),
        "vector_collection": collection_name,
    }
