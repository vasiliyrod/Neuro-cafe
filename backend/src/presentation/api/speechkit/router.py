from statistics import mean
from fastapi import APIRouter, File, UploadFile
from starlette import status
from fastapi import APIRouter, Depends, Request
from starlette import status
from backend.src.presentation.api.auth.utils import protect
from backend.src.presentation.api.auth.enums import AccessLevel

from backend.src.presentation.api.context import context
from backend.src.presentation.api.exceptions import UnableToLoadFile
from backend.src.presentation.api.speechkit.schema import SpeechToTextResponse

speechkit_router = APIRouter(prefix="", tags=["speechkit"])


@speechkit_router.post(
    path="/speech_to_text",
    status_code=status.HTTP_200_OK,
    summary="Convert Speech To Text",
)
@protect(min_access_level=AccessLevel.Client, uid_required=False)
async def speech_to_text(
    request: Request,
    file: UploadFile = File(...),
) -> SpeechToTextResponse:
    
    try:
        audio_data = await file.read()
    except Exception as e:
        raise UnableToLoadFile

    return await context.speechkit.conver_speech_to_text(audio_data)
