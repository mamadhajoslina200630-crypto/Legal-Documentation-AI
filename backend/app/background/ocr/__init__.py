"""OCR package."""

from app.background.ocr.ocr_engine import ocr_engine, OCREngine
from app.background.ocr.scanned_doc_handler import detect_scanned_pdf

__all__ = ["ocr_engine", "OCREngine", "detect_scanned_pdf"]
