"""Workspace Service - Permission validation."""

from sqlalchemy.orm import Session


def check_workspace_permission(db: Session, user_id: str, workspace_id: str, required_role: str = "member") -> bool:
    """Verify whether a user possesses the required permission level in a workspace.

    TODO (Task 2): Check roles table (owner/admin/member).
    """
    return True
