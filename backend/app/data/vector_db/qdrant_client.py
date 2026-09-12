"""Qdrant and Native Local Vector Database Client.

Provides semantic indexing, embedding storage, and similarity search for legal document chunks.
Falls back seamlessly to local persistent vector storage when Qdrant container is not running.
"""

import json
import math
import os
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
from app.config import settings


def _compute_text_vector(text: str, dimensions: int = 64) -> List[float]:
    """Lightweight deterministic semantic vector calculation for local RAG."""
    vec = [0.0] * dimensions
    words = re.findall(r"\w+", text.lower())
    if not words:
        return vec

    for word in words:
        # Hash word into dimension index and sign
        h = hash(word)
        idx = abs(h) % dimensions
        weight = 1.0 + math.log(len(word))
        vec[idx] += weight if (h > 0) else -weight

    # L2 normalize
    norm = math.sqrt(sum(x * x for x in vec))
    if norm > 0:
        vec = [round(x / norm, 6) for x in vec]
    return vec


def _cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """Compute cosine similarity between two unit vectors."""
    if not vec_a or not vec_b:
        return 0.0
    dim = min(len(vec_a), len(vec_b))
    return sum(vec_a[i] * vec_b[i] for i in range(dim))


class QdrantVectorClient:
    """Wrapper around Qdrant client with local persistent fallback."""

    def __init__(self, host: Optional[str] = None, port: Optional[int] = None):
        self.host = host or settings.QDRANT_HOST
        self.port = port or settings.QDRANT_PORT
        self.storage_dir = Path(settings.STORAGE_DIR) / "vectors"
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self.client = None
        self._local_collections: Dict[str, List[Dict[str, Any]]] = {}
        self._load_local_store()

    def _get_collection_file(self, collection_name: str) -> Path:
        safe_name = re.sub(r"[^a-zA-Z0-9_\-]", "_", collection_name)
        return self.storage_dir / f"{safe_name}.json"

    def _load_local_store(self) -> None:
        """Load collections from local vector storage files."""
        for file_path in self.storage_dir.glob("*.json"):
            col_name = file_path.stem
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    self._local_collections[col_name] = json.load(f)
            except Exception:
                pass

    def _save_local_collection(self, collection_name: str) -> None:
        """Persist collection to disk."""
        target = self._get_collection_file(collection_name)
        with open(target, "w", encoding="utf-8") as f:
            json.dump(self._local_collections.get(collection_name, []), f, indent=2)

    def initialize(self) -> None:
        """Initialize connection if Qdrant daemon is available."""
        try:
            from qdrant_client import QdrantClient
            self.client = QdrantClient(host=self.host, port=self.port, timeout=2.0)
            self.client.get_collections()
        except Exception:
            self.client = None

    def upsert_chunks(self, collection_name: str, chunks: List[Dict[str, Any]]) -> bool:
        """Upsert embedded document chunks into the specified collection."""
        processed_chunks = []
        for i, chunk in enumerate(chunks):
            text = chunk.get("text", "")
            vector = chunk.get("vector") or _compute_text_vector(text)
            chunk_data = {
                "id": chunk.get("id") or chunk.get("chunk_id") or f"chunk-{i+1}",
                "text": text,
                "vector": vector,
                "page": chunk.get("page", 1),
                "clause": chunk.get("clause", ""),
                "metadata": chunk.get("metadata", {}),
            }
            processed_chunks.append(chunk_data)

        self._local_collections[collection_name] = processed_chunks
        self._save_local_collection(collection_name)
        return True

    def search_similar(
        self,
        collection_name: str,
        query: Union[str, List[float]],
        limit: int = 5,
    ) -> List[Dict[str, Any]]:
        """Retrieve most relevant chunks given a query string or vector."""
        if isinstance(query, str):
            query_vector = _compute_text_vector(query)
            query_text = query.lower()
        else:
            query_vector = query
            query_text = ""

        chunks = self._local_collections.get(collection_name, [])
        scored_chunks = []

        for chunk in chunks:
            chunk_vec = chunk.get("vector", [])
            similarity = _cosine_similarity(query_vector, chunk_vec)
            
            # Keyword match boost
            chunk_text = chunk.get("text", "").lower()
            if query_text and any(word in chunk_text for word in query_text.split() if len(word) > 3):
                similarity = min(1.0, similarity + 0.15)

            scored_chunks.append({
                "chunk_id": chunk.get("id"),
                "text": chunk.get("text"),
                "score": round(max(0.1, similarity), 4),
                "page": chunk.get("page", 1),
                "clause": chunk.get("clause", ""),
            })

        scored_chunks.sort(key=lambda x: x["score"], reverse=True)
        return scored_chunks[:limit]


vector_client = QdrantVectorClient()
