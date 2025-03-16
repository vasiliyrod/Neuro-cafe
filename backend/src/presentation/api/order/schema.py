import datetime
from pydantic import BaseModel
from backend.src.presentation.api.base.schema import BaseRequest, BaseResponse
from backend.src.presentation.api.dish.schema import DishResponse
from backend.src.core.domain.order import OrderStatus


class UpdateOrderRequest(BaseRequest):
    count: int
    dish_id: int


class OrderItem(BaseModel):
    dish: DishResponse 
    count: int


class OrderResponse(BaseResponse):
    dishes: list[OrderItem]
    updated_at: datetime.datetime
    status: OrderStatus


class HistoryOrderResponse(BaseResponse):
    id: int
    dishes: list[OrderItem]
    created_at: datetime.datetime
    completed_at: datetime.datetime
    status: OrderStatus