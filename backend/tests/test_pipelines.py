"""Background pipeline tests."""

from app.background.pipelines.document_processing_pipeline import run_document_processing_pipeline
from app.background.pipelines.rag_pipeline import run_rag_pipeline


def test_document_processing_pipeline_stub():
    """Verify document processing pipeline returns status."""
    res = run_document_processing_pipeline("doc-1", "path/to/test.pdf")
    assert res["status"] == "ready"


def test_rag_pipeline_stub():
    """Verify RAG pipeline returns chunk indexing count."""
    res = run_rag_pipeline("doc-1", "Sample contract text for RAG.")
    assert "chunks_indexed" in res
