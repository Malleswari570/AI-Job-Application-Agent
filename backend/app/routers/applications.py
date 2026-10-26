from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Application


router = APIRouter(prefix="/applications", tags=["Applications"])




class ApplicationStatusUpdate(BaseModel):
    status: str

class ApplicationCreate(BaseModel):
    user_id: int
    title: str
    company: str
    location: Optional[str] = None
    application_type: str = "Job"
    url: Optional[str] = None
    match_score: Optional[int] = None
    status: str = "Applied"


def application_to_dict(application: Application):
    return {
        "id": application.id,
        "title": application.title,
        "company": application.company,
        "location": application.location,
        "application_type": application.application_type,
        "url": application.url,
        "match_score": application.match_score,
        "status": application.status,
        "applied_at": application.applied_at,
    }


@router.post("/")
def create_application(
    application_data: ApplicationCreate,
    db: Session = Depends(get_db),
):
    existing = (
        db.query(Application)
        .filter(
            Application.user_id == application_data.user_id,
            Application.title == application_data.title,
            Application.company == application_data.company,
        )
        .first()
    )

    if existing:
        return {
            "success": True,
            "message": "Application already saved.",
            "application": application_to_dict(existing),
        }

    application = Application(
        user_id=application_data.user_id,
        title=application_data.title,
        company=application_data.company,
        location=application_data.location,
        application_type=application_data.application_type,
        url=application_data.url,
        match_score=application_data.match_score,
        status=application_data.status,
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return {
        "success": True,
        "message": "Application saved successfully.",
        "application": application_to_dict(application),
    }


@router.get("/{user_id}")
def get_applications(
    user_id: int,
    db: Session = Depends(get_db),
):
    applications = (
        db.query(Application)
        .filter(Application.user_id == user_id)
        .order_by(Application.applied_at.desc())
        .all()
    )

    return {
        "success": True,
        "applications": [application_to_dict(item) for item in applications],
    }


@router.patch("/{application_id}")
def update_application_status(
    application_id: int,
    status_data: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
):
    allowed_statuses = {
        "Applied",
        "Shortlisted",
        "Interview",
        "Technical Round",
        "HR Round",
        "Offer",
        "Rejected",
    }
    if status_data.status not in allowed_statuses:
        raise HTTPException(status_code=400, detail="Invalid application status.")

    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")

    application.status = status_data.status
    db.commit()
    db.refresh(application)

    return {
        "success": True,
        "message": "Application status updated successfully.",
        "application": application_to_dict(application),
    }


@router.delete("/{application_id}")
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
):
    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")

    db.delete(application)
    db.commit()

    return {
        "success": True,
        "message": "Application removed successfully.",
    }
