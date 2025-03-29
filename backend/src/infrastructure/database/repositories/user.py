import bcrypt
from argon2 import PasswordHasher, exceptions
from abc import abstractmethod, ABC
from sqlalchemy import select
from backend.src.infrastructure.database.repositories.base import GenericRepository, GenericSqlRepository
from backend.src.infrastructure.database.models.user import UserModel
from backend.src.core.domain.user import UserDTO
from backend.src.core.enum.user import UserRole


class UserReposityBase(GenericSqlRepository[UserModel, UserDTO], ABC):
    _model = UserModel
    _object = UserDTO
    
    @abstractmethod
    def validate_credentials(self, username: str, password: str) -> bool:
        raise NotImplementedError
    
    @abstractmethod
    def get_role_by_username(self, username: str) -> UserModel | None:
        raise NotImplementedError

password_hasher = PasswordHasher()

class UserRepository(UserReposityBase):
    
    async def add(self, user: UserDTO) -> UserModel:
        if user.password is not None:
            user.password = self._hash_password(user.password)
        
        return await super().add(user)
    
    async def create_client_if_not_exists(self, telegram_id: int) -> None:
        
        stmt = select(self._model).where(self._model.telegram_id == telegram_id)
        result = await self._session.execute(stmt)
        user = result.scalars().first()
        
        if user is not None:
            return
        return await self.add(UserDTO(telegram_id=telegram_id, role=UserRole.CLIENT))
        
    async def validate_credentials(self, username: str, password: str) -> bool:
        stmt = select(self._model).where(self._model.username == username)
        result = await self._session.execute(stmt)
        user = result.scalars().first()

        if user is None:
            return False
 
        return self._check_password_valid(password=password, hashed_password=user.password)
    
    
    async def get_role_by_username(self, username: str) -> UserRole:
        stmt = select(self._model).where(self._model.username == username)
        result = await self._session.execute(stmt)
        user = result.scalars().first()
        
        if user is None:
            raise RuntimeError

        return UserRole(user.role)

    async def get_by_telegram_id(self, telegram_id: int) -> int:
        stmt = select(self._model).where(self._model.telegram_id == telegram_id)
        result = await self._session.execute(stmt)
        user = result.scalars().first()
        
        if user is None:
            raise RuntimeError

        return user.id
    
    async def get_telegram_id(self, id: int) -> int:
        stmt = select(self._model.telegram_id).where(self._model.id == id)
        result = await self._session.execute(stmt)
        telegram_id = result.scalars().first()
        
        if telegram_id is None:
            raise RuntimeError

        return telegram_id
    
    async def get_avilable_telegram_ids(self) -> set[int]:
        result = await self._session.execute(select(self._model.telegram_id).where(self._model.telegram_id != None))
        return set(result.scalars().all())
    
    def _hash_password(self, plain_password: str) -> str:
        # salt = bcrypt.gensalt()
        # hashed_password = bcrypt.hashpw(plain_password.encode('utf-8'), salt)
        # return hashed_password.decode('utf-8')
        return password_hasher.hash(plain_password)

    def _check_password_valid(self, password: str, hashed_password: str) -> bool:
        try:
            password_hasher.verify(hash=hashed_password, password=password)
            return True
        except exceptions.VerifyMismatchError:
            return False
        # return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))