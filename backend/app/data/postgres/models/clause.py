"""Clause relational model."""

from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from app.data.postgres.session import Base


class Clause(Base):
    """Extracted clause from a legal document."""

    __tablename__ = "clauses"

    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    clause_type = Column(String, nullable=False)  # indemnity, termination, confidentiality, etc.
    title = Column(String, nullable=True)
    text = Column(Text, nullable=False)
    page_number = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
