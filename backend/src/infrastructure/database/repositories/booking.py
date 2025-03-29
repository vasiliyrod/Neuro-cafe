from datetime import time, date
from abc import abstractmethod, ABC
from functools import cached_property
from backend.src.infrastructure.database.repositories.base import GenericCacheRepository
from backend.src.core.domain.booking import TableDTO, BookingDTO, BookingStatus
from backend.src.infrastructure.cache.redis_client import RedisAdapter
from backend.src.config import settings

class BookingReposityBase(GenericCacheRepository[TableDTO], ABC):
    _object = TableDTO
    
    @abstractmethod
    async def get_all_tables(self) -> list[TableDTO]:
        raise NotImplementedError
    
    @abstractmethod
    async def get_free_tables(self, time_start: time, time_end: time, date: date) -> list[int]:
        raise NotImplementedError
    
    @abstractmethod
    async def book_table(
        self,
        table_id: int,
        time_start: time,
        time_end: time,
        date:date,
    ) -> BookingStatus:
        raise NotImplementedError
    

class BookingRepository(BookingReposityBase):
    
    def __init__(self, prefix: str = "booking") -> None:
        super().__init__(prefix)
        self._user_cache = RedisAdapter(prefix="user_booking")
        
        """
        self._cache = {
            "date":  {
                (time_start, time_end, table_id)
            }
        }
        """
        
    @cached_property
    def all_tables_ids(self):
        return {table.id for table in settings.meta.tables}
        
    
    async def get_all_tables(self, time_start: time, time_end: time, date: date) -> list[TableDTO]:
        free_tables_ids = await self.get_free_tables_ids(time_start, time_end, date)
        return [
            TableDTO(
                id=table.id,
                x=table.x,
                y=table.y,
                seats=table.seats_count,
                occupied=table.id not in free_tables_ids
            )
            for table in settings.meta.tables
        ]
    
    async def get_free_tables(self, time_start: time, time_end: time, date: date) -> TableDTO:
        free_tables_ids = await self.get_free_tables_ids(time_start, time_end, date)
        return [
            table for table in settings.meta.tables
            if table.id in free_tables_ids
        ]
    
    async def get_free_tables_ids(self, time_start: time, time_end: time, date: date) -> set[int]:
        if not self._cache.exists(key=date):
            return list(self.all_tables_ids)

        booked_tables = set()

        for (start, end, table_id) in self._cache.get(key=date):
            if not (end <= time_start or start >= time_end):
                booked_tables.add(table_id)

        return self.all_tables_ids - booked_tables
        
        
    
    async def book_table(
        self,
        user_id: int,
        table_id: int,
        time_start: time,
        time_end: time,
        date: date,
    ) -> BookingStatus:
        if time_end <= time_start:
            return BookingStatus.ERROR
        
        if date < date:
            return BookingStatus.ERROR
        
        if table_id not in self.all_tables_ids:
            return BookingStatus.ERROR

        if not table_id in (await self.get_free_tables_ids(time_start, time_end, date)):
            return BookingStatus.ALREADY_BOOKED
        
        new_bookings = self._cache.get(key=date) or set()
        new_bookings.add((time_start, time_end, table_id))
        
        old_user_booking = self._user_cache.get(key=user_id)
        # у пользователя может быть только одно бронирование
        # если уже есть, то не ругаемся, а просто сносим его
        
        self._cache.set(key=date, value=new_bookings)
        self._user_cache.set(key=user_id, value=(table_id, time_start, time_end, date))
        
        if old_user_booking:
            date = old_user_booking[3]
            new_bookings = self._cache.get(key=date)
            new_bookings.remove((old_user_booking[1], old_user_booking[2], old_user_booking[0]))
            self._cache.set(key=date, value=new_bookings)
        
        return BookingStatus.SUCCESS
    
    async def get_user_booking(self, user_id: int) -> BookingDTO:
        user_booking = self._user_cache.get(key=user_id)
        
        if not user_booking:
            return None
        
        return BookingDTO(
            table_id=user_booking[0],
            time_start=user_booking[1],
            time_end=user_booking[2],
            date=user_booking[3],
        )
    
    async def remove(self, user_id: int) -> None:
        user_booking = self._user_cache.get(key=user_id)
        if not user_booking:
            return
        self._user_cache.remove(key=user_id)
        date = user_booking[3]
        new_bookings = self._cache.get(key=date)
        new_bookings.remove((user_booking[1], user_booking[2], user_booking[0]))
        self._cache.set(key=date, value=new_bookings)