from fastapi import APIRouter, Depends, Request
from starlette import status
from backend.src.presentation.api.auth.utils import protect
from backend.src.presentation.api.auth.enums import AccessLevel
from backend.src.presentation.api.chat.schema import (
    AddMessageResponse,
    HistoryChatResponse,
    AddMessageRequest
)
from backend.src.infrastructure.database.unit_of_work import UnitOfWork, get_unit_of_work


chat_router = APIRouter(prefix="/chat", tags=["chat"])

@chat_router.post(
    path="",
    status_code=status.HTTP_200_OK,
    summary="Add message",
    response_model=AddMessageResponse
)
@protect(min_access_level=AccessLevel.Client)
async def add_message(
    request: Request,
    message_data: AddMessageRequest,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> AddMessageResponse:
    await uow.chat.write_message(user_id=request.state.user_id)  
    

@chat_router.get(
    path="",
    status_code=status.HTTP_200_OK,
    summary="Chat history message",
    response_model=list[HistoryChatResponse]
)
@protect(min_access_level=AccessLevel.Client)
async def list_message_history(
    request: Request,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> list[HistoryChatResponse]:
    messages = await uow.chat.read_messages(user_id=request.state.user_id)
    return [
        HistoryChatResponse(
            isUser=message.isUser,
            text=message.text,
            dishes=message.dishes
        ) for message in messages
    ]
