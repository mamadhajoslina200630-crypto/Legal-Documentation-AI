"""Object Storage Client.

Manages persistent file storage for PDFs, DOCX, images, and audio files.
"""

import os
from pathlib import Path
from typing import Optional
from app.config import settings


class StorageClient:
    """Storage client managing local/S3 file artifacts."""

    def __init__(self, base_dir: Optional[str] = None):
        self.base_dir = Path(base_dir or settings.STORAGE_DIR)
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def save_file(self, filename: str, content: bytes, subfolder: str = "documents") -> str:
        """Save file bytes and return relative storage path."""
        target_dir = self.base_dir / subfolder
        target_dir.mkdir(parents=True, exist_ok=True)
        file_path = target_dir / filename
        with open(file_path, "wb") as f:
            f.write(content)
        return str(file_path)

    def read_file(self, file_path: str) -> bytes:
        """Read bytes from storage path."""
        with open(file_path, "rb") as f:
            return f.read()

    def delete_file(self, file_path: str) -> bool:
        """Delete file from storage."""
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False


storage_client = StorageClient()
