from backend.src.presentation.api.base.schema import BaseRequest, BaseResponse


class TokenRequest(BaseRequest):
    username: str
    password: str
    ttl: int | None = None


class TokenResponse(BaseResponse):
    access_token: str
    token_type: str