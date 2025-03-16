import json
from typing import Any
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from backend.src.infrastructure.database.unit_of_work import get_unit_of_work
from backend.src.core.logging.yc_logger import get_yc_logger

logger = get_yc_logger()

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        logger.info(f"{request.method} {request.url}", details=await self._get_user_request_data(request))
        try:
            request.state.token = request.headers.get('X-Auth-Token')
            if (user_id := request.headers.get('X-UID')) is not None:
                request.state.user_id = int(user_id)
            else:
                request.state.user_id = None
            # по хорошему унести в отдельную мидльварь
            async for uow in get_unit_of_work():
                await uow.user.create_client_if_not_exists(telegram_id=request.state.user_id)
            response = await call_next(request)
            return response
        except HTTPException as exc:
            logger.warn(
                f"Handled error occurred\n"
                f"{exc.detail}" 
            )
            return JSONResponse(content={"detail": exc.detail}, status_code=exc.status_code)
        except Exception as exc:
            logger.error(
                f"Unhandled error occurred!!\n"
                f"{str(exc)}"
            )
            return JSONResponse(content={"detail": f"Error: {str(exc)}"}, status_code=500)
    
    async def _get_user_request_data(self, request: Request) -> dict[str, Any]:
        try:
            body = await request.json()
        except json.JSONDecodeError:
            body = None
        client_host = request.client.host
        client_port = request.client.port
        method = request.method
        url = request.url
        base_url = request.base_url
        headers = self._sanitize_headers(dict(request.headers))
        cookies = request.cookies
        return {
            "client_host": client_host,
            "client_port": client_port,
            "method": method,
            "url": str(url),
            "body": body, 
            "base_url": str(base_url),
            "headers": headers,
            "cookies": dict(cookies)
        }
    
    def _sanitize_headers(self, headers: dict[str, Any]) -> None:
        BLACK_LIST = ("x-auth-token",)
        for header in headers:
            if header in BLACK_LIST:
                headers[header] = "*******"
        return headers