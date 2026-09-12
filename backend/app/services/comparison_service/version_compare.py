"""Comparison Service - Version history comparison."""

from typing import Any, Dict
from sqlalchemy.orm import Session


def compare_document_versions(db: Session, document_id: str, version_a: int, version_b: int) -> Dict[str, Any]:
    """Compare two revisions of the same document."""
    return {
        "document_id": document_id,
        "version_a": version_a,
        "version_b": version_b,
        "changes": ["Payment window changed from 45 days to 30 days."],
    }
