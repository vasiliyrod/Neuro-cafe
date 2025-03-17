from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import TEXT, INTEGER, BIGINT
from sqlalchemy.orm import relationship
from backend.src.infrastructure.database import DeclarativeBase


class UserModel(DeclarativeBase):
    __tablename__ = "users"

    id = Column(INTEGER(), primary_key=True)
    telegram_id = Column(BIGINT(), nullable=True)
    username = Column(TEXT(), nullable=True)
    password = Column(TEXT(), nullable=True)
    role = Column(TEXT())
        
    order_history = relationship("OrderHistoryModel", back_populates="user")
    reviews = relationship("ReviewModel", back_populates="user")