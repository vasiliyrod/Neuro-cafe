from backend.src.core.domain.base import BaseDTO
from enum import StrEnum
from datetime import date, time

class TableDTO(BaseDTO):
    x: int
    y: int
    seats: int
    occupied: bool

class BookingStatus(StrEnum):
    SUCCESS = "Успешно забронировано"
    ALREADY_BOOKED = "Столик уже занят"
    ERROR = "Ошибка бронирования"


class BookingDTO(BaseDTO):
    table_id: int
    time_start: time
    time_end: time
    date: date