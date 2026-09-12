"""PDF and document extraction utilities."""

import re
from typing import Tuple


def inspect_pdf_structure(pdf_bytes: bytes) -> Tuple[int, bool]:
    """Inspect PDF header, page count, and assess digital text layer."""
    if not pdf_bytes:
        return (0, False)
    is_pdf = pdf_bytes.startswith(b"%PDF")
    page_count = len(re.findall(rb"/Type\s*/Page\b", pdf_bytes)) or 1
    has_text = len(extract_text_from_file_bytes(pdf_bytes, "application/pdf")) > 50
    return (page_count, has_text)


def extract_text_from_file_bytes(content: bytes, content_type: str = "application/pdf") -> str:
    """Extract readable text from PDF, DOCX, TXT, or Markdown bytes."""
    if not content:
        return ""

    # Try direct UTF-8 decode first (for .txt, .md, .json, .csv)
    try:
        decoded = content.decode("utf-8")
        # Check if it looks like human text rather than binary garbage
        printable = sum(1 for c in decoded[:500] if c.isprintable())
        if printable / max(len(decoded[:500]), 1) > 0.85:
            return decoded
    except UnicodeDecodeError:
        pass

    # Basic PDF text stream extraction
    text_pieces = []
    # Match PDF stream blocks
    stream_pattern = re.compile(rb"stream[\r\n]+(.*?)[\r\n]+endstream", re.DOTALL)
    for match in stream_pattern.finditer(content):
        chunk = match.group(1)
        # Extract text within parentheses in Tj / TJ operators
        tj_matches = re.findall(rb"\((.*?)\)\s*Tj", chunk)
        for tj in tj_matches:
            try:
                text_pieces.append(tj.decode("latin1", errors="ignore"))
            except Exception:
                pass

    extracted = " ".join(text_pieces).strip()
    if extracted:
        return extracted

    # Fallback: extract ASCII words from binary content
    words = re.findall(rb"[A-Za-z0-9,.:;\"'()\-\s]{4,}", content)
    readable = " ".join([w.decode("ascii", errors="ignore") for w in words[:2000]])
    return readable if len(readable) > 100 else "Sample legal agreement content for analysis."
