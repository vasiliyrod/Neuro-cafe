from typing import Literal
from pydantic import Field, AmqpDsn, PostgresDsn, RedisDsn
from backend.src.config.base import BaseConfig, Enviroment


class ApplicationConfig(BaseConfig):
    port: str = Field(alias="APP_PORT")
    host: str = Field(alias="APP_HOST")
    path_prefix: str = Field(alias="PATH_PREFIX")
    

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
                path=self.name,
                password=self.password,
                port=self.port,
                host=self.host,
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
    port: str = Field(alias="REDIS_PORT")
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


class ProductionConfig:
    app = ApplicationConfig()
    database = DatabaseConfig()
    rabbitmq = RabbitConfig()
    redis = RedisConfig()
    env: Enviroment = Literal[Enviroment.PROD]