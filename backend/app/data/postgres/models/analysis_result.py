"""Analysis Result relational model."""

from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from app.data.postgres.session import Base


class AnalysisResult(Base):
    """Pre-generated legal analysis and summary storage for documents."""

    __tablename__ = "analysis_results"

    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    analysis_type = Column(String, nullable=False)  # summary, key_info, compliance, general
    content = Column(Text, nullable=False)  # JSON or markdown serialized payload
    created_at = Column(DateTime, default=datetime.utcnow)
