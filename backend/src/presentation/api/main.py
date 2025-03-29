import asyncio
from fastapi import FastAPI
from fastapi_pagination import add_pagination
from contextlib import asynccontextmanager
from backend.src.config import Config, settings
from backend.src.presentation.api import list_of_routes
from backend.src.presentation.api.middleware import AuthMiddleware
from fastapi.middleware.cors import CORSMiddleware
from backend.src.presentation.telegram.__main__ import startup_bot

def bind_routes(application: FastAPI, setting: Config) -> None:
    for route in list_of_routes:
        application.include_router(route, prefix=setting.app.path_prefix)


@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(startup_bot())
    yield


def get_app() -> FastAPI:
    description = "API Нейро-Кафе"

    tags_metadata = [
        {
            "name": "Neuro Cafe",
            "description": "API Neuro Cafe",
        },
    ]

    application = FastAPI(
        lifespan=lifespan,
        title="NeuroCafe",
        description=description,
        docs_url=f"{settings.app.path_prefix}/swagger",
        openapi_url=f"{settings.app.path_prefix}/openapi",
        version="0.1.0",
        openapi_tags=tags_metadata,
    )
    bind_routes(application, settings)
    add_pagination(application)
    application.state.settings = settings
    application.add_middleware(AuthMiddleware)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return application


app = get_app()