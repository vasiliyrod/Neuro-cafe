from pydantic import BaseModel

class BaseDTO(BaseModel):
    id: int | None = None # позволяем id быть None, тк при создании еще не знаем его
    
    class Config:
        from_attributes = True