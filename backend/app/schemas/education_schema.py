from pydantic import BaseModel
from typing import Optional


class Education(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str]
    start_date: Optional[str]
    end_date: Optional[str]
    description: Optional[str]