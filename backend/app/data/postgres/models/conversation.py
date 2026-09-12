"""Conversation thread and message model."""

from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from app.data.postgres.session import Base


class Conversation(Base):
    """Conversation thread scoped to a workspace and optional document."""

    __tablename__ = "conversations"

    id = Column(String, primary_key=True, index=True)
    workspace_id = Column(String, ForeignKey("workspaces.id"), nullable=False)
    document_id = Column(String, ForeignKey("documents.id"), nullable=True)
    title = Column(String, default="New Conversation")
    created_at = Column(DateTime, default=datetime.utcnow)


class Message(Base):
    """Individual message turn in a conversation."""

    __tablename__ = "messages"

    id = Column(String, primary_key=True, index=True)
    conversation_id = Column(String, ForeignKey("conversations.id"), nullable=False)
    role = Column(String, nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    citations = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
