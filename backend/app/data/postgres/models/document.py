"""Document relational model."""

from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from app.data.postgres.session import Base


class Document(Base):
    """Document metadata, status tracking, and storage reference."""

    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)
    workspace_id = Column(String, ForeignKey("workspaces.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    storage_path = Column(String, nullable=False)
    status = Column(String, default="pending")  # pending, processing, ready, failed
    ocr_status = Column(String, default="not_started")
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
