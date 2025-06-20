from abc import abstractmethod, ABC
from typing import TypeVar, Generic
from pydantic import BaseModel
from sqlalchemy import and_, select
from sqlalchemy.orm import declarative_base
from sqlalchemy.ext.asyncio import AsyncSession
from backend.src.core.domain.base import BaseDTO
from backend.src.infrastructure.cache.redis_client import RedisAdapter

ModelType = TypeVar("ModelType", bound=declarative_base)
ObjectType = TypeVar("ObjectType", bound=BaseDTO)


class GenericRepository[ObjectType](ABC):
    
    _object : type[ObjectType]
    
    @abstractmethod
    def add(self, object: ObjectType) -> ObjectType:
        raise NotImplementedError

    @abstractmethod
    def delete(self, id: int) -> None:
        raise NotImplementedError


class GenericSqlRepository[ModelType, ObjectType](GenericRepository[ObjectType], ABC):
    
    _model: type[ModelType]
    
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def _construct_get_stmt(self, id: int):
        stmt = select(self._model).where(self._model.id == id)
        return stmt

    async def get_by_id(self, id: int) -> ObjectType | None:
        record = await self._get_model_by_id(id=id)

        if record is None:
            return None
        
        return self._convert_model_to_dto(record)

    def _construct_list_stmt(self, **filters):
        stmt = select(self._model)
        where_clauses = []
        for column, value in filters.items():
            if not hasattr(self._model, column):
                raise ValueError(f"Invalid column name {column}")
            if value is None:
                continue
            where_clauses.append(getattr(self._model, column) == value)

        if len(where_clauses) == 1:
            stmt = stmt.where(where_clauses[0])
        elif len(where_clauses) > 1:
            stmt = stmt.where(and_(*where_clauses))
        return stmt

    async def list(self, **filters) -> list[ObjectType]:
        stmt = self._construct_list_stmt(**filters)
        result = await self._session.execute(stmt)
        return [
            self._convert_model_to_dto(record)
            for record in result.scalars().all()
        ]

    async def add(self, object: ObjectType) -> ObjectType:
        record = self._convert_dto_to_model(object=object)
        self._session.add(record)
        await self._session.flush()
        await self._session.refresh(record)
        return self._convert_model_to_dto(record)

    async def update(self, id: int, diff_object: ObjectType) -> ObjectType | None:
        record = await self._get_model_by_id(id=id)
        if record is None:
            return None
        updated_record = self._update_record(record=record, diff_object=diff_object)
        self._session.add(updated_record)
        await self._session.flush()
        await self._session.refresh(updated_record)
        return self._convert_model_to_dto(updated_record)

    async def delete(self, id: int) -> None:
        record = await self._get_model_by_id(id=id)
        if record is not None:
            await self._session.delete(record)
            await self._session.flush()
    
    def _convert_dto_to_model(self, object: ObjectType) -> ModelType:
        """ 
        Преобразовать DTO в Model БД
        
        По дефолту конвертится поле в поле
        Если кол-во/названия полей различаются, переопределить в дочернем Repository
        """
        return self._model(**object.model_dump())
    
    def _convert_model_to_dto(self, record: ModelType) -> ObjectType:
        """ 
        Преобразовать Модель БД в DTO
        
        По дефолту конвертится поле в поле
        Если кол-во/названия полей различаются, переопределить в дочернем Repository
        """
        return self._object.model_validate(record)
    
    def _update_record(self, record: ModelType, diff_object: ObjectType) -> ModelType:
        """ 
        Обновить поля экземпляра модели
        
        Если названия полей в модели и DTO различаются, переопределить в дочернем Repository
        """
        for field, val in diff_object.model_dump().items():
            if val is not None:
                setattr(record, field, val)
        return record
    
    async def _get_model_by_id(self, id: int) -> ModelType | None:
        stmt = self._construct_get_stmt(id)
        result = await self._session.execute(stmt)
        return result.scalars().first()


class GenericCacheRepository[ObjectType](GenericRepository[ObjectType], ABC):
    def __init__(self):
        self._cache = RedisAdapter()
        
    async def add(self, key: int | str, value: ObjectType) -> None:
        self._cache.set(key=key, value=value)
    
    async def delete(self, key: int | str) -> None:
        self._cache.remove(key=key)
    
    async def list(self, key: int | str) -> ObjectType:
        return self._object.model_validate(self._cache.get(key=key))