from enum import IntEnum
from backend.src.core.enum.user import UserRole


class AccessLevel(IntEnum):
    NoAuth = 0
    Client = 1
    Admin = 2
    InternalAdmin = 3


_access_level_by_role = {
    UserRole.CLIENT: AccessLevel.Client,
    UserRole.ADMIN: AccessLevel.Admin,
    UserRole.INTERNAL_ADMIN: AccessLevel.InternalAdmin,
}