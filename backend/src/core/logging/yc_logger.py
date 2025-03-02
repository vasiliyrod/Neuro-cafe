# https://github.com/mcode-cc/python-yandex-cloud-logging
# pip install python-yandex-cloud-logging
from backend.src.config import settings
from pyclm.logging import Logger

_logger = Logger(
    log_group_id=settings.logging.group_id,
    credentials={"token": settings.logging.token},
    period=0,
)

def get_yc_logger() -> type[Logger]:
    return _logger