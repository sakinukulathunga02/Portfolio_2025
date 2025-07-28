from fastapi import APIRouter, HTTPException
from app.schemas.certificate_schema import Certificate
from app.db.database import db
from datetime import datetime
from bson import ObjectId

router = APIRouter()

# Helper to convert MongoDB document to dict with string id
def serialize_certificate(doc):
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.get("/get")
async def get_certificates():
    certificates = []
    async for cert in db.certificates.find():
        certificates.append(serialize_certificate(dict(cert)))
    return certificates

@router.post("/post")
async def create_certificate(certificate: Certificate):
    try:
        cert_dict = certificate.model_dump(exclude_unset=True)

        # Convert date to datetime
        if "issue_date" in cert_dict and cert_dict["issue_date"]:
            cert_dict["issue_date"] = datetime.combine(cert_dict["issue_date"], datetime.min.time())
        if "expiration_date" in cert_dict and cert_dict["expiration_date"]:
            cert_dict["expiration_date"] = datetime.combine(cert_dict["expiration_date"], datetime.min.time())

        # Convert HttpUrl to string
        if "certificate_url" in cert_dict and cert_dict["certificate_url"]:
            cert_dict["certificate_url"] = str(cert_dict["certificate_url"])

        result = await db.certificates.insert_one(cert_dict)

        # Fetch the inserted document
        created_doc = await db.certificates.find_one({"_id": result.inserted_id})
        return serialize_certificate(dict(created_doc))

    except Exception as e:
        print(f"POST /certificates/post failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/update/{id}")
async def update_certificate(id: str, certificate: Certificate):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    cert_dict = certificate.model_dump(exclude_unset=True)
    result = await db.certificates.update_one(
        {"_id": ObjectId(id)},
        {"$set": cert_dict}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Certificate not found or no changes made")

    updated_doc = await db.certificates.find_one({"_id": ObjectId(id)})
    return serialize_certificate(dict(updated_doc))

@router.delete("/delete/{id}")
async def delete_certificate(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = await db.certificates.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Certificate not found")

    return {"detail": "Certificate deleted successfully"}
