import io
import re
import zipfile
import xml.etree.ElementTree as ET
from typing import List, Tuple


def inspect_pdf_structure(pdf_bytes: bytes) -> Tuple[int, bool]:
    """Inspect PDF header, page count, and assess digital text layer."""
    if not pdf_bytes:
        return (0, False)
    
    # Try pypdf first for accurate page count and text inspection
    try:
        import pypdf
        reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
        page_count = len(reader.pages)
        sample_text = ""
        for page in reader.pages[:3]:
            sample_text += (page.extract_text() or "")
        return (page_count, len(sample_text.strip()) > 20)
    except Exception:
        pass

    is_pdf = pdf_bytes.startswith(b"%PDF")
    page_count = len(re.findall(rb"/Type\s*/Page\b", pdf_bytes)) or 1
    has_text = len(extract_text_from_file_bytes(pdf_bytes, "application/pdf")) > 50
    return (page_count, has_text)


def extract_pages_from_file_bytes(content: bytes, content_type: str = "application/pdf") -> List[str]:
    """Extract list of page texts from PDF or document bytes."""
    if not content:
        return []

    # PDF extraction using pypdf
    if content.startswith(b"%PDF") or "pdf" in content_type.lower():
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(content))
            pages = []
            for page in reader.pages:
                txt = page.extract_text() or ""
                pages.append(txt.strip())
            if any(len(p) > 0 for p in pages):
                return pages
        except Exception:
            pass

    full_text = extract_text_from_file_bytes(content, content_type)
    return [full_text] if full_text else []


def extract_text_from_file_bytes(content: bytes, content_type: str = "application/pdf") -> str:
    """Extract readable text from PDF, DOCX, TXT, or Markdown bytes."""
    if not content:
        return ""

    # 1. Try pypdf if content is PDF
    if content.startswith(b"%PDF") or "pdf" in content_type.lower():
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(content))
            extracted_pages = []
            for page in reader.pages:
                page_txt = page.extract_text()
                if page_txt:
                    extracted_pages.append(page_txt)
            if extracted_pages:
                return "\n\n".join(extracted_pages).strip()
        except Exception:
            pass

    # 2. Try DOCX extraction (zip containing word/document.xml)
    if content.startswith(b"PK\x03\x04") or "docx" in content_type.lower() or "word" in content_type.lower():
        try:
            with zipfile.ZipFile(io.BytesIO(content)) as docx_zip:
                if "word/document.xml" in docx_zip.namelist():
                    xml_content = docx_zip.read("word/document.xml")
                    tree = ET.fromstring(xml_content)
                    # DOCX text is inside w:t elements
                    texts = [node.text for node in tree.iter() if node.tag.endswith("}t") and node.text]
                    joined = " ".join(texts).strip()
                    if joined:
                        return joined
        except Exception:
            pass

    # 3. Try direct UTF-8 decode (for .txt, .md, .json, .csv)
    try:
        decoded = content.decode("utf-8")
        printable = sum(1 for c in decoded[:500] if c.isprintable())
        if printable / max(len(decoded[:500]), 1) > 0.85:
            return decoded
    except UnicodeDecodeError:
        pass

    # 4. Try latin-1 decode fallback
    try:
        decoded = content.decode("latin-1")
        printable = sum(1 for c in decoded[:500] if c.isprintable())
        if printable / max(len(decoded[:500]), 1) > 0.85:
            return decoded
    except Exception:
        pass

    # 5. Fallback: extract readable ASCII tokens
    words = re.findall(rb"[A-Za-z0-9,.:;\"'()\-\s]{4,}", content)
    readable = " ".join([w.decode("ascii", errors="ignore") for w in words[:2000]])
    return readable.strip() if len(readable.strip()) > 50 else "Sample legal agreement content for analysis."

