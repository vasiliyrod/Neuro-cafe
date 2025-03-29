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
    
    def __init__(self, prefix: str = "order") -> None:
        super().__init__(prefix)
        
    async def get_by_status(self, user_id: int, status: OrderStatus) -> None:
        return [
            self._object.model_validate(order)
            for order in self._cache.get(user_id)
            if order["status"] == status
        ]
    
    async def get_all_by_status(self, status: OrderStatus) -> None:
        return [
            self._object(**order, user_id=user_id)
            for user_id, user_order in self._cache.get().items()
            for order in user_order
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
    
    async def set_in_progress(self, user_id: int, table_id: int) -> OrderDTO:
        order = self._get_pending_order(user_id=user_id)
        order["updated_at"] = datetime.datetime.now()
        order["table_id"] = table_id
        self._cache.set(
            key=user_id,
            value=self._update_user_pending_order(user_id=user_id, new_pending_order=order, status=OrderStatus.IN_PROGRESS)
        )
        return self._object.model_validate(order)
    
    async def remove(self, user_id: int, order_id: str) -> None:
        from backend.src.presentation.api.exceptions import EntityNotFound
        removed_order = None
        new_orders = []
        for order in self._cache.get(key=user_id):
            if order.get("id") == order_id:
                removed_order = self._object.model_validate(order)
            else:
                new_orders.append(order)
        self._cache.set(key=user_id, value=new_orders)  
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
    
    def retrieve_pending_order(self, user_id: int) -> dict[str, Any]:
        cart = self._get_or_create_pending_order(user_id=user_id)
        if not cart.get("dishes"):
            return """
            Корзина пользователя на данный момент пуста
        """
        return self._format_order_str(cart)

async def retrieve_pending_order(user_id: int | None) -> str:
    from backend.src.infrastructure.database.unit_of_work import get_unit_of_work
    if user_id is None:
        return """
        Пользователь не зарегистрировался - у него нет корзины
    """
    async for uow in get_unit_of_work():
        cart = uow.order._get_or_create_pending_order(user_id=user_id)
        if not cart.get("dishes"):
            return """
            Корзина пользователя на данный момент пуста
        """
        st = "Корзина пользователя на данный момент состоит из блюд\n"
        st += "Название блюда, цена, количество, граммовка, кухня, ингридиенты\n"
        for dish_id, dish_count in cart["dishes"].items():
            dish_obj = await uow.dish.get_by_id(dish_id)
            st += f"{dish_obj.name}, {dish_obj.cost}, {dish_count}, {dish_obj.weight}, {dish_obj.cuisine}, {dish_obj.main_ingredients}\n"
        return st

async def retrieve_ordered_orders_for_today(user_id: int) -> str:
    pass