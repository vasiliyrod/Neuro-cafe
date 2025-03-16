from pathlib import Path


class NonExistentPath(Exception):
    pass


def build_absolute_path(path_from_root: Path) -> str:
    if not (path := Path.cwd() / path_from_root).exists():
        raise NonExistentPath
    return path
