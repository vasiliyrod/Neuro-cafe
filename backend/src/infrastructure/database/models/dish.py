from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import BOOLEAN, BIGINT, TEXT, INTEGER, FLOAT

from backend.src.infrastructure.database import DeclarativeBase


class DishModel(DeclarativeBase):
    __tablename__ = "dishes"

    id = Column(INTEGER(), primary_key=True)
    name = Column(TEXT())
    type = Column(TEXT())
    description = Column(TEXT())
    all_ingredients = Column(TEXT())
    main_ingredients = Column(TEXT())
    img_link = Column(TEXT())
    cost = Column(FLOAT())
    weight = Column(FLOAT()) 
    cuisine = Column(TEXT())
    