from abc import abstractmethod, ABC
from sqlalchemy import select
from backend.src.infrastructure.database.repositories.base import GenericRepository, GenericSqlRepository
from backend.src.infrastructure.database.models.dish import DishModel
from backend.src.core.domain.dish import DishDTO


class DishReposityBase(GenericSqlRepository[DishModel, DishDTO], ABC):
    _model = DishModel
    _object = DishDTO
    
    @abstractmethod
    def get_by_name(self, name: str) -> DishModel | None:
        raise NotImplementedError


class DishRepository(DishReposityBase):
    async def get_by_name(self, name: str) -> DishModel | None:
        stmt = select(self._model).where(self._model.name == name)
        result = await self._session.execute(stmt)
        return result.scalars().first()
    
