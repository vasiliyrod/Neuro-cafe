from backend.src.presentation.api.auth.router import auth_router
from backend.src.presentation.api.cafe.router import cafe_router
from backend.src.presentation.api.dish.router import dish_router
from backend.src.presentation.api.order.router import order_router
from backend.src.presentation.api.review.router import review_router
from backend.src.presentation.api.user.router import user_router

list_of_routes = [
    auth_router,
    cafe_router,
    dish_router,
    order_router,
    review_router,
    user_router,
]