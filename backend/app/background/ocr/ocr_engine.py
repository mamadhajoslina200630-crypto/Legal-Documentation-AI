"""OCR Engine module.

Wraps OCR text extraction for scanned PDF pages and images (Tesseract/PaddleOCR/Surya).
"""

from typing import List


class OCREngine:
    """OCR processor for scanned legal documents."""

    def extract_text_from_image(self, image_bytes: bytes) -> str:
        """Extract text from a single page image."""
        # TODO (Task 3): Run OCR model
        return "Sample OCR extracted text from page."

    def extract_text_from_scanned_pdf(self, pdf_path: str) -> List[str]:
        """Convert PDF pages to images and extract text per page."""
        return ["Page 1 OCR text.", "Page 2 OCR text."]


ocr_engine = OCREngine()
