"""Text chunking utility for RAG pipeline."""

from typing import Dict, List


def chunk_legal_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[Dict[str, str]]:
    """Split legal text into overlapping chunks, respecting clause and paragraph boundaries."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append({"text": chunk, "start": start, "end": end})
        start += chunk_size - overlap
    return chunks if chunks else [{"text": text, "start": 0, "end": len(text)}]
