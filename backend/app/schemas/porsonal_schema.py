from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Optional
from datetime import date

class Personal(BaseModel):
    name: str
    passion: Optional[str]
    address: Optional[str]
    phone: Optional[str] 
    email: EmailStr
    linkedin: Optional[HttpUrl]
    github: Optional[HttpUrl]
    birthdate: Optional[date]