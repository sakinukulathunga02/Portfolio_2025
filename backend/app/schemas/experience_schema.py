from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import date

class Experience(BaseModel):
    Company_name: str
    position: Optional[str]
    start_date: Optional[date]
    end_date: Optional[date]
    description: Optional[str]
    website: Optional[HttpUrl]  