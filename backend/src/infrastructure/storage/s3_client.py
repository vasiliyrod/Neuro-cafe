import boto3
from typing import Any
from backend.src.config import Config
from backend.src.utils.identifier import get_uuid


class ObjectStorageClient:
    def __init__(self, settings: Config):
        self._settings = settings.s3
        self._session = boto3.session.Session()
        self.s3 = self._session.client(
            service_name=self._settings.service_name,
            endpoint_url=self._settings.endpoint_url,
            aws_access_key_id=self._settings.aws_access_key_id,
            aws_secret_access_key=self._settings.aws_secret_access_key,
        )
    def upload(self, data: Any) -> str:
        bucket_name = "memory-minder-images"
        folder_name = "storage"
        filename = f"{str(get_uuid())}.jpg"
        self.s3.put_object(Bucket=bucket_name, Key=f"{folder_name}/{filename}", Body=data)
        return f"{self._settings.endpoint_url}/{bucket_name}/{folder_name}/{filename}"