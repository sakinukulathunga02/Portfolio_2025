from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes_phone
from app.api import routes_personal
from app.api import routes_education
from app.api import routes_experience
from app.api import routes_skill
from app.api import routes_certificate
from app.api import routes_project

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development; adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_phone.router, prefix="/phones", tags=["phones"])
app.include_router(routes_personal.router, prefix="/personals", tags=["personals"])
app.include_router(routes_education.router, prefix="/educations", tags=["educations"])
app.include_router(routes_experience.router, prefix="/experiences", tags=["experiences"])
app.include_router(routes_skill.router, prefix="/skills", tags=["skills"])
app.include_router(routes_certificate.router, prefix="/certificates", tags=["certificates"])
app.include_router(routes_project.router, prefix="/projects", tags=["projects"])