from fastapi import APIRouter, UploadFile, File, HTTPException
from app.db.database import db
import base64
from fastapi.responses import StreamingResponse
from io import BytesIO
from bson import ObjectId


router = APIRouter()

@router.post("/post")
async def upload_icon(name: str, file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    # Read file content
    content = await file.read()

    # Encode image to base64 string
    encoded = base64.b64encode(content).decode("utf-8")

    # Save to MongoDB
    result = await db.tech_stacks.insert_one({
        "name": name,
        "image_filename": file.filename,
        "content_type": file.content_type,
        "image_data": encoded
    })

    return {"id": str(result.inserted_id), "filename": file.filename}

@router.get("/get")
async def get_tech_icon():
    icons = []
    async for doc in db.tech_stacks.find():
        image_bytes = base64.b64decode(doc["image_data"])
        icons.append({
            "id": str(doc["_id"]),
            "name": doc.get("name", "Unnamed"),
            "content_type": doc["content_type"],
            "image_data": f"data:{doc['content_type']};base64,{doc['image_data']}"
        })

    return icons