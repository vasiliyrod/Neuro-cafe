from fastapi import APIRouter, File, UploadFile, Request
from starlette import status
from backend.src.presentation.api.auth.utils import protect
from backend.src.presentation.api.auth.enums import AccessLevel
from backend.src.presentation.api.exceptions import UnableToLoadFile
from backend.src.presentation.api.context import context

base_router = APIRouter(prefix="", tags=["base"])


@base_router.post(
    path="/upload_image",
    status_code=status.HTTP_201_CREATED,
    summary="Upload Image",
)
@protect(min_access_level=AccessLevel.Admin)
async def upload_image(
    request: Request,
    file: UploadFile = File(...)
) -> str:
    try:
        data = await file.read()
    except Exception as e:
        raise UnableToLoadFile
    return context.s3.upload(data=data)
