"""Legal Intelligence Service tests."""

from app.services.legal_intelligence_service.analysis import run_full_analysis


def test_analysis_stub():
    """Verify analysis returns result structure."""
    res = run_full_analysis(db=None, document_id="doc-123", document_text="Contract text")
    assert res["document_id"] == "doc-123"
    assert "assessment" in res
