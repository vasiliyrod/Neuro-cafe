import logging
from backend.src.core.logging.yc_logger import get_yc_logger
from backend.src.core.logging.console_logger import get_console_logger


def setup_logging() -> None:
    root_logger = logging.getLogger()
    
    # yc_logger = get_yc_logger()
    # root_logger.addHandler(yc_logger)
    
    console_logger = get_console_logger()
    root_logger.addHandler(console_logger)
