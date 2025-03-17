from fastapi import APIRouter, Depends, Request
from starlette import status
from backend.src.presentation.api.auth.utils import protect
from backend.src.presentation.api.auth.enums import AccessLevel
from backend.src.presentation.api.dish.schema import (
    DishResponse, 
)
from backend.src.infrastructure.database.unit_of_work import UnitOfWork, get_unit_of_work
from backend.src.presentation.api.order.schema import (
    UpdateOrderRequest, 
    OrderItem, 
    OrderResponse,
    HistoryOrderResponse,
    CompleteOrderRequest
)
from backend.src.presentation.api.exceptions import EntityNotFound
from backend.src.core.domain.order import OrderStatus


order_router = APIRouter(prefix="/orders", tags=["order"])


@order_router.patch(
    path="",
    status_code=status.HTTP_200_OK,
    summary="Update Order",
)
@protect(min_access_level=AccessLevel.NoAuth)
async def update_order(
    request: Request,
    order_data: UpdateOrderRequest,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> None:
    if not await uow.dish.get_by_id(id=order_data.dish_id):
        raise EntityNotFound
    
    await uow.order.update_dish_count(
        user_id=request.state.user_id,
        dish_id=order_data.dish_id,
        new_number=order_data.count,
    )


@order_router.get(
    path="/count",
    status_code=status.HTTP_200_OK,
    summary="Get Dishes Count In Order",
)
@protect(min_access_level=AccessLevel.NoAuth)
async def count_dishes(
    request: Request,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> int:
    return await uow.order.count_dishes(user_id=request.state.user_id)


@order_router.get(
    path="",
    status_code=status.HTTP_200_OK,
    response_model=list[OrderResponse],
    summary="Get Dishes List",
)
@protect(min_access_level=AccessLevel.Client)
async def get_orders_list(
    request: Request,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> list[OrderResponse]:
    orders = await uow.order.list(user_id=request.state.user_id)
    return [
        OrderResponse(
            id=order.id,
            dishes=[
                OrderItem(
                    dish=DishResponse(**(await uow.dish.get_by_id(id=dish_id)).model_dump()),
                    count=dish_count
                )
                for dish_id, dish_count in order.dishes.items()
            ],
            status=order.status,
            date=order.updated_at,
            
        )
        for order in orders
        if order.status == OrderStatus.PENDING
    ]


@order_router.get(
    path="/history",
    status_code=status.HTTP_200_OK,
    response_model=list[HistoryOrderResponse | OrderResponse],
    summary="Get Orders History",
)
@protect(min_access_level=AccessLevel.Client)
async def get_order_historys_list(
    request: Request,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> list[HistoryOrderResponse | OrderResponse]:
    orders_in_progress = await uow.order.get_by_status(
        user_id=request.state.user_id, 
        status=OrderStatus.IN_PROGRESS
    )
    orders_history = await uow.order_history.list(user_id=request.state.user_id)
    result = [
        OrderResponse(
            id=order.id,
            dishes=[
                OrderItem(
                    dish=DishResponse(**(await uow.dish.get_by_id(id=dish_id)).model_dump()),
                    count=dish_count
                )
                for dish_id, dish_count in order.dishes.items()
            ],
            status=order.status,
            date=order.updated_at,
        )
        for order in orders_in_progress
    ]
    result += [
        HistoryOrderResponse(
            id=order.id,
            dishes=[
                OrderItem(
                    dish=DishResponse(**(await uow.dish.get_by_id(id=dish_id)).model_dump()),
                    count=dish_count
                )
                for dish_id, dish_count in order.dishes.items()
            ],
            status=OrderStatus.COMPLETED,
            date=order.completed_at,
        )
        for order in orders_history
    ]
    return result

@order_router.post(
    path="/in_progress",
    status_code=status.HTTP_200_OK,
)
@protect(min_access_level=AccessLevel.Client)
async def complete_order(
    request: Request,
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> None:
    await uow.order.set_in_progress(user_id=request.state.user_id)

@order_router.post(
    path="/complete",
    status_code=status.HTTP_200_OK,
)
@protect(min_access_level=AccessLevel.Client)
async def complete_order(
    request: Request,
    complete_order: CompleteOrderRequest,
    uow: UnitOfWork = Depends(get_unit_of_work),
) -> None:
    order = await uow.order.remove(user_id=request.state.user_id, order_id=complete_order.id)
    await uow.order_history.complete(order=order, user_id=request.state.user_id)
