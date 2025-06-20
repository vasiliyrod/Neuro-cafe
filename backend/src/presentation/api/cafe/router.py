from statistics import mean
from fastapi import APIRouter
from starlette import status
from fastapi import APIRouter, Request
from starlette import status
from backend.src.presentation.api.auth.utils import protect
from backend.src.presentation.api.auth.enums import AccessLevel
from backend.src.presentation.api.cafe.schema import (
    CafeResponse,
    StaffResponse,
    InteriorResponse,
)
from backend.src.config import settings


cafe_router = APIRouter(prefix="/cafe", tags=["cafe"])


@cafe_router.get(
    path="",
    status_code=status.HTTP_200_OK,
    summary="Cafe Meta Information",
    response_model=CafeResponse,
)
@protect(min_access_level=AccessLevel.Client)
async def get_cafe_meta(request: Request) -> CafeResponse:  
    cafe = settings.meta.cafe
    return CafeResponse(
        name=cafe.name,
        tg_link=cafe.tg_link,
        email=cafe.email,
        phone=cafe.phone,
        longitude=cafe.longitude,
        latitude=cafe.latitude,
        address=cafe.address,
        desc=cafe.desc,
    )


@cafe_router.get(
    path="/staff",
    status_code=status.HTTP_200_OK,
    summary="Meta Information About Staff",
    response_model=list[StaffResponse],
)
@protect(min_access_level=AccessLevel.Client)
async def get_staff_list_meta(request: Request) -> list[StaffResponse]:  
    return [
        StaffResponse(
            id=staff.id,
            name=staff.name,
            status=staff.status,
            experience_years=staff.experience_years,
            achievements=staff.achievements,
            photo_link=staff.photo_link,
        )
        for staff in settings.meta.staff
    ]

@cafe_router.get(
    path="/interior",
    status_code=status.HTTP_200_OK,
    summary="Meta Information About Staff",
    response_model=list[InteriorResponse],
)
@protect(min_access_level=AccessLevel.Client)
async def get_staff_list_meta(request: Request) -> list[InteriorResponse]:  
    return [
        InteriorResponse(
            id=interior.id,
            img_link=interior.img_link,
        )
        for interior in settings.meta.interior
    ]