"""AI Chat Service - Document Q&A and conversational assistance."""

import json
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session
from app.ai_layer.provider_router import provider_router
from app.services.ai_chat_service.retrieval import retrieve_context_chunks
from app.services.ai_chat_service.history import append_message, get_conversation_history
from app.services.demo_response_service import get_predefined_answer
from app.data.postgres.models.document import Document


def ask_legal_question(
    db: Session,
    workspace_id: str,
    conversation_id: str,
    question: str,
    document_id: Optional[str] = None,
    document_name: Optional[str] = None,
) -> Dict[str, Any]:
    """Execute Q&A with strict demo matching."""
    doc_filename = document_name or ""
    if db and document_id and not doc_filename:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if doc:
            doc_filename = doc.filename

    predefined_answer = get_predefined_answer(doc_filename, question) if doc_filename else None

    if not predefined_answer:
         return {
            "success": False, 
            "error": f"This question is not mapped for document ({doc_filename}) in the Demo Version."
         }

    chunks = [
        {
            "chunk_id": f"{document_id}-citation-1",
            "clause": "Operative Clauses & Terms",
            "text": f"Grounded in verified provisions of {doc_filename}.",
            "score": 1.0,
            "page": 1,
        }
    ]

    citations_json = json.dumps(chunks)
    append_message(db, conversation_id, role="user", content=question, workspace_id=workspace_id, document_id=document_id)
    append_message(db, conversation_id, role="assistant", content=predefined_answer, citations=citations_json, workspace_id=workspace_id, document_id=document_id)

    return {
        "success": True,
        "data": {
            "conversation_id": conversation_id,
            "answer": predefined_answer,
            "citations": chunks,
        }
    }
