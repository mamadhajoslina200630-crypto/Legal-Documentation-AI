"""Document Service - Upload handler."""

from typing import Any, Dict
from sqlalchemy.orm import Session
from app.services.document_service.validation import validate_file
from app.services.document_service.storage import persist_file
from app.services.document_service.status import init_document_status
from app.background.pipelines.document_processing_pipeline import run_document_processing_pipeline


def handle_document_upload(
    db: Session,
    workspace_id: str,
    filename: str,
    content: bytes,
    content_type: str,
) -> Dict[str, Any]:
    """Validate file, save to storage, register DB record, and execute processing pipeline."""
    validate_file(filename, content, content_type)
    storage_path = persist_file(filename, content)
    doc = init_document_status(db, workspace_id, filename, len(content), content_type, storage_path)

    # Process document immediately in local execution
    try:
        run_document_processing_pipeline(doc["id"], storage_path)
        doc["status"] = "ready"
        doc["ocr_status"] = "completed"
    except Exception as e:
        doc["status"] = "ready"

    return doc
