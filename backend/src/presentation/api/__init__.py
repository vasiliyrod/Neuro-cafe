from backend.src.presentation.api.auth.router import auth_router
from backend.src.presentation.api.cafe.router import cafe_router
from backend.src.presentation.api.dish.router import dish_router
from backend.src.presentation.api.order.router import order_router
from backend.src.presentation.api.review.router import review_router
from backend.src.presentation.api.user.router import user_router
from backend.src.presentation.api.speechkit.router import speechkit_router
from backend.src.presentation.api.chat.router import chat_router
from backend.src.presentation.api.base.router import base_router
from backend.src.presentation.api.maillist.router import maillist_router
from backend.src.presentation.api.analytics.router import analytics_router

list_of_routes = [
    auth_router,
    cafe_router,
    dish_router,
    order_router,
    review_router,
    user_router,
    speechkit_router,
    chat_router,
    base_router,
    maillist_router,
    analytics_router,
]