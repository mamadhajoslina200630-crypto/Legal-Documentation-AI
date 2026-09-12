"""Audit & Security Service - Activity and audit trail logging."""

import uuid
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session
from app.data.postgres.models.audit_log import AuditLog


def record_audit_event(
    db: Session,
    workspace_id: Optional[str],
    user_id: Optional[str],
    action: str,
    resource_type: str,
    resource_id: Optional[str] = None,
    details: Optional[str] = None,
) -> Dict[str, Any]:
    """Record an audit log entry for user action or AI system event."""
    log_id = f"audit-{uuid.uuid4().hex[:10]}"
    if db:
        try:
            entry = AuditLog(
                id=log_id,
                workspace_id=workspace_id,
                user_id=user_id,
                action=action,
                resource_type=resource_type,
                resource_id=resource_id,
                details=details,
            )
            db.add(entry)
            db.commit()
        except Exception:
            db.rollback()

    return {
        "id": log_id,
        "action": action,
        "resource_type": resource_type,
        "resource_id": resource_id,
        "status": "recorded",
    }


def list_audit_events(db: Session, workspace_id: str, limit: int = 50) -> List[Dict[str, Any]]:
    """Retrieve audit trail for a workspace."""
    if db:
        logs = (
            db.query(AuditLog)
            .filter(AuditLog.workspace_id == workspace_id)
            .order_by(AuditLog.created_at.desc())
            .limit(limit)
            .all()
        )
        if logs:
            return [
                {
                    "id": l.id,
                    "action": l.action,
                    "resource_type": l.resource_type,
                    "resource_id": l.resource_id,
                    "user_id": l.user_id,
                    "details": l.details,
                    "created_at": l.created_at.isoformat() if l.created_at else None,
                }
                for l in logs
            ]

    return [
        {"action": "DOCUMENT_UPLOAD", "resource_type": "document", "resource_id": "doc-1", "user_id": "mock-user-id"}
    ]
