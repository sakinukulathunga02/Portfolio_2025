from pydantic import BaseModel
from typing import Optional


class Skill(BaseModel):
    name: str
    image_filename: str
    content_type: Optional[str]
    image_data: Optional[str] 