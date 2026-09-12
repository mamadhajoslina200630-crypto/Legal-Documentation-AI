"""Document Service tests."""

from app.services.document_service.validation import validate_file


def test_validate_file_under_limit():
    """Verify file validation succeeds for small payload."""
    assert validate_file("test.pdf", b"test content", "application/pdf") is True
