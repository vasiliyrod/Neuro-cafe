from backend.src.core.domain.base import BaseDTO

class MessageDTO(BaseDTO):
    isUser: bool
    text: str
    dishes: list[int]

