from statistics import mean
from fastapi import APIRouter
from starlette import status
from fastapi import APIRouter, Depends, Request
from starlette import status
from backend.src.presentation.api.auth.utils import protect, create_access_token
from backend.src.presentation.api.auth.enums import AccessLevel
from backend.src.presentation.api.review.schema import (
    AddReviewRequest,
    ReviewResponse
)
from backend.src.core.domain.review import ReviewDTO
from backend.src.infrastructure.database.unit_of_work import UnitOfWork, get_unit_of_work
from backend.src.presentation.api.exceptions import EntityNotFound


review_router = APIRouter(prefix="/reviews", tags=["review"])


@review_router.post(
    path="",
    status_code=status.HTTP_201_CREATED,
    summary="Add Review",
)
@protect(min_access_level=AccessLevel.Client)
async def add_review(
    request: Request,
    review_data: AddReviewRequest,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> None:
    await uow.review.add(
        ReviewDTO(
            user_id=request.state.user_id,
            **review_data.model_dump(),
        )
    )


@review_router.get(
    path="",
    status_code=status.HTTP_200_OK,
    summary="List Reviews",
    response_model=list[ReviewResponse],
)
@protect(min_access_level=AccessLevel.Client, uid_required=False)
async def get_reviews(
    request: Request,
    uow: UnitOfWork = Depends(get_unit_of_work)
) -> list[ReviewResponse]:  
    reviews: list[ReviewDTO] = await uow.review.list()
    return [
        ReviewResponse(
            id=review.id,
            averageRating=review.averageRating,
            comment=review.comment,
        )
        for review in reviews
        if review.comment
    ]