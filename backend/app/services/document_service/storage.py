"""Document Service - File persistence."""

from app.data.object_storage.storage_client import storage_client


def persist_file(filename: str, content: bytes) -> str:
    """Save raw file bytes to object storage."""
    return storage_client.save_file(filename, content, subfolder="uploads")


def retrieve_file(file_path: str) -> bytes:
    """Fetch raw file bytes from object storage."""
    return storage_client.read_file(file_path)
