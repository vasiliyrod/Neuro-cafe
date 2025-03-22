from dataclasses import dataclass
from backend.src.infrastructure.nlp.speechkit import SpeechKitClient
from backend.src.infrastructure.nlp.ai_assistant import AiAssistant
from backend.src.infrastructure.storage.s3_client import ObjectStorageClient
from backend.src.config import settings


@dataclass
class AppContext:
    speechkit: SpeechKitClient
    ai_assistant: AiAssistant
    s3: ObjectStorageClient
    

def get_app_context():
    return AppContext(
        speechkit=SpeechKitClient(settings=settings),
        ai_assistant=AiAssistant(),
        s3=ObjectStorageClient(settings=settings)
    )


context = get_app_context()
