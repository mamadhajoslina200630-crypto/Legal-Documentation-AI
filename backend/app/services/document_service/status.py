"""Document Service - Processing status tracking."""

import uuid
from typing import Any, Dict, Optional
from sqlalchemy.orm import Session
from app.data.postgres.models.document import Document


def init_document_status(
    db: Session, workspace_id: str, filename: str, size: int, content_type: str, storage_path: str
) -> Dict[str, Any]:
    """Create a new document DB record with initial pending status."""
    doc_id = f"doc-{uuid.uuid4().hex[:12]}"
    doc = Document(
        id=doc_id,
        workspace_id=workspace_id,
        filename=filename,
        file_type=content_type,
        file_size=size,
        storage_path=storage_path,
        status="pending",
        ocr_status="not_started",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    return {
        "id": doc.id,
        "workspace_id": doc.workspace_id,
        "filename": doc.filename,
        "file_type": doc.file_type,
        "file_size": doc.file_size,
        "status": doc.status,
        "ocr_status": doc.ocr_status,
        "storage_path": doc.storage_path,
        "created_at": doc.created_at.isoformat() if doc.created_at else None,
    }


def get_document_status(db: Session, document_id: str) -> Dict[str, Any]:
    """Fetch current pipeline processing status for polling."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        return {
            "document_id": document_id,
            "status": "ready",
            "ocr_status": "completed",
            "progress_percent": 100,
        }

    progress = 100 if doc.status == "ready" else 50 if doc.status == "processing" else 15

    return {
        "document_id": doc.id,
        "filename": doc.filename,
        "status": doc.status,
        "ocr_status": doc.ocr_status,
        "progress_percent": progress,
        "error_message": doc.error_message,
    }


def update_document_status(
    db: Session, document_id: str, status: str, ocr_status: Optional[str] = None, error_message: Optional[str] = None
) -> bool:
    """Update pipeline processing state."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if doc:
        doc.status = status
        if ocr_status:
            doc.ocr_status = ocr_status
        if error_message:
            doc.error_message = error_message
        db.commit()
        return True
    return False
