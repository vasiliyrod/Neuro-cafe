from backend.src.presentation.api.base.schema import BaseResponse


class StaffResponse(BaseResponse):
    id: int
    name: str
    status: str
    experience_years: int
    achievements: str
    photo_link: str


class CafeResponse(BaseResponse):
    name: str
    tg_link: str
    email: str
    phone: str
    longitude: float
    latitude: float
    address: str
    desc: str


class InteriorResponse(BaseResponse):
    id: int
    img_link: str