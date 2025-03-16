from sqlalchemy.orm import relationship
from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import BOOLEAN, BIGINT, TEXT, INTEGER, FLOAT

from backend.src.infrastructure.database import DeclarativeBase


class ReviewModel(DeclarativeBase):
    __tablename__ = "reviews"

    id = Column(INTEGER(), primary_key=True)
    user_id = Column(INTEGER(), ForeignKey("users.id"))
    overallRating = Column(INTEGER())
    aiRating = Column(INTEGER())
    atmosphereRating = Column(INTEGER())
    staffRating = Column(INTEGER())
    foodRating = Column(INTEGER())
    comment = Column(TEXT())
    recommend = Column(BOOLEAN(), nullable=True)
    
    user = relationship("UserModel", back_populates="reviews")