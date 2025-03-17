import datetime
from pydantic import BaseModel
from enum import StrEnum
from backend.src.core.domain.base import BaseDTO


class OrderStatus(StrEnum):
    PENDING = "pending" # формируется
    IN_PROGRESS = "in_progress" # готовится
    COMPLETED = "completed" # готов


class OrderItemDTO(BaseModel):
    dish_id: int 
    count: int


class OrderDTO(BaseDTO):
    id: str | None
    dishes: dict[int, int]
    updated_at: datetime.datetime
    status: OrderStatus


class OrderHistoryDTO(BaseDTO):
    dishes: dict[int, int]
    created_at: datetime.datetime
    completed_at: datetime.datetime
    user_id: int