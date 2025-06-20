from abc import abstractmethod, ABC
import datetime
from sqlalchemy import select
from backend.src.infrastructure.database.repositories.base import GenericRepository, GenericSqlRepository
from backend.src.infrastructure.database.models.order_history import OrderHistoryModel
from backend.src.core.domain.order import OrderDTO, OrderHistoryDTO

class OrderHistoryReposityBase(GenericSqlRepository[OrderHistoryModel, OrderHistoryDTO], ABC):
    _model = OrderHistoryModel
    _object = OrderHistoryDTO



class OrderHistoryReposity(OrderHistoryReposityBase):
    async def complete(self, user_id:int, order: OrderDTO) ->OrderHistoryDTO:
        order_history = OrderHistoryDTO(
            dishes=order.dishes,
            created_at=order.updated_at,
            completed_at=datetime.datetime.now(),
            user_id=user_id
        )
        await self.add(order_history)
