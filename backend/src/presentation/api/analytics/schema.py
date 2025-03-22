from backend.src.presentation.api.base.schema import BaseResponse
from backend.src.presentation.api.dish.schema import DishResponse


class DishWithCount(BaseResponse):
    dish: DishResponse
    count: int