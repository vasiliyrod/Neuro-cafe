from abc import abstractmethod, ABC
import datetime
from sqlalchemy import select, func, cast, Integer
from sqlalchemy.dialects.postgresql import INTEGER
from backend.src.infrastructure.database.repositories.base import GenericRepository, GenericSqlRepository
from backend.src.infrastructure.database.models.order_history import OrderHistoryModel
from backend.src.core.domain.order import OrderDTO, OrderHistoryDTO
from backend.src.infrastructure.database.models.dish import DishModel
class OrderHistoryReposityBase(GenericSqlRepository[OrderHistoryModel, OrderHistoryDTO], ABC):
    _model = OrderHistoryModel
    _object = OrderHistoryDTO



class OrderHistoryReposity(OrderHistoryReposityBase):
    async def complete(self, user_id:int, order: OrderDTO) ->OrderHistoryDTO:
        order_history = OrderHistoryDTO(
            dishes=order.dishes,
            created_at=order.updated_at,
            completed_at=datetime.datetime.now(),
            user_id=user_id,
            cost=sum([(await self._get_dish_cost(int(dish_id))) * count for dish_id, count in order.dishes.items()]),
        )
        await self.add(order_history)
    
    async def get_average_bill(self) -> float:
        seven_days_ago = datetime.datetime.now() - datetime.timedelta(days=7)
        stmt = select(self._model.cost).where(self._model.completed_at >= seven_days_ago)
        result = await self._session.execute(stmt)
        bills = [bill for bill in result.scalars().all() if bill]
        if not bills:
            return 0
        return sum(bills) / len(bills)
    
    async def _get_dish_cost(self, dish_id: int) -> float:
        result = await self._session.execute(select(DishModel.cost).where(DishModel.id == dish_id))
        return result.scalars().first()
    
    async def get_top_10_popular_dishes(self):
        seven_days_ago = datetime.datetime.now() - datetime.timedelta(days=7)
        subquery = (
            select(
                func.jsonb_each_text(self._model.dishes).table_valued("key", "value"),
                self._model
            )
            .where(self._model.completed_at >= seven_days_ago)
            .subquery()
        )

        stmt = (
            select(
                subquery.c.key.label("dish_id"),
                func.sum(cast(subquery.c.value, Integer)).label("total_orders")
            )
            .group_by(subquery.c.key)
            .order_by(func.sum(cast(subquery.c.value, Integer)).desc())
            .limit(10)
        )

        result = await self._session.execute(stmt)
        return result.all()
    
    async def get_guests_per_day(self):
        seven_days_ago = datetime.datetime.now() - datetime.timedelta(days=7)

        stmt = (
            select(
                func.to_char(self._model.completed_at, 'Day').label("day_of_week"),
                func.count(func.distinct(self._model.user_id)).label("guests_count")
            )
            .where(self._model.completed_at >= seven_days_ago)
            .group_by("day_of_week")
            .order_by("day_of_week")
        )

        result = await self._session.execute(stmt)
        return result.all()
    
    async def get_order_execution_times_last_24_hours(self):
        twenty_four_hours_ago = datetime.datetime.now() - datetime.timedelta(hours=24)

        stmt = (
            select(
                func.extract('hour', self._model.completed_at).label("hour_of_day"), 
                (func.extract('epoch', self._model.completed_at - self._model.created_at) / 3600).label("hours_diff") 
            )
            .where(self._model.completed_at >= twenty_four_hours_ago)
            .order_by(self._model.completed_at)
        )

        result = await self._session.execute(stmt)
        return result.all()