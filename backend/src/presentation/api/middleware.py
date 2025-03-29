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
            telegram_id = request.headers.get('X-UID')
            if telegram_id not in (None, "", "undefined"):
                # костыли...
                telegram_id = int(telegram_id)
                async for uow in get_unit_of_work():
                    created_user = await uow.user.create_client_if_not_exists(telegram_id=telegram_id)
                    if created_user is not None:
                        request.state.user_id = created_user.id
                    else:
                        request.state.user_id = await uow.user.get_by_telegram_id(telegram_id=telegram_id)
            else:
                request.state.user_id = None
            
                
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
        data = {
            'body': None,
            'client_host': None,
            'client_port': None,
            'method': 'GET',  
            'url': '',
            'base_url': '',
            'headers': {},
            'cookies': {}
        }

        try:
            data['body'] = await request.json()
        except:
            data['body'] = None

        try:
            if hasattr(request, 'client') and request.client:
                data['client_host'] = request.client.host if hasattr(request.client, 'host') else None
                data['client_port'] = request.client.port if hasattr(request.client, 'port') else None
        except:
            pass

        try:
            if hasattr(request, 'method'):
                data['method'] = request.method
        except:
            pass

        try:
            if hasattr(request, 'url'):
                data['url'] = str(request.url)
        except:
            pass

        try:
            if hasattr(request, 'base_url'):
                data['base_url'] = str(request.base_url)
        except:
            pass

        try:
            if hasattr(request, 'headers'):
                headers = dict(request.headers)
                data['headers'] = self._sanitize_headers(headers) if hasattr(self, '_sanitize_headers') else headers
        except:
            data['headers'] = {}

        try:
            if hasattr(request, 'cookies'):
                data['cookies'] = dict(request.cookies)
        except:
            data['cookies'] = {}

        return data
    
    def _sanitize_headers(self, headers: dict[str, Any]) -> None:
        BLACK_LIST = ("x-auth-token",)
        for header in headers:
            if header in BLACK_LIST:
                headers[header] = "*******"
        return headers