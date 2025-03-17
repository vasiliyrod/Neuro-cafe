from backend.src.presentation.api.base.schema import BaseRequest, BaseResponse


class AddReviewRequest(BaseRequest):
    overallRating: int
    aiRating: int
    atmosphereRating: int
    staffRating: int
    foodRating: int
    comment: str
    recommend: bool | None = None


class ReviewResponse(BaseResponse):
    id: int
    averageRating: float
    comment: str