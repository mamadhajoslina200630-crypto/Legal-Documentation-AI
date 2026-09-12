"""Application Dependencies Module.

Provides shared FastAPI dependencies for database sessions, current user,
and active workspace context.
"""

from typing import Generator, Optional
from fastapi import Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from app.data.postgres.session import get_session


def get_db() -> Generator[Session, None, None]:
    """Yield a database session from the session factory."""
    yield from get_session()


def get_current_user(
    authorization: Optional[str] = Header(default=None),
    db: Session = Depends(get_db),
) -> dict:
    """Extract and validate current authenticated user from JWT header.

    TODO (Task 2): Decode JWT token, fetch user from database, verify active status.
    """
    if not authorization:
        # Development stub fallback for Task 1
        return {"id": "mock-user-id", "email": "dev@legalai.local", "role": "admin"}
    return {"id": "mock-user-id", "email": "dev@legalai.local", "role": "admin"}


def get_current_workspace(
    x_workspace_id: Optional[str] = Header(default=None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Validate that the current user has access to the specified workspace.

    TODO (Task 2): Check workspace membership and role in the database.
    """
    workspace_id = x_workspace_id or "default-workspace"
    return {"id": workspace_id, "name": "Default Workspace", "owner_id": current_user["id"]}
