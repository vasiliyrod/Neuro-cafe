from typing import Any
from abc import abstractmethod, ABC

from backend.src.infrastructure.database.repositories.base import GenericCacheRepository
from backend.src.core.domain.message import MessageDTO


class ChatReposityBase(GenericCacheRepository[MessageDTO], ABC):
    _object = MessageDTO
    
    @abstractmethod
    def write_message(self, user_id: int, message: MessageDTO) -> None:
        raise NotImplementedError
    
    @abstractmethod
    def read_messages(self, user_id: int) -> list[MessageDTO]:
        raise NotImplementedError


class ChatRepository(ChatReposityBase):
    async def write_message(self, user_id: int, message: MessageDTO) -> None:
        rep_message = {
             "is_user": message.isUser,
             "text": message.text,
             "dishes": message.dishes
            }
        
        if not self._cache.exists(user_id):
            self._cache.set(user_id) = list()
            
        all_rep_message = self._cache.get(user_id, rep_message)

        if len(all_rep_message) >= 20:
            all_rep_message.pop(0)

        self._cache.set(user_id, all_rep_message.append(rep_message))


    async def read_messages(self, user_id: int) -> list[MessageDTO]:
        messages = self._cache.get(user_id)
        return [
            MessageDTO(
                isUser=message["is_user"],
                text=message["text"],
                dishes=message["dishes"]
            ) for message in messages
        ]
        
