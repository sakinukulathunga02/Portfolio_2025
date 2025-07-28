from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import date

class Certificate(BaseModel):
    title: str
    issuer: str
    issue_date: Optional[date]
    expiration_date: Optional[date]
    description: Optional[str]
    certificate_url: Optional[HttpUrl]
