from backend.src.config import settings
from typing import Any

_cache = {}

class RedisAdapter:
    def __init__(self) -> None:
        self.dsn = settings.redis.dsn
    
    def get(self, key: int | str) -> Any:
        return _cache.get(key, {})
    
    def set(self, key: int | str, value: Any) -> None:
        _cache[key] = value
    
    def remove(self, key: int | str) -> None:
        del _cache[key]
    
    def exists(self, key: int | str) -> bool:
        return key in _cache.keys()