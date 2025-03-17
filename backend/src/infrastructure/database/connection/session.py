from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from backend.src.config import settings


class SessionManager:
    def __init__(self) -> None:
        self._engine = create_async_engine(
            settings.database.dsn,
            pool_size=10,
            max_overflow=20,
            echo=False,
        )
        self._sessionmaker = sessionmaker(self._engine, class_=AsyncSession, expire_on_commit=False)

    def get_session_maker(self) -> sessionmaker:
        return self._sessionmaker

session_manager = SessionManager()

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    session_maker = session_manager.get_session_maker()
    async with session_maker() as session:
        yield session
