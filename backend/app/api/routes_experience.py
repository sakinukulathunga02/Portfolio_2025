from fastapi import APIRouter, HTTPException
from app.db.database import db
from app.schemas.experience_schema import Experience
from bson import ObjectId
from datetime import datetime, date  # ✅ Add `date` here
from typing import Dict, Any

router = APIRouter()

def serialize_experience(doc):
    doc["id"] = str(doc.pop("_id"))
    for field in ["start_date", "end_date"]:
        if isinstance(doc.get(field), datetime):
            doc[field] = doc[field].date()
    return doc

def convert_date_fields(data: dict) -> dict:
    # Convert `date` to `datetime` for MongoDB compatibility
    for field in ["start_date", "end_date"]:
        if isinstance(data.get(field), date):
            data[field] = datetime.combine(data[field], datetime.min.time())
    return data



@router.get("/get")
async def get_personals():
    experiences = []
    async for experience in db.experiences.find():
        experiences.append(serialize_experience(dict(experience)))
    return experiences

@router.post("/post")
async def create_experience(experience: Experience):
    try:
        experience_dict = experience.model_dump(exclude_unset=True)

        # Convert URLs to strings if needed
        for field in ['website']:
            if experience_dict.get(field):
                experience_dict[field] = str(experience_dict[field])

        experience_dict = convert_date_fields(experience_dict)
        # Insert document
        result = await db.experiences.insert_one(experience_dict)

        # Build response dict manually - no raw ObjectId here
        response_data = {
            "id": str(result.inserted_id),
            "Company_name": experience_dict.get("Company_name"),
            "position": experience_dict.get("position"),
            "start_date": experience_dict.get("start_date"),
            "end_date": experience_dict.get("end_date"),
            "description": experience_dict.get("description"),
            "website": experience_dict.get("website"),
        }

        return response_data
    except Exception as e:
        print(f"POST /experiences/post failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
@router.put("/update/{id}")
async def update_experience(id: str, experience: Experience):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    experience_dict = experience.model_dump(exclude_unset=True)

    if experience_dict.get("website"):
        experience_dict["website"] = str(experience_dict["website"])

    experience_dict = convert_date_fields(experience_dict)

    result = await db.experiences.update_one(
        {"_id": ObjectId(id)},
        {"$set": experience_dict}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Experience record not found or no changes made")

    updated_doc = await db.experiences.find_one({"_id": ObjectId(id)})
    return serialize_experience(dict(updated_doc))


@router.delete("/delete/{id}")
async def delete_experience(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = await db.experiences.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Experience record not found")

    return {"detail": "Experience record deleted successfully"}

