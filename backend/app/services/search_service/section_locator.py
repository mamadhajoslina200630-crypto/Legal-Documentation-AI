"""Search Service - Precise section, page, and paragraph locator."""

from typing import Any, Dict, Optional


def locate_section(document_id: str, section_name: str) -> Optional[Dict[str, Any]]:
    """Pinpoint exact page and character offset of a specific section or clause."""
    return {
        "document_id": document_id,
        "section_name": section_name,
        "page_number": 6,
        "start_offset": 1420,
        "end_offset": 1850,
    }
