from yaml_settings_pydantic import BaseYamlSettings, YamlSettingsConfigDict
from typing import List
from pydantic import BaseModel
from backend.src.utils.path import build_absolute_path
from pathlib import Path


class Staff(BaseModel):
    id: int
    name: str
    status: str
    experience_years: int
    achievements: str
    photo_link: str


class Cafe(BaseModel):
    name: str
    tg_link: str
    email: str
    phone: str
    longitude: float
    latitude: float
    address: str
    desc: str


class Interior(BaseModel):
    id: int
    img_link: str


class MetaSettings(BaseYamlSettings):
    model_config = YamlSettingsConfigDict(
        yaml_files=build_absolute_path(Path("backend") / "src" / "config" / "meta.yaml")
    )
    
    cafe: Cafe
    staff: list[Staff]
    interior: list[Interior]