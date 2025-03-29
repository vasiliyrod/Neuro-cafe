from fastapi import APIRouter, Depends, Request
from starlette import status
from backend.src.presentation.api.auth.utils import protect
from backend.src.presentation.api.auth.enums import AccessLevel
from backend.src.presentation.api.chat.schema import (
    AddMessageResponse,
    HistoryChatResponse,
    AddMessageRequest
)
from backend.src.presentation.api.dish.schema import DishResponse
from backend.src.core.domain.message import MessageDTO
from backend.src.infrastructure.database.unit_of_work import UnitOfWork, get_unit_of_work
from backend.src.presentation.api.context import context

chat_router = APIRouter(prefix="/chat", tags=["chat"])

@chat_router.post(
    path="",
    status_code=status.HTTP_200_OK,
    summary="Add message",
    response_model=AddMessageResponse
)
@protect(min_access_level=AccessLevel.Client, uid_required=False)
async def add_message(
    request: Request,
    message_data: AddMessageRequest,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> AddMessageResponse:
    assistant_answer = await context.ai_assistant.get_answer(request=message_data.message, user_id=request.state.user_id)
    if request.state.user_id is not None:
        await uow.chat.write_message(
            user_id=request.state.user_id,
            message=MessageDTO(
                isUser=1,
                text=message_data.message,
            )
        )
        await uow.chat.write_message(
            user_id=request.state.user_id,
            message=assistant_answer
        )
    return AddMessageResponse(
        dishes=[
            DishResponse(**(await uow.dish.get_by_id(id=dish_id)).model_dump())
            for dish_id in assistant_answer.dishes
        ],
        message=assistant_answer.text,
    )
    

@chat_router.get(
    path="",
    status_code=status.HTTP_200_OK,
    summary="Chat history message",
    response_model=list[HistoryChatResponse]
)
@protect(min_access_level=AccessLevel.Client, uid_required=False)
async def list_message_history(
    request: Request,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> list[HistoryChatResponse]:
    if request.state.user_id is None:
        return []
    messages = await uow.chat.read_messages(user_id=request.state.user_id)
    return [
        HistoryChatResponse(
            isUser=message.isUser,
            text=message.text,
            dishes=[
                DishResponse(**(await uow.dish.get_by_id(id=dish_id)).model_dump())
                for dish_id in message.dishes
            ],
        ) for message in messages
    ]