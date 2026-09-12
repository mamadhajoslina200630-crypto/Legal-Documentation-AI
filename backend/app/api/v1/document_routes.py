"""Document routes: upload, status polling, and metadata."""

from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_workspace
from app.services.document_service.upload import handle_document_upload
from app.services.document_service.status import get_document_status
from app.services.document_service.metadata import get_document_metadata

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload", status_code=status.HTTP_202_ACCEPTED)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    workspace: dict = Depends(get_current_workspace),
):
    """Upload a legal document for asynchronous processing."""
    content = await file.read()
    return handle_document_upload(
        db=db,
        workspace_id=workspace["id"],
        filename=file.filename or "uploaded_document.pdf",
        content=content,
        content_type=file.content_type or "application/pdf",
    )


@router.get("/{document_id}/status")
def check_status(document_id: str, db: Session = Depends(get_db)):
    """Poll document processing pipeline status."""
    return get_document_status(db, document_id)


@router.get("", tags=["Documents"])
def list_documents(
    db: Session = Depends(get_db),
    workspace: dict = Depends(get_current_workspace),
):
    """List all documents in the active workspace."""
    from app.data.postgres.models.document import Document
    docs = (
        db.query(Document)
        .filter(Document.workspace_id == workspace["id"])
        .order_by(Document.created_at.desc())
        .all()
    )
    return [
        {
            "id": d.id,
            "filename": d.filename,
            "file_type": d.file_type,
            "file_size": d.file_size,
            "status": d.status,
            "ocr_status": d.ocr_status,
            "created_at": d.created_at.isoformat() if d.created_at else None,
        }
        for d in docs
    ]


@router.get("/{document_id}/metadata")
def read_metadata(document_id: str, db: Session = Depends(get_db)):
    """Fetch structured metadata and properties for document."""
    return get_document_metadata(db, document_id)
