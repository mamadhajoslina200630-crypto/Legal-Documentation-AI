"""Risk assessment relational model."""

from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from app.data.postgres.session import Base


class Risk(Base):
    """Detected legal risk or unfavorable clause in a document."""

    __tablename__ = "risks"

    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    severity = Column(String, default="medium")  # low, medium, high, critical
    category = Column(String, nullable=False)  # liability, termination, missing_protection, etc.
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    clause_reference = Column(Text, nullable=True)
    mitigation_suggestion = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
