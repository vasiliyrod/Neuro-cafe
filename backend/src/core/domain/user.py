from backend.src.core.domain.base import BaseDTO
from backend.src.core.enum.user import UserRole


class UserDTO(BaseDTO):
    username: str
    password: str
    role: UserRole