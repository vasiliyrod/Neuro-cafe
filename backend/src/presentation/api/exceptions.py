from starlette import status
from fastapi import HTTPException


class ApiError(HTTPException):
    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    detail: str = "Unexpected Error Occured"
    def __init__(self, status_code: int | None = None, detail: str | None = None):
        super().__init__(status_code=status_code or self.status_code, detail=detail or self.detail)


class InvalidToken(ApiError):
    status_code = status.HTTP_401_UNAUTHORIZED
    detail = "Invalid auth token provided"


class TokenExpired(ApiError):
    status = status.HTTP_401_UNAUTHORIZED
    detail = "Auth token expired"


class InsufficientAccessLevel(ApiError):
    status_code = status.HTTP_403_FORBIDDEN
    detail = "Insufficient access level to perform this action"


class InvalidCredentials(ApiError):
    status_code = status.HTTP_401_UNAUTHORIZED
    detail = "Invalid username or password"


class AtLeastOneFieldRequired(ApiError):
    status_code = status.HTTP_400_BAD_REQUEST
    detail = "At least one update field must be provided"


class EntityNotFound(ApiError):
    status_code = status.HTTP_404_NOT_FOUND
    detail = "Entity with such id not found"


class UserIdRequired(ApiError):
    status_code = status.HTTP_403_FORBIDDEN
    detail = "User Id Required"


class UnableToLoadFile(ApiError):
    status_code = status.HTTP_400_BAD_REQUEST
    detail = "Unable to load file"