"""Scanned Document Handler.

Detects whether a PDF is digital or scanned, and routes appropriately.
"""

from typing import Tuple


def detect_scanned_pdf(file_path: str) -> Tuple[bool, int]:
    """Detect whether PDF contains selectable text or is scanned image-only.

    Returns:
        Tuple of (is_scanned: bool, total_pages: int)
    """
    # TODO (Task 3): Inspect PDF font tables and text streams
    return (False, 1)
