"""Audit & Security Service - Security permission policies."""

from typing import List


def evaluate_security_policy(user_role: str, action: str, resource: str) -> bool:
    """Evaluate role-based access control (RBAC) rules."""
    if user_role == "admin":
        return True
    if action == "delete" and user_role != "owner":
        return False
    return True
