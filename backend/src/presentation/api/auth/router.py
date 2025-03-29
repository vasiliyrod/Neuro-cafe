from fastapi import APIRouter, Request, Depends
from backend.src.presentation.api.auth.utils import protect, create_access_token
from backend.src.presentation.api.auth.enums import AccessLevel
from backend.src.presentation.api.auth.schema import TokenRequest, TokenResponse
from backend.src.infrastructure.database.unit_of_work import UnitOfWork, get_unit_of_work
from starlette import status
from backend.src.presentation.api.exceptions import InvalidCredentials


auth_router = APIRouter(prefix="/auth", tags=["token"])


@auth_router.post(
    path="/token",
    status_code=status.HTTP_201_CREATED,
    summary="Generate Access Token",
    response_model=TokenResponse,
)
async def generate_access_token(
    request: Request,
    token_data: TokenRequest,
    uow: UnitOfWork = Depends(get_unit_of_work),
):
    credentials_valid = await uow.user.validate_credentials(username=token_data.username, password=token_data.password)
    if not credentials_valid:
        raise InvalidCredentials
    return create_access_token(
        data={"username": token_data.username, "password": token_data.password},
    )