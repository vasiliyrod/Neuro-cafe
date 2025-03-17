import datetime
from typing import Any
from abc import abstractmethod, ABC

from backend.src.infrastructure.database.repositories.base import GenericRepository, GenericCacheRepository
from backend.src.core.domain.order import OrderDTO, OrderStatus
from backend.src.utils.identifier import get_uuid

class OrderReposityBase(GenericCacheRepository[OrderDTO], ABC):
    _object = OrderDTO
    
    @abstractmethod
    def count_dishes(self, user_id: int) -> int:
        raise NotImplementedError

    @abstractmethod
    def update_dish_count(self, user_id: int, dish_id: int, delta: int) -> None:
        raise NotImplementedError

class OrderRepository(OrderReposityBase):
    async def get_by_status(self, user_id: int, status: OrderStatus) -> None:
        return [
            self._object.model_validate(order)
            for order in self._cache.get(user_id)
            if order["status"] == status
        ]
        
    async def update_dish_count(self, user_id: int, dish_id: int, new_number: int) -> None:
        pending_order = self._get_or_create_pending_order(user_id=user_id)
        pending_order["dishes"][dish_id] = new_number
        if new_number <= 0:
            del pending_order["dishes"][dish_id]
        self._cache.set(
            key=user_id, 
            value=self._update_user_pending_order(user_id=user_id, new_pending_order=pending_order, status=OrderStatus.PENDING)
        )

    async def count_dishes(self, user_id: int) -> int:
        return sum(self._get_or_create_pending_order(user_id=user_id)["dishes"].values())
    
    async def set_in_progress(self, user_id: int) -> OrderDTO:
        order = self._get_pending_order(user_id=user_id)
        order["updated_at"] = datetime.datetime.now()
        self._cache.set(
            key=user_id,
            value=self._update_user_pending_order(user_id=user_id, new_pending_order=order, status=OrderStatus.IN_PROGRESS)
        )
        return self._object.model_validate(order)
    
    async def remove(self, user_id: int, order_id: str) -> None:
        from backend.src.presentation.api.exceptions import EntityNotFound
        removed_order = None
        for order in self._cache.get(key=user_id):
            if order.get("id") == order_id:
                removed_order = self._object.model_validate(order)
        if not removed_order:
            raise EntityNotFound
        return removed_order

    async def list(self, user_id: int) -> OrderDTO:
        return [
            self._object.model_validate(order)
            for order in self._cache.get(user_id)
        ]
    
    def _update_user_pending_order(self, user_id: int, new_pending_order: dict[str | int, Any], status: OrderStatus) -> list:
        orders_list = [
            order 
            for order in self._cache.get(user_id)
            if order["status"] != OrderStatus.PENDING
        ]
        new_pending_order["status"] = status
        orders_list.append(new_pending_order)
        return orders_list 
        
    def _get_or_create_pending_order(self, user_id: int) -> dict[str, Any]:
        if not self._cache.exists(user_id):
             return {"status": OrderStatus.PENDING, "updated_at": datetime.datetime.now(), "dishes": {}, "id": str(get_uuid())}
        for order in self._cache.get(user_id):
            if order["status"] == OrderStatus.PENDING:
                return order
        return {"status": OrderStatus.PENDING, "updated_at": datetime.datetime.now(), "dishes": {}, "id": str(get_uuid())}
    
    def _get_pending_order(self, user_id: int) -> dict[str, Any]:
        from backend.src.presentation.api.exceptions import EntityNotFound
        if not self._cache.exists(user_id):
            raise EntityNotFound
        for order in self._cache.get(user_id):
            if order["status"] == OrderStatus.PENDING:
                return order
        raise EntityNotFound
    