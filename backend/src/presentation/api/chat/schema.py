from backend.src.presentation.api.base.schema import BaseResponse, BaseRequest
from backend.src.presentation.api.dish.schema import DishResponse

class AddMessageResponse(BaseResponse):
    message: str
    dishes: list[DishResponse]


class HistoryChatResponse(BaseResponse):
    isUser: bool
    text: str
    dishes: list[DishResponse]


class AddMessageRequest(BaseRequest):
    message: str