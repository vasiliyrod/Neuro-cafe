from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import TEXT, INTEGER

from backend.src.infrastructure.database import DeclarativeBase


class UserModel(DeclarativeBase):
    __tablename__ = "users"

    id = Column(INTEGER(), primary_key=True)
    username = Column(TEXT())
    password = Column(TEXT())
    role = Column(TEXT())