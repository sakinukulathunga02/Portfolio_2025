from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes_phone

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development; adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_phone.router, prefix="/phones", tags=["phones"])