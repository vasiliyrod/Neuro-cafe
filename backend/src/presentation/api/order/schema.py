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
    id: str
    dishes: list[OrderItem]
    date: datetime.datetime
    # updated_at: datetime.datetime
    status: OrderStatus


class HistoryOrderResponse(BaseResponse):
    id: int
    dishes: list[OrderItem]
    date: datetime.datetime
    # created_at:
    # completed_at: datetime.datetime
    status: OrderStatus


class InProgressOrderRequest(BaseRequest):
    table_id: int


class CompleteOrderRequest(BaseRequest):
    id: str


class HistoryOrderResponsePerUser(HistoryOrderResponse):
    table_id: int | None = None
    user_id: int


class OrderResponsePerUser(OrderResponse):
    table_id: int | None = None
    user_id: int