from fastapi import APIRouter, HTTPException, Path
from app.schemas.education_schema import Education
from app.db.database import db
from bson import ObjectId

router = APIRouter()

# Helper to convert MongoDB document to dict with string id
def serialize_education(doc):
    doc["id"] = str(doc.pop("_id"))
    return doc

@router.get("/get")
async def get_educations():
    educations = []
    async for education in db.educations.find():
        educations.append(serialize_education(dict(education)))
    return educations

@router.post("/post")
async def create_education(education: Education):
    try:
        education_dict = education.model_dump(exclude_unset=True)
        result = await db.educations.insert_one(education_dict)
        
        # Return manually, avoid ObjectId encoding issues
        return {
            "id": str(result.inserted_id),
            "institution": education_dict.get("institution"),
            "degree": education_dict.get("degree"),
            "field_of_study": education_dict.get("field_of_study"),
            "start_date": education_dict.get("start_date"),
            "end_date": education_dict.get("end_date"),
            "description": education_dict.get("description")
        }
    except Exception as e:
        print(f"POST /educations/post failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/update/{id}")
async def update_education(id: str, education: Education):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    education_dict = education.model_dump(exclude_unset=True)
    result = await db.educations.update_one(
        {"_id": ObjectId(id)},
        {"$set": education_dict}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Education record not found or no changes made")

    updated_doc = await db.educations.find_one({"_id": ObjectId(id)})
    return serialize_education(dict(updated_doc))

@router.delete("/delete/{id}")
async def delete_education(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = await db.educations.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Education record not found")

    return {"detail": "Education record deleted successfully"}
