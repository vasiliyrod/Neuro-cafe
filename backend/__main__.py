import uvicorn
from backend.src.core.logging import setup_logging
from backend.src.config import settings

def main():
    setup_logging()

    uvicorn.run(
        "backend.src.presentation.api.main:app",
        host=settings.app.host,
        port=settings.app.port,
        reload=settings.app.reload,
        log_level=settings.logging.level,
    )

if __name__ == "__main__":
    main()