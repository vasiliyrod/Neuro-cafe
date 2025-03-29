from typing import AsyncGenerator
from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from backend.src.infrastructure.database.connection.session import SessionManager
from backend.src.infrastructure.database.repositories.dish import DishRepository
from backend.src.infrastructure.database.repositories.user import UserRepository
from backend.src.infrastructure.database.repositories.order import OrderRepository
from backend.src.infrastructure.database.repositories.order_history import OrderHistoryReposity
from backend.src.infrastructure.database.repositories.review import ReviewReposity
from backend.src.infrastructure.database.repositories.chat import ChatRepository
from backend.src.infrastructure.database.repositories.booking import BookingRepository

class IUnitOfWork(ABC):
    dish: DishRepository
    user: UserRepository
    order: OrderHistoryReposity
    review: ReviewReposity
        
    chat: ChatRepository
    order: OrderRepository

    @abstractmethod
    async def __aenter__(self) -> "IUnitOfWork":
        raise NotImplementedError

    @abstractmethod
    async def __aexit__(self, exc_type: type[BaseException], exc_val: BaseException, exc_tb) -> None:
        raise NotImplementedError

    @abstractmethod
    async def commit(self) -> None:
        raise NotImplementedError

    @abstractmethod
    async def rollback(self) -> None:
        raise NotImplementedError
    

class UnitOfWork(IUnitOfWork):
    def __init__(self, session_factory: sessionmaker) -> None:
        self.__session_factory = session_factory
        self.__session: AsyncSession | None = None

    async def __aenter__(self) -> "UnitOfWork":
        self.__session = self.__session_factory()
        
        self.dish = DishRepository(session=self.__session)
        self.user = UserRepository(session=self.__session)
        self.order_history = OrderHistoryReposity(session=self.__session)
        self.review = ReviewReposity(session=self.__session)
        
        self.chat = ChatRepository()
        self.order = OrderRepository()
        self.booking = BookingRepository()
        
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        if self.__session is None:
            return

        if exc_type:
            await self.rollback()
        else:
            await self.commit()
        await self.__session.close()

    async def commit(self) -> None:
        if self.__session is not None:
            await self.__session.commit()

    async def rollback(self) -> None:
        if self.__session is not None:
            await self.__session.rollback()

session_maker = SessionManager().get_session_maker()

async def get_unit_of_work() -> AsyncGenerator[UnitOfWork, None]:
    uow = UnitOfWork(session_factory=session_maker)
    async with uow:
        yield uow