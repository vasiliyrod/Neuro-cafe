import datetime
from typing import Any
from abc import abstractmethod, ABC

from backend.src.infrastructure.database.repositories.base import GenericRepository, GenericCacheRepository
from backend.src.core.domain.order import OrderDTO, OrderStatus


class OrderReposityBase(GenericCacheRepository[OrderDTO], ABC):
    _object = OrderDTO
    
    @abstractmethod
    def count_dishes(self, user_id: int) -> int:
        raise NotImplementedError

    @abstractmethod
    def update_dish_count(self, user_id: int, dish_id: int, delta: int) -> None:
        raise NotImplementedError
    
    @abstractmethod
    def update_status(self, user_id: int, status: OrderStatus) -> None:
        raise NotImplementedError


class OrderRepository(OrderReposityBase):
    async def update_dish_count(self, user_id: int, dish_id: int, new_number: int) -> None:
        pending_order = self._get_or_create_pending_order(user_id=user_id)
        pending_order["dishes"][dish_id] = new_number
        if new_number <= 0:
            del pending_order["dishes"][dish_id]
        self._cache.set(key=user_id, value=self._update_user_pending_order(user_id=user_id, new_pending_order=pending_order))

    async def count_dishes(self, user_id: int) -> int:
        return sum(self._get_or_create_pending_order(user_id=user_id)["dishes"].values())
    
    async def update_status(self, user_id: int, status: OrderStatus) -> OrderDTO:
        order = self._get_pending_order(user_id=user_id)
        order["status"] = status
        order["updated_at"] = datetime.datetime.now()
        self._cache.set(key=user_id, value=self._update_user_pending_order(user_id=user_id, new_pending_order=order))
        return self._object.model_validate(order)

    
    async def list(self, user_id: int) -> OrderDTO:
        return [
            self._object.model_validate(order)
            for order in self._cache.get(user_id)
        ]
    
    def _update_user_pending_order(self, user_id: int, new_pending_order: dict[str | int, Any]) -> None:
        orders_list = [
            order 
            for order in self._cache.get(user_id)
            if order["status"] != OrderStatus.PENDING
        ]
        orders_list.append(new_pending_order)
        return orders_list 
        
    def _get_or_create_pending_order(self, user_id: int) -> dict[str, Any]:
        if not self._cache.exists(user_id):
             return {"status": OrderStatus.PENDING, "updated_at": datetime.datetime.now(), "dishes": {}}
        for order in self._cache.get(user_id):
            if order["status"] == OrderStatus.PENDING:
                return order
        return {"status": OrderStatus.PENDING, "updated_at": datetime.datetime.now(), "dishes": {}}
    
    def _get_pending_order(self, user_id: int) -> dict[str, Any]:
        from backend.src.presentation.api.exceptions import EntityNotFound
        if not self._cache.exists(user_id):
            raise EntityNotFound
        for order in self._cache.get(user_id):
            if order["status"] == OrderStatus.PENDING:
                return order
        raise EntityNotFound
    