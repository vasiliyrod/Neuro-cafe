from fastapi import APIRouter, Request, Depends
from backend.src.presentation.api.auth.utils import protect
from backend.src.presentation.api.auth.enums import AccessLevel
from starlette import status
from backend.src.infrastructure.database.unit_of_work import UnitOfWork, get_unit_of_work
from backend.src.presentation.api.analytics.schema import DishWithCount
from backend.src.presentation.api.dish.schema import DishResponse

analytics_router = APIRouter(prefix="/analytics", tags=["analytics"])

# сейчас вся аналитика будет за неделю
# в будущем параметризировать ручки

@analytics_router.get(
    path="/average_bill",
    status_code=status.HTTP_200_OK,
    summary="Average Bill",
)
@protect(AccessLevel.Admin)
async def get_average_bill(
    request: Request,
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> int:
    return await uow.order_history.get_average_bill()


@analytics_router.get(
    path="/popular_dishes",
    status_code=status.HTTP_200_OK,
    summary="Top 10 Popular Dishes",
    response_model=list[DishWithCount]
)
@protect(AccessLevel.Admin)
async def get_popular_dishes(
    request: Request,
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> list[DishWithCount]:
    popular_dishes = await uow.order_history.get_top_10_popular_dishes()
    return [
        DishWithCount(
            dish=DishResponse(**(await uow.dish.get_by_id(id=int(dish_id))).model_dump()),
            count=count
        )
        for dish_id, count in popular_dishes
    ]


@analytics_router.get(
    path="/guests_per_day",
    status_code=status.HTTP_200_OK,
    summary="Number of Guests Per Day",
)
@protect(AccessLevel.Admin)
async def get_guests_per_day(
    request: Request,
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> list[tuple[str, int]]:
    return await uow.order_history.get_guests_per_day()


@analytics_router.get(
    path="/order_execution",
    status_code=status.HTTP_200_OK,
    summary="Order Execution Time Last 24 Hours",
)
@protect(AccessLevel.Admin)
async def get_order_execution(
    request: Request,
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> list[tuple[int, float]]:
    return await uow.order_history.get_order_execution_times_last_24_hours()
