from backend.src.core.domain.base import BaseDTO


class DishDTO(BaseDTO):
    name: str
    type: str
    description: str
    all_ingredients: str
    main_ingredients: str
    img_link: str
    cost: float
    weight: float
    cuisine: str


class DishDiffDTO(BaseDTO):
    name: str | None = None
    type: str | None = None
    description: str | None = None
    all_ingredients: str | None = None
    main_ingredients: str | None = None
    img_link: str | None = None
    cost: float | None = None
    weight: float | None = None
    cuisine: str | None = None