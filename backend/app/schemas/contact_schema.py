import os
from pydantic import BaseModel
from typing import Optional

class ContactForm(BaseModel):
    first_name: str
    last_name: str
    email: str
    message: str