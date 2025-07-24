from pydantic import BaseModel

class Phone(BaseModel):
    number: str

class PhoneUpdate(BaseModel):
    id: str
    number: str
