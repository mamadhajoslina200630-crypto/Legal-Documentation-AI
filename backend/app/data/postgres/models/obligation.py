"""Obligation and deadline relational model."""

from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from app.data.postgres.session import Base


class Obligation(Base):
    """Contractual obligation, deadline, notice period, or payment milestone."""

    __tablename__ = "obligations"

    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    responsible_party = Column(String, nullable=False)
    action_required = Column(Text, nullable=False)
    due_date = Column(DateTime, nullable=True)
    deadline_description = Column(String, nullable=True)
    penalty_or_consequence = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
