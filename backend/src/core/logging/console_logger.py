import logging

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
_logger = logging.StreamHandler()
_logger.setLevel(logging.INFO)
_logger.setFormatter(formatter)

def get_console_logger() -> type[logging.StreamHandler]:
    return _logger