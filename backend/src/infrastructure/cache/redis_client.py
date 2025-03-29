from backend.src.config import settings
from typing import Any

_cache = {
    "chat": {},
    "order": {},
    "booking": {},
    "user_booking": {},
}

class RedisAdapter:
    def __init__(self, prefix: str) -> None:
        self.dsn = settings.redis.dsn
        self.p = prefix
        
    def get(self, key: int | str | None = None) -> Any:
        if key is None:
            return _cache[self.p]
        return _cache[self.p].get(key, {})
    
    def set(self, key: int | str, value: Any) -> None:
        _cache[self.p][key] = value
    
    def remove(self, key: int | str) -> None:
        del _cache[self.p][key]
    
    def exists(self, key: int | str) -> bool:
        return key in _cache[self.p].keys()