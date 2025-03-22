import aiohttp
from typing import Any
from http import HTTPMethod
from starlette import status
from backend.src.config import Config
from backend.src.presentation.api.exceptions import ApiError

class BaseHttpClient:
    def __init__(self,) -> None:
        self._session = aiohttp.ClientSession()
        
    async def _make_request(
        self,
        url: str,
        method: HTTPMethod = HTTPMethod.POST,
        params: dict[str, str] | None = None,
        json: dict[str, Any] | None = None,
        data: dict[str, Any] | None = None,
        headers: dict[str, str] | None = None,
    ) -> dict:
        async with self._session.request(
            method=method,
            url=url,
            params=params,
            headers=headers,
            json=json,
            data=data,
        ) as response:
            return await response.json()

        
    async def close(self) -> None:
        await self._session.close()


class SpeechKitClient(BaseHttpClient):
    def __init__(self, settings: Config) -> None:
        super().__init__()
        self._settings = settings
    async def conver_speech_to_text(self, audio_data: Any):
        result = await self._make_request(
            url=self._settings.speechkit.api_url,
            headers={
                "Authorization": f"Api-Key {self._settings.speechkit.api_key}",
                "x-folder-id": self._settings.speechkit.folder_id,
            },
            data=audio_data,
        )
        if "error_code" in result:
            raise ApiError(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error_message")
            )
        return {"transcription": result.get("result", "Нет текста!")}