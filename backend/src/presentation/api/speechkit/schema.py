from backend.src.presentation.api.base.schema import BaseResponse


class SpeechToTextResponse(BaseResponse):
    transcription: str