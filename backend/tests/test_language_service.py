"""Language Service tests."""

from app.services.language_service.simple_explanation import simplify_legal_text


def test_simplify_stub():
    """Verify simplification returns output structure."""
    res = simplify_legal_text("Indemnity clause here.")
    assert "simple_explanation" in res
