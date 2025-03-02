from pydantic import model_validator
from backend.src.presentation.api.base.schema import BaseRequest, BaseResponse
from backend.src.core.domain.dish import DishDTO
from backend.src.presentation.api.exceptions import AtLeastOneFieldRequired

class AddDishRequest(BaseRequest):
    name: str
    type: str
    description: str
    all_ingredients: str
    main_ingredients: str
    img_link: str
    cost: float
    weight: float
    cuisine: str


class AddDishResponse(BaseResponse):
    id: int


class ListDishesRequest(BaseRequest):
    type: str | None = None
    cuisine: str | None = None


class DishResponse(BaseResponse):
    id: int
    name: str
    type: str
    description: str
    all_ingredients: str
    main_ingredients: str
    img_link: str
    cost: float
    weight: float
    cuisine: str


class UpdateDishRequest(BaseRequest):
    name: str | None = None
    type: str | None = None
    description: str | None = None
    all_ingredients: str | None = None
    main_ingredients: str | None = None
    img_link: str | None = None
    cost: float | None = None
    weight: float | None = None
    cuisine: str | None = None

    @model_validator(mode='after')
    def validate_not_empty(self):
        if all(value is None for value in self.model_dump().values()):
            raise AtLeastOneFieldRequired
        return self


class UpdateDishResponse(BaseRequest):
    name: str 
    type: str
    description: str
    all_ingredients: str
    main_ingredients: str
    img_link: str
    cost: float
    weight: float
    cuisine: str