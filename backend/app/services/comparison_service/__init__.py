"""Comparison Service package."""

from app.services.comparison_service.document_diff import compare_two_documents
from app.services.comparison_service.version_compare import compare_document_versions
from app.services.comparison_service.clause_diff import compare_clauses

__all__ = ["compare_two_documents", "compare_document_versions", "compare_clauses"]
