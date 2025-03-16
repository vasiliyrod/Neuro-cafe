from abc import ABC
from backend.src.infrastructure.database.repositories.base import GenericRepository, GenericSqlRepository
from backend.src.infrastructure.database.models.review import ReviewModel
from backend.src.core.domain.review import ReviewDTO


class ReviewReposityBase(GenericSqlRepository[ReviewModel, ReviewDTO], ABC):
    _model = ReviewModel
    _object = ReviewDTO



class  ReviewReposity(ReviewReposityBase):
    pass
    
