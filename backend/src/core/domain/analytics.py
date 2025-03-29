from backend.src.core.domain.base import BaseDTO

class AverageRating(BaseDTO):
    overallRating: float
    aiRating: float
    atmosphereRating: float
    staffRating: float
    foodRating: float