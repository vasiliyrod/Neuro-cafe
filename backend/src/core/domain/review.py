from statistics import mean
from backend.src.core.domain.base import BaseDTO


class ReviewDTO(BaseDTO):
    user_id: int
    overallRating: int
    aiRating: int
    atmosphereRating: int
    staffRating: int
    foodRating: int
    comment: str
    recommend: bool | None
    
    @property
    def averageRating(self) -> float:
        return round(
            mean([
                self.overallRating,
                self.aiRating,
                self.atmosphereRating,
                self.staffRating,
                self.foodRating,
            ]), 1
        )