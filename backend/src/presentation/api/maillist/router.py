from fastapi import APIRouter, File, UploadFile, Request, Depends, Form
from starlette import status
from backend.src.presentation.api.auth.utils import protect
from backend.src.presentation.api.auth.enums import AccessLevel
from backend.src.presentation.api.maillist.schema import MaillistRequest
from backend.src.presentation.api.exceptions import UnableToLoadFile
from backend.src.presentation.api.context import context
from backend.src.infrastructure.database.unit_of_work import UnitOfWork, get_unit_of_work
from backend.src.presentation.telegram.utils import start_mailing


maillist_router = APIRouter(prefix="/maillist", tags=["maillist"])


@maillist_router.post(
    path="",
    status_code=status.HTTP_201_CREATED,
    summary="Start Maillist",
)
@protect(min_access_level=AccessLevel.Admin)
async def run_mailing(
    request: Request,
    text: str,
    file: UploadFile = File(...),
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> None:
    try:
        media_data = await file.read()
    except Exception as e:
        raise UnableToLoadFile

    media_url = context.s3.upload(data=media_data)

    users_telegram_ids = await uow.user.get_avilable_telegram_ids()
    
    await start_mailing(
        text=text,
        telegram_ids=users_telegram_ids,
        image_url=media_url,
    )
