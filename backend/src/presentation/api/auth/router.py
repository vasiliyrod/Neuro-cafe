from fastapi import APIRouter
from backend.src.presentation.api.auth.utils import protect, create_access_token
from backend.src.presentation.api.auth.enums import AccessLevel
from backend.src.presentation.api.auth.schema import TokenRequest, TokenResponse
from starlette import status

auth_router = APIRouter(prefix="/auth", tags=["token"])

@auth_router.post(
    path="/token",
    status_code=status.HTTP_201_CREATED,
    summary="Generate Access Token",
    response_model=TokenResponse,
)
@protect(AccessLevel.NoAuth)
async def generate_access_token(request: TokenRequest):
    return create_access_token(
        data={"username": request.username, "password": request.password},
        expires_delta=request.ttl
    )