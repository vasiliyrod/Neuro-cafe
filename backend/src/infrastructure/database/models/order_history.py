import datetime
from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import TEXT, INTEGER, JSONB, FLOAT

from backend.src.infrastructure.database import DeclarativeBase


class OrderHistoryModel(DeclarativeBase):
    __tablename__ = "orders_history"

    id = Column(INTEGER(), primary_key=True)
    user_id = Column(INTEGER(), ForeignKey("users.id"))
    table_id = Column(INTEGER())
    dishes = Column(JSONB())
    created_at = Column(DateTime())
    completed_at = Column(DateTime(), default=datetime.datetime.now)
    status = Column(TEXT())
    cost = Column(FLOAT())
    user = relationship("UserModel", back_populates="order_history")