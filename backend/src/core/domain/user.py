from backend.src.core.domain.base import BaseDTO
from backend.src.core.enum.user import UserRole


class UserDTO(BaseDTO):
    username: str | None = None
    password: str | None = None
    role: UserRole
    telegram_id: int | None = None