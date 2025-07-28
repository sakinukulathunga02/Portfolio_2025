from fastapi import APIRouter, HTTPException
from app.db.database import db
from app.schemas.personal_schema import Personal
from bson import ObjectId
from datetime import datetime
from typing import Dict, Any

router = APIRouter()

@router.get("/get")
async def get_personals():
    result = []
    async for personal in db.personal.find():
        personal_data = dict(personal)
        personal_data["id"] = str(personal_data.pop("_id"))

        # No need to convert 'birthdate' if it's already string (just leave it)
        result.append(personal_data)

    return result

@router.post("/post")
async def create_personal(personal: Personal):
    existing_personal = await db.personal.find_one({})
    if existing_personal:
        raise HTTPException(status_code=400, detail="Personal information already exists")

    personal_dict = personal.model_dump(exclude_unset=True)

    # Convert URLs to strings if needed
    for field in ['linkedin', 'github']:
        if personal_dict.get(field):
            personal_dict[field] = str(personal_dict[field])

    # Convert birthdate to ISO string
    if personal_dict.get('birthdate'):
        personal_dict['birthdate'] = personal_dict['birthdate'].isoformat()

    # Insert document
    result = await db.personal.insert_one(personal_dict)

    # Build response dict manually - no raw ObjectId here
    response_data = {
        "id": str(result.inserted_id),
        "name": personal_dict.get("name"),
        "passion": personal_dict.get("passion"),
        "address": personal_dict.get("address"),
        "phone": personal_dict.get("phone"),
        "email": personal_dict.get("email"),
        "linkedin": personal_dict.get("linkedin"),
        "github": personal_dict.get("github"),
        "birthdate": personal_dict.get("birthdate"),
    }

    return response_data


@router.put("/update")
async def update_personal(personal: Personal):
    existing_personal = await db.personal.find_one({})
    if not existing_personal:
        raise HTTPException(status_code=404, detail="Personal information not found")

    personal_dict = personal.model_dump(exclude_unset=True)

    # Convert URLs to strings if needed
    for field in ['linkedin', 'github']:
        if personal_dict.get(field):
            personal_dict[field] = str(personal_dict[field])

    # Convert birthdate to ISO string
    if personal_dict.get('birthdate'):
        personal_dict['birthdate'] = personal_dict['birthdate'].isoformat()

    # Update the existing document by its _id
    updated = await db.personal.update_one(
        {"_id": existing_personal["_id"]},
        {"$set": personal_dict}
    )
    if updated.modified_count == 0:
        raise HTTPException(status_code=400, detail="Update failed")

    # Fetch the updated document to return
    updated_personal = await db.personal.find_one({"_id": existing_personal["_id"]})
    updated_personal["id"] = str(updated_personal.pop("_id"))

    return updated_personal