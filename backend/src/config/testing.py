from typing import Literal
from pydantic import Field, AmqpDsn, PostgresDsn, RedisDsn
from dataclasses import dataclass

from backend.src.config.base import BaseConfig, Enviroment
from backend.src.config.meta import MetaSettings


class ApplicationConfig(BaseConfig):
    port: int = Field(alias="APP_PORT")
    host: str = Field(alias="APP_HOST")
    path_prefix: str = Field(alias="PATH_PREFIX")

    secret_key: str = Field(alias="ACCESS_TOKEN_SECRET_KEY")
    algorithm: str = Field(alias="ACCESS_TOKEN_ALGORITHM")
    access_token_expire_minutes: int = Field(alias="ACCESS_TOKEN_EXPIRE_MINUTES")

    internal_admin_username: str = Field(alias="INTERNAL_ADMIN_USERNAME")
    internal_admin_password: str = Field(alias="INTERNAL_ADMIN_PASSWORD")
    
    reload: bool = Field(alias="RELOAD_APP")


class DatabaseConfig(BaseConfig):
    user: str = Field(alias="DATABASE_USERNAME")
    name: str = Field(alias="DATABASE_NAME")
    password: str = Field(alias="DATABASE_PASSWORD")
    port: int = Field(alias="DATABASE_PORT")
    host: str = Field(alias="DATABASE_HOST")
    
    @property
    def dsn(self) -> PostgresDsn:
        return str(
            PostgresDsn.build(
                scheme="postgresql+asyncpg",
                username=self.user,
                host=self.host,
                port=self.port,
                path=self.name,
                password=self.password,
            )
        )
    

class RabbitConfig(BaseConfig):
    user: str = Field(alias="RABBITMQ_USER")
    password: str = Field(alias="RABBITMQ_PASSWORD")
    host: str = Field(alias="RABBITMQ_HOST")
    port: int = Field(alias="RABBITMQ_PORT")
    path: int | None = Field(None, alias="RABBITMQ_PATH")

    @property
    def dsn(self) -> AmqpDsn:
        return str(
            AmqpDsn.build(
                scheme="amqp",
                username=self.user,
                password=self.password,
                host=self.host,
                port=self.port,
                path=self.path
            )
        )


class RedisConfig(BaseConfig):
    host: str = Field(alias="REDIS_HOST")
    port: int = Field(alias="REDIS_PORT")
    password: str = Field(alias="REDIS_PASSWORD")
    
    @property
    def dsn(self) -> PostgresDsn:
        return str(
            RedisDsn.build(
                scheme="redis",
                host=self.host,
                port=self.port,
                password=self.password,
            )
        )


class LoggingConfig(BaseConfig):
    group_id: str = Field(alias="LOGGING_GROUP_ID")
    token: str = Field(alias="LOGGING_TOKEN")
    level: str = Field(alias="LOGGING_LEVEL")


class BotConfig(BaseConfig):
    api_token: str = Field(alias="BOT_API_TOKEN")


class AiConfig(BaseConfig):
    api_token: str = Field(alias="GROQ_API_TOKEN")


class DevelopmentConfig:
    app = ApplicationConfig()
    database = DatabaseConfig()
    rabbitmq = RabbitConfig()
    redis = RedisConfig()
    logging = LoggingConfig()
    bot = BotConfig()
    ai = AiConfig()
    
    meta = MetaSettings()
    env: Literal[Enviroment.TEST] = Enviroment.TEST