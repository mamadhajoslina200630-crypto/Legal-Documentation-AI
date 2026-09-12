"""Workspace Service - Workspace conversation threads."""

import uuid
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session
from app.data.postgres.models.conversation import Conversation, Message


def create_conversation(
    db: Session, workspace_id: str = "default-workspace", title: str = "New Conversation", document_id: Optional[str] = None
) -> Dict[str, Any]:
    """Create a new conversation thread scoped to a workspace and optional document."""
    conv_id = f"conv-{uuid.uuid4().hex[:10]}"
    if db:
        conv = Conversation(
            id=conv_id,
            workspace_id=workspace_id,
            title=title,
            document_id=document_id,
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)
        return {
            "id": conv.id,
            "workspace_id": conv.workspace_id,
            "title": conv.title,
            "document_id": conv.document_id,
            "created_at": conv.created_at.isoformat() if conv.created_at else None,
        }

    return {"id": conv_id, "workspace_id": workspace_id, "title": title, "document_id": document_id}


def list_conversations(
    db: Session, workspace_id: str = "default-workspace", document_id: Optional[str] = None
) -> List[Dict[str, Any]]:
    """List conversation threads for a workspace or document."""
    if db:
        query = db.query(Conversation)
        if workspace_id:
            query = query.filter(Conversation.workspace_id == workspace_id)
        if document_id:
            query = query.filter(Conversation.document_id == document_id)

        convs = query.order_by(Conversation.created_at.desc()).all()
        if convs:
            return [
                {
                    "id": c.id,
                    "workspace_id": c.workspace_id,
                    "title": c.title,
                    "document_id": c.document_id,
                    "created_at": c.created_at.isoformat() if c.created_at else None,
                }
                for c in convs
            ]

    return [{"id": "conv-default", "workspace_id": workspace_id, "title": "New Chat", "document_id": document_id}]


def delete_conversation(db: Session, conversation_id: str) -> bool:
    """Delete conversation and its associated messages."""
    if db:
        try:
            db.query(Message).filter(Message.conversation_id == conversation_id).delete()
            db.query(Conversation).filter(Conversation.id == conversation_id).delete()
            db.commit()
            return True
        except Exception:
            db.rollback()
    return False
