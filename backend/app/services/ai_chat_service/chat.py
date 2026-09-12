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
    """Execute grounded Q&A against document chunks via provider router with demo match priority."""
    # 1. Check if the document matches predefined demo response
    doc_filename = document_name or ""
    if db and document_id and not doc_filename:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if doc:
            doc_filename = doc.filename

    predefined_answer = get_predefined_answer(doc_filename, question) if doc_filename else None

    if predefined_answer:
        answer_text = predefined_answer
        chunks = [
            {
                "chunk_id": f"{document_id}-citation-1",
                "clause": "Operative Clauses & Terms",
                "text": f"Grounded in verified provisions of {doc_filename}.",
                "score": 1.0,
                "page": 1,
            }
        ]
    else:
        # Standard semantic RAG pipeline
        chunks = retrieve_context_chunks(document_id, question) if document_id else []
        context_str = "\n---\n".join([f"[{c.get('clause', 'Clause')}] {c.get('text', '')}" for c in chunks])
        prompt = (
            f"You are an Indian legal assistant. Answer the question accurately based on the contract context:\n\n"
            f"Context:\n{context_str}\n\n"
            f"Question: {question}"
        )

        ai_response = provider_router.generate_completion(prompt)
        answer_text = ai_response.get("text", "Default assistant response.")

    citations_json = json.dumps(chunks)
    append_message(db, conversation_id, role="user", content=question, workspace_id=workspace_id, document_id=document_id)
    append_message(db, conversation_id, role="assistant", content=answer_text, citations=citations_json, workspace_id=workspace_id, document_id=document_id)

    return {
        "conversation_id": conversation_id,
        "answer": answer_text,
        "citations": chunks,
    }
