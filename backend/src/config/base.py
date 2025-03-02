from pydantic import Field
from pydantic_settings import BaseSettings
from enum import StrEnum
from pydantic_core import core_schema

class BaseConfig(BaseSettings):
    env: str = Field(alias="ENV")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"
        
        
class Enviroment(StrEnum):
    PROD = "prod"
    TEST = "test"