from backend.src.presentation.api.base.schema import BaseRequest


class MaillistRequest(BaseRequest):
    text: str