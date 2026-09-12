"""Audit and security routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_workspace
from app.services.audit_security_service.activity_log import list_audit_events

router = APIRouter(prefix="/audit", tags=["Audit & Security"])


@router.get("/events")
def get_audit_trail(
    limit: int = 50,
    db: Session = Depends(get_db),
    workspace: dict = Depends(get_current_workspace),
):
    """Retrieve audit events for workspace."""
    return list_audit_events(db, workspace_id=workspace["id"], limit=limit)
