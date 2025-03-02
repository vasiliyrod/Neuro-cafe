from enum import StrEnum


class UserRole(StrEnum):
    CLIENT = "client"
    ADMIN = "admin"
    INTERNAL_ADMIN = "internal_admin"