from pydantic import BaseModel
from typing import Optional


class Project(BaseModel):
    name: str
    description: Optional[str]
    repository_url: Optional[str]
    live_url: Optional[str]
    technologies: Optional[list[str]]  # List of technologies used in the project