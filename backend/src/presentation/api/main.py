from uvicorn import run
from fastapi import FastAPI
from fastapi_pagination import add_pagination
from backend.src.config import Config, settings
from backend.src.presentation.api.utils import get_hostname
from backend.src.presentation.api import list_of_routes
from backend.src.presentation.api.middleware import AuthMiddleware
from fastapi.middleware.cors import CORSMiddleware

def bind_routes(application: FastAPI, setting: Config) -> None:
    for route in list_of_routes:
        application.include_router(route, prefix=setting.app.path_prefix)


def get_app() -> FastAPI:
    description = "API Нейро-Кафе"

    tags_metadata = [
        {
            "name": "Neuro Cafe",
            "description": "API Neuro Cafe",
        },
    ]

    application = FastAPI(
        title="NeuroCafe",
        description=description,
        docs_url="/swagger",
        openapi_url="/openapi",
        version="0.1.0",
        openapi_tags=tags_metadata,
    )
    bind_routes(application, settings)
    add_pagination(application)
    application.state.settings = settings
    application.add_middleware(AuthMiddleware)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],  # Разрешенные origins
        allow_credentials=True,  # Разрешить куки и заголовки авторизации
        allow_methods=["*"],  # Разрешить все методы (GET, POST, PUT, DELETE и т.д.)
        allow_headers=["*"],  # Разрешить все заголовки
    )
    return application


app = get_app()
