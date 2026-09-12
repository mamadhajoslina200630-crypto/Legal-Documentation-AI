"""Redis Cache and Queue Client with native thread-safe local fallback."""

import time
import threading
from typing import Dict, Optional, Tuple
from app.config import settings


class RedisClient:
    """Wrapper around Redis connection with thread-safe in-memory fallback."""

    def __init__(self, url: Optional[str] = None):
        self.url = url or settings.REDIS_URL
        self._client = None
        self._memory_cache: Dict[str, Tuple[str, float]] = {}
        self._lock = threading.Lock()

        if self.url:
            try:
                import redis
                self._client = redis.from_url(self.url, decode_responses=True)
                self._client.ping()
            except Exception:
                self._client = None

    def get(self, key: str) -> Optional[str]:
        """Fetch cached value by key."""
        if self._client:
            try:
                return self._client.get(key)
            except Exception:
                pass

        with self._lock:
            if key in self._memory_cache:
                val, expires_at = self._memory_cache[key]
                if expires_at == 0 or time.time() < expires_at:
                    return val
                del self._memory_cache[key]
            return None

    def set(self, key: str, value: str, expire_seconds: int = 3600) -> bool:
        """Set cached value with optional expiration."""
        if self._client:
            try:
                self._client.set(key, value, ex=expire_seconds)
                return True
            except Exception:
                pass

        with self._lock:
            expires_at = time.time() + expire_seconds if expire_seconds > 0 else 0
            self._memory_cache[key] = (str(value), expires_at)
            return True

    def delete(self, key: str) -> bool:
        """Delete key from cache."""
        if self._client:
            try:
                self._client.delete(key)
            except Exception:
                pass

        with self._lock:
            if key in self._memory_cache:
                del self._memory_cache[key]
                return True
            return False


redis_client = RedisClient()
