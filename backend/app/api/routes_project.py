from fastapi import APIRouter, HTTPException
from app.schemas.project_schema import Project
from app.db.database import db
from bson import ObjectId

router = APIRouter()

# ───── Helper to serialize MongoDB doc ─────
def serialize_project(doc):
    doc["id"] = str(doc.pop("_id"))
    return doc

# ───── GET all projects ─────
@router.get("/get")
async def get_projects():
    projects = []
    async for proj in db.projects.find():
        projects.append(serialize_project(dict(proj)))
    return projects

# ───── POST new project ─────
@router.post("/post")
async def create_project(project: Project):
    try:
        project_dict = project.model_dump(exclude_unset=True)

        # Optional: ensure URLs and lists are valid MongoDB types
        if "repository_url" in project_dict and project_dict["repository_url"]:
            project_dict["repository_url"] = str(project_dict["repository_url"])
        if "live_url" in project_dict and project_dict["live_url"]:
            project_dict["live_url"] = str(project_dict["live_url"])
        if "technologies" in project_dict and project_dict["technologies"]:
            project_dict["technologies"] = list(project_dict["technologies"])

        result = await db.projects.insert_one(project_dict)
        created_doc = await db.projects.find_one({"_id": result.inserted_id})
        return serialize_project(dict(created_doc))

    except Exception as e:
        print(f"POST /projects/post failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ───── PUT update project ─────
@router.put("/update/{id}")
async def update_project(id: str, project: Project):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    project_dict = project.model_dump(exclude_unset=True)

    if "repository_url" in project_dict and project_dict["repository_url"]:
        project_dict["repository_url"] = str(project_dict["repository_url"])
    if "live_url" in project_dict and project_dict["live_url"]:
        project_dict["live_url"] = str(project_dict["live_url"])
    if "technologies" in project_dict and project_dict["technologies"]:
        project_dict["technologies"] = list(project_dict["technologies"])

    result = await db.projects.update_one(
        {"_id": ObjectId(id)},
        {"$set": project_dict}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found or no changes made")

    updated_doc = await db.projects.find_one({"_id": ObjectId(id)})
    return serialize_project(dict(updated_doc))

# ───── DELETE project ─────
@router.delete("/delete/{id}")
async def delete_project(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = await db.projects.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")

    return {"detail": "Project deleted successfully"}
