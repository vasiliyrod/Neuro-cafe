from fastapi import APIRouter, Depends, Request
from starlette import status
from backend.src.presentation.api.auth.utils import protect, create_access_token
from backend.src.presentation.api.auth.enums import AccessLevel
from backend.src.presentation.api.dish.schema import (
    AddDishRequest, 
    DishResponse, 
    ListDishesRequest,
    AddDishResponse,
    UpdateDishRequest,
    UpdateDishResponse,
)
from backend.src.presentation.api.exceptions import EntityNotFound
from backend.src.infrastructure.database.unit_of_work import UnitOfWork, get_unit_of_work
from backend.src.core.domain.dish import DishDTO, DishDiffDTO


dish_router = APIRouter(prefix="/dishes", tags=["dish"])


# @dish_router.post(
#     path="",
#     status_code=status.HTTP_201_CREATED,
#     summary="Add Dish",
#     response_model=AddDishResponse,
# )
# @protect(min_access_level=AccessLevel.Admin)
# async def add_dish(
#     request: Request,
#     dish_data: AddDishRequest,
#     uow: UnitOfWork = Depends(get_unit_of_work)
# ) -> AddDishResponse:
#     dish: DishDTO = await uow.dish.add(
#         DishDTO(
#             name=dish_data.name,
#             type=dish_data.type,
#             description=dish_data.description,
#             all_ingredients=dish_data.all_ingredients,
#             main_ingredients=dish_data.main_ingredients,
#             img_link=dish_data.img_link,
#             cost=dish_data.cost,
#             weight=dish_data.weight,
#             cuisine=dish_data.cuisine,
#         )
#     )
#     return AddDishResponse(id=dish.id)


@dish_router.get(
    path="/{dish_id}",
    status_code=status.HTTP_200_OK,
    response_model=DishResponse,
    summary="Get Dish by Id",
)
@protect(min_access_level=AccessLevel.Admin)
async def get_dish_by_id(
    request: Request,
    dish_id: int,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> DishResponse:
    return await uow.dish.get_by_id(id=dish_id)


@dish_router.post(
    path="",
    status_code=status.HTTP_200_OK,
    response_model=list[DishResponse],
    summary="Get Dishes List",
)
@protect(min_access_level=AccessLevel.NoAuth)
async def get_dishes_list(
    request: Request,
    # dish_data: ListDishesRequest,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> list[DishResponse]:
    dishes: list[DishDTO] = await uow.dish.list()
    return [
        DishResponse(
            **dish.model_dump()
        )
        for dish in dishes
    ]


@dish_router.delete(
    path="/{dish_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Dish",
)
async def delete_dish(
    request: Request,
    dish_id: int,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> None:
    await uow.dish.delete(id=dish_id)


@dish_router.patch(
    path="/{dish_id}",
    status_code=status.HTTP_200_OK,
    summary="Update Dish",
)
async def delete_dish(
    request: Request,
    update_dish_data: UpdateDishRequest,
    dish_id: int,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> None:
    updated_dish = await uow.dish.update(
        id=dish_id,
        diff_object=DishDiffDTO(**update_dish_data.model_dump())
    )
    if updated_dish is None:
        raise EntityNotFound
    return UpdateDishResponse(**updated_dish.model_dump())
""" 
{
    "name": "Aboba",
    "type": "Type",
    "description": "Description",
    "all_ingredients": "All Ingridients",
    "main_ingredients": "Main Ingridients",
    "img_link": "img_link",
    "cost": 500,
    "weight": 123,
    "cuisine": "Cuisine"
}
"""
""" 
{
    "username": "superadmin",
    "password": "xdVVDwXx6H4UNwdo"
}
"""