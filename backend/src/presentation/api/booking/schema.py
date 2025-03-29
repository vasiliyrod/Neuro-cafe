from datetime import time, date
from backend.src.presentation.api.base.schema import BaseRequest, BaseResponse


class GetFreeTablesRequest(BaseRequest):
    timeStart: time
    timeEnd: time
    date: date


class GetFreeTablesResponse(BaseResponse):
    table_ids: list[int]
    

class BookTableRequest(BaseRequest):
    table_id: int
    timeStart: time
    timeEnd: time
    date: date


class BookTableResponse(BaseResponse):
    status: str


class GetTable(BaseResponse):
    id: int
    x: int
    y: int
    seats_count: int
    occupied: bool


class UserBookingResponse(BaseResponse):
    table_id: int
    timeStart: time
    timeEnd: time
    date: date