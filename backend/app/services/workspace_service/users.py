"""Workspace Service - User registration and authentication logic."""

from typing import Any, Dict, Optional
from sqlalchemy.orm import Session


def create_user(db: Session, email: str, password: str, full_name: Optional[str] = None) -> Dict[str, Any]:
    """Register a new user account with hashed password.

    TODO (Task 2): Hash password, create User row in DB, return user payload.
    """
    return {"id": "new-user-id", "email": email, "full_name": full_name}


def authenticate_user(db: Session, email: str, password: str) -> Optional[Dict[str, Any]]:
    """Authenticate user credentials and return user object if valid.

    TODO (Task 2): Verify user existence and password hash match.
    """
    return {"id": "auth-user-id", "email": email}
