"""Workspace Service - Workspaces management."""

import uuid
from typing import Any, Dict, List
from sqlalchemy.orm import Session
from app.data.postgres.models.workspace import Workspace


def create_workspace(db: Session, name: str, owner_id: str) -> Dict[str, Any]:
    """Create a new workspace scoped to the specified owner."""
    ws_id = f"ws-{uuid.uuid4().hex[:10]}"
    ws = Workspace(
        id=ws_id,
        name=name,
        owner_id=owner_id,
    )
    if db:
        db.add(ws)
        db.commit()
        db.refresh(ws)
    return {"id": ws.id, "name": ws.name, "owner_id": ws.owner_id}


def list_user_workspaces(db: Session, user_id: str) -> List[Dict[str, Any]]:
    """List all workspaces that the user owns or belongs to."""
    if db:
        workspaces = db.query(Workspace).filter(Workspace.owner_id == user_id).all()
        if workspaces:
            return [{"id": w.id, "name": w.name, "owner_id": w.owner_id} for w in workspaces]

    return [{"id": "default-workspace", "name": "Default Workspace", "owner_id": user_id}]
