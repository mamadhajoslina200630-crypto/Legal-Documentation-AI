"""Audit log relational model."""

from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from app.data.postgres.session import Base


class AuditLog(Base):
    """Activity log tracking document accesses, user mutations, and AI executions."""

    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True)
    workspace_id = Column(String, ForeignKey("workspaces.id"), nullable=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=False)
    resource_type = Column(String, nullable=False)
    resource_id = Column(String, nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
