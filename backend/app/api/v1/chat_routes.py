"""AI Chat routes: document-grounded Q&A and conversation history."""

from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_workspace
from app.services.ai_chat_service.chat import ask_legal_question
from app.services.ai_chat_service.history import get_conversation_history

router = APIRouter(prefix="/chat", tags=["AI Chat"])


class AskQuestionRequest(BaseModel):
    conversation_id: str
    question: str
    document_id: Optional[str] = None
    document_name: Optional[str] = None


@router.post("/ask")
def ask(
    payload: AskQuestionRequest,
    db: Session = Depends(get_db),
    workspace: dict = Depends(get_current_workspace),
):
    """Ask a question about an uploaded document or Indian legal concept."""
    return ask_legal_question(
        db=db,
        workspace_id=workspace["id"],
        conversation_id=payload.conversation_id,
        question=payload.question,
        document_id=payload.document_id,
        document_name=payload.document_name,
    )


class CreateConvRequest(BaseModel):
    title: str = "New Chat"
    document_id: Optional[str] = None


@router.get("/conversations")
def list_user_conversations(
    document_id: Optional[str] = None,
    db: Session = Depends(get_db),
    workspace: dict = Depends(get_current_workspace),
):
    """List conversations in the workspace."""
    from app.services.workspace_service.conversations import list_conversations
    return list_conversations(db, workspace_id=workspace["id"], document_id=document_id)


@router.post("/conversations")
def make_new_conversation(
    payload: CreateConvRequest,
    db: Session = Depends(get_db),
    workspace: dict = Depends(get_current_workspace),
):
    """Create a new conversation thread."""
    from app.services.workspace_service.conversations import create_conversation
    return create_conversation(
        db, workspace_id=workspace["id"], title=payload.title, document_id=payload.document_id
    )


@router.delete("/conversations/{conversation_id}")
def remove_conversation(conversation_id: str, db: Session = Depends(get_db)):
    """Delete a conversation thread and its message history."""
    from app.services.workspace_service.conversations import delete_conversation
    success = delete_conversation(db, conversation_id)
    return {"status": "deleted" if success else "not_found", "conversation_id": conversation_id}


@router.get("/conversations/{conversation_id}/history")
def get_history(conversation_id: str, db: Session = Depends(get_db)):
    """Retrieve message history for a conversation thread."""
    return get_conversation_history(db, conversation_id)
