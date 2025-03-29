from abc import ABC
from sqlalchemy import select, func
from backend.src.infrastructure.database.repositories.base import GenericRepository, GenericSqlRepository
from backend.src.infrastructure.database.models.review import ReviewModel
from backend.src.core.domain.review import ReviewDTO
from backend.src.core.domain.analytics import AverageRating


class ReviewReposityBase(GenericSqlRepository[ReviewModel, ReviewDTO], ABC):
    _model = ReviewModel
    _object = ReviewDTO



class  ReviewReposity(ReviewReposityBase):
    
    async def get_average_rating(self):
        query = (
            select(
                func.avg(self._model.overallRating).label("avg_overall"),
                func.avg(self._model.aiRating).label("avg_ai"),
                func.avg(self._model.atmosphereRating).label("avg_atmosphere"),
                func.avg(self._model.staffRating).label("avg_staff"),
                func.avg(self._model.foodRating).label("avg_food"),
            )
        )
        
        result = (await self._session.execute(query)).one()
        return AverageRating(
            overallRating=result.avg_overall,
            aiRating=result.avg_ai,
            atmosphereRating=result.avg_atmosphere,
            staffRating=result.avg_staff,
            foodRating=result.avg_food,
        )