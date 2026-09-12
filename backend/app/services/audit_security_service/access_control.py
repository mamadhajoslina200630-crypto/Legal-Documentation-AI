"""Audit & Security Service - Access control enforcement."""

from fastapi import HTTPException, status


def enforce_workspace_access(is_member: bool) -> None:
    """Enforce workspace access restrictions."""
    if not is_member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User does not have access to this workspace.",
        )
