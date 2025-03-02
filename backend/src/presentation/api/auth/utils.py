import jwt
from fastapi import Request
from backend.src.config import settings
from functools import wraps
from backend.src.presentation.api.exceptions import (
    TokenExpired, 
    InvalidToken, 
    InsufficientAccessLevel,
    InvalidCredentials,
)
import datetime
from backend.src.presentation.api.auth.enums import AccessLevel, _access_level_by_role
from backend.src.infrastructure.database.unit_of_work import get_unit_of_work

def decode_access_token(token: str):
    try:
        payload = jwt.decode(
            token, 
            settings.app.secret_key, 
            algorithms=[settings.app.algorithm]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise TokenExpired
    except jwt.InvalidTokenError:
        return InvalidToken

def create_access_token(data: dict, expires_delta: datetime.timedelta | None = None):
    to_encode = data.copy()
    delta = expires_delta or datetime.timedelta(minutes=settings.app.access_token_expire_minutes)
    expire = datetime.datetime.now(datetime.timezone.utc) + delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.app.secret_key, 
        algorithm=settings.app.algorithm
    )
    return {"access_token": encoded_jwt, "token_type": "bearer"}

async def define_access_level(payload: dict[str, str]) -> AccessLevel:
    async for uow in get_unit_of_work():
        username = payload.pop("username", None)
        password = payload.pop("password", None)

        if username is None or password is None or not await uow.user.validate_credentials(
            username=username,
            password=password
        ):
            raise InvalidCredentials
        role = await uow.user.get_role_by_username(username=username)
        return _access_level_by_role[role]

def protect(min_access_level: AccessLevel):
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            if min_access_level is AccessLevel.NoAuth:
                return await func(request, *args, **kwargs)
            
            payload = decode_access_token(token=getattr(request.state, 'token', None))
            
            access_level = await define_access_level(payload=payload)

            if access_level < min_access_level:
                raise InsufficientAccessLevel

            return await func(request, *args, **kwargs)

        return wrapper

    return decorator

