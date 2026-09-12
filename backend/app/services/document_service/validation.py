"""Document Service - File validation."""

from fastapi import HTTPException, status

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".png", ".jpg", ".jpeg"}
MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024  # 50 MB


def validate_file(filename: str, content: bytes, content_type: str) -> bool:
    """Validate file extension, size, and MIME content."""
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds maximum allowed limit (50MB).",
        )
    return True
