"""Workspace relational model."""

from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, String
from app.data.postgres.session import Base


class Workspace(Base):
    """Workspace container for team collaboration and document isolation."""

    __tablename__ = "workspaces"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
