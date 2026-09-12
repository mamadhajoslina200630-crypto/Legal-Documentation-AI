"""Workspace routes: manage workspaces, team members, and threads."""

from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.services.workspace_service.workspaces import create_workspace, list_user_workspaces
from app.services.workspace_service.conversations import create_conversation, list_conversations

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])


class CreateWorkspaceRequest(BaseModel):
    name: str


class CreateConversationRequest(BaseModel):
    title: str = "New Conversation"
    document_id: Optional[str] = None


@router.get("/")
def get_workspaces(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """List workspaces for current user."""
    return list_user_workspaces(db, user_id=current_user["id"])


@router.post("/")
def make_workspace(
    payload: CreateWorkspaceRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Create a new workspace."""
    return create_workspace(db, name=payload.name, owner_id=current_user["id"])


@router.get("/{workspace_id}/conversations")
def get_conversations(
    workspace_id: str,
    document_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """List conversation threads in workspace."""
    return list_conversations(db, workspace_id=workspace_id, document_id=document_id)


@router.post("/{workspace_id}/conversations")
def make_conversation(
    workspace_id: str,
    payload: CreateConversationRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Create a new conversation thread in workspace."""
    return create_conversation(
        db, workspace_id=workspace_id, title=payload.title, document_id=payload.document_id
    )
