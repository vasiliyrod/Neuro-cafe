import os

from dotenv import load_dotenv
from backend.src.config.base import Enviroment
from backend.src.config.testing import DevelopmentConfig
from backend.src.config.production import ProductionConfig

load_dotenv()

Config = DevelopmentConfig | ProductionConfig

class UnknownEnviroment(Exception):
    pass

def get_settings() -> Config:
    env = os.getenv("ENV")
    if env == Enviroment.PROD:
        return ProductionConfig()
    if env == Enviroment.TEST:
        return DevelopmentConfig()
    raise UnknownEnviroment


settings = get_settings()