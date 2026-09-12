"""AI Chat Service - Conversation history persistence."""

import uuid
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session
from app.data.postgres.models.conversation import Conversation, Message


def ensure_conversation(db: Session, conversation_id: str, workspace_id: str = "default-workspace", document_id: Optional[str] = None) -> Conversation:
    """Ensure conversation record exists in DB."""
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        conv = Conversation(
            id=conversation_id,
            workspace_id=workspace_id,
            document_id=document_id,
            title="Legal Document Chat",
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)
    return conv


def append_message(
    db: Session,
    conversation_id: str,
    role: str,
    content: str,
    citations: Optional[str] = None,
    workspace_id: str = "default-workspace",
    document_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Persist a message turn to the database."""
    if db:
        try:
            ensure_conversation(db, conversation_id, workspace_id, document_id)
            msg = Message(
                id=f"msg-{uuid.uuid4().hex[:12]}",
                conversation_id=conversation_id,
                role=role,
                content=content,
                citations=citations,
            )
            db.add(msg)
            db.commit()
            return {
                "id": msg.id,
                "conversation_id": conversation_id,
                "role": role,
                "content": content,
                "citations": citations,
            }
        except Exception:
            db.rollback()

    return {"conversation_id": conversation_id, "role": role, "content": content, "citations": citations}


def get_conversation_history(db: Session, conversation_id: str) -> List[Dict[str, Any]]:
    """Fetch message history for a conversation thread."""
    if db:
        messages = (
            db.query(Message)
            .filter(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .all()
        )
        if messages:
            return [
                {
                    "id": m.id,
                    "role": m.role,
                    "content": m.content,
                    "citations": m.citations,
                    "created_at": m.created_at.isoformat() if m.created_at else None,
                }
                for m in messages
            ]

    return [
        {"role": "assistant", "content": "Hello! I am your Legal AI assistant. Ask me anything about your uploaded contracts, court judgments, or legal clauses."},
    ]
