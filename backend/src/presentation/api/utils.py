from urllib.parse import urlparse

def get_hostname(url: str) -> str:
    return urlparse(url).netloc