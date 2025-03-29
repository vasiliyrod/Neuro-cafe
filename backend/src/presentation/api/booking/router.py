from fastapi import APIRouter, Depends, Request
from starlette import status
from backend.src.presentation.api.auth.utils import protect
from backend.src.presentation.api.auth.enums import AccessLevel
from backend.src.presentation.api.booking.schema import (
    GetFreeTablesRequest, 
    GetFreeTablesResponse,
    GetTable,
    BookTableRequest,
    BookTableResponse,
    UserBookingResponse,
)
from backend.src.core.domain.booking import BookingStatus
from backend.src.infrastructure.database.unit_of_work import UnitOfWork, get_unit_of_work


booking_router = APIRouter(prefix="/booking", tags=["booking"])


@booking_router.post(
    path="/tables",
    status_code=status.HTTP_200_OK,
    summary="Get Tables Info",
    response_model=list[GetTable]
)
@protect(min_access_level=AccessLevel.Client, uid_required=False)
async def get_free_tables(
    request: Request,
    table_data: GetFreeTablesRequest,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> list[GetTable]:
    return [
        GetTable(
            id=table.id,
            x=table.x,
            y=table.y,
            seats_count=table.seats,
            occupied=table.occupied,
        )
        for table in await uow.booking.get_all_tables(
            time_start=table_data.timeStart,
            time_end=table_data.timeEnd,
            date=table_data.date,
        )
    ]

@booking_router.post(
    path="",
    status_code=status.HTTP_201_CREATED,
    summary="Book Table",
    response_model=BookTableResponse
)
@protect(min_access_level=AccessLevel.Client)
async def book_table(
    request: Request,
    book_table_data: BookTableRequest,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> BookTableResponse:
    return BookTableResponse(
        status=await uow.booking.book_table(
            user_id=request.state.user_id,
            table_id=book_table_data.table_id,
            time_start=book_table_data.timeStart,
            time_end=book_table_data.timeEnd,
            date=book_table_data.date,
        )
    )


@booking_router.get(
    path="",
    status_code=status.HTTP_200_OK,
    summary="Get User Booking",
    response_model=UserBookingResponse | None
)
@protect(min_access_level=AccessLevel.Client)
async def get_user_booking(
    request: Request,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> UserBookingResponse | None:
    user_booking = await uow.booking.get_user_booking(user_id=request.state.user_id)
    if user_booking is None:
        return 
    return UserBookingResponse(
        table_id=user_booking.table_id,
        timeStart=user_booking.time_start,
        timeEnd=user_booking.time_end,
        date=user_booking.date,
    )

@booking_router.delete(
    path="",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove User Booking",
)
@protect(min_access_level=AccessLevel.Client)
async def remove_booking(
    request: Request,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> None:
    await uow.booking.remove(user_id=request.state.user_id)