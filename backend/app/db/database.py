from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("mongodb://localhost:27017/")
client = AsyncIOMotorClient(MONGO_URL)
db = client["portfolio"]
