"""Search Service tests."""

from app.services.search_service.section_locator import locate_section


def test_locate_section_stub():
    """Verify locate section returns location coordinates."""
    loc = locate_section("doc-1", "Termination")
    assert loc is not None
    assert "page_number" in loc
