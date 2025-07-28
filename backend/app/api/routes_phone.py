from fastapi import APIRouter
from app.db.database import db
from app.schemas.phone_schema import Phone, PhoneUpdate
from bson import ObjectId

router = APIRouter()

@router.get("/get")
async def get_phones():
    phones = await db.phones.find().to_list(100)
    result = []
    for phone in phones:
        phone["id"] = str(phone["_id"])
        del phone["_id"]  # This is important
        result.append(phone)
    return result

@router.post("/post")
async def create_phone(phone: Phone):
    result = await db.phones.insert_one(phone.model_dump())
    return {"id": str(result.inserted_id), **phone.model_dump()}

@router.put("/{phone_id}/put")
async def update_phone(phone: PhoneUpdate):
    await db.phones.update_one({"_id": ObjectId(phone.id)}, {"$set": {"number": phone.number}})
    return {"msg":"updated successfully", "id": phone.id, "number": phone.number}

@router.delete("/{phone_id}/delete")
async def delete_phone(phone_id: str):
    result = await db.phones.delete_one({"_id": ObjectId(phone_id)})
    if result.deleted_count == 1:
        return {"msg": "Phone deleted successfully"}
    else:
        return {"msg": "Phone not found"}