import bcrypt
from abc import abstractmethod, ABC
from sqlalchemy import select
from backend.src.infrastructure.database.repositories.base import GenericRepository, GenericSqlRepository
from backend.src.infrastructure.database.models.user import UserModel
from backend.src.core.domain.user import UserDTO
from backend.src.core.enum.user import UserRole


class UserReposityBase(GenericRepository[UserModel, UserDTO], ABC):
    _model = UserModel
    _object = UserDTO
    
    @abstractmethod
    def validate_credentials(self, username: str, password: str) -> bool:
        raise NotImplementedError
    
    @abstractmethod
    def get_role_by_username(self, username: str) -> UserModel | None:
        raise NotImplementedError


class UserRepository(GenericSqlRepository[UserModel, UserDTO], UserReposityBase):
    
    async def add(self, user: UserModel) -> UserModel:
        user.password = self._hash_password(user.password)
        return await super().add(user)
    
    async def validate_credentials(self, username: str, password: str) -> bool:
        stmt = select(self._model).where(self._model.username == username)
        result = await self._session.execute(stmt)
        user = result.scalars().first()
        
        if user is None:
            return False

        return bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8'))
    
    async def get_role_by_username(self, username: str) -> UserRole:
        stmt = select(self._model).where(self._model.username == username)
        result = await self._session.execute(stmt)
        user = result.scalars().first()
        
        if user is None:
            raise RuntimeError

        return UserRole(user.role)
    
    def _hash_password(self, plain_password: str) -> str:
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(plain_password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')
