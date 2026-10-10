from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.models.assessment import Assessment
from app.models.assignment import Assignment


router = APIRouter(
    prefix="/api/patient",
    tags=["Patient"]
)


def get_patient(
    patient_id: int,
    db: Session
):

    patient = (
        db.query(User)
        .filter(User.id == patient_id)
        .first()
    )

    if not patient or patient.role != "patient":
        raise HTTPException(
            status_code=403,
            detail="Invalid patient account."
        )

    return patient


@router.get("/profile")
def patient_profile(
    patient_id: int,
    db: Session = Depends(get_db)
):

    patient = get_patient(
        patient_id,
        db
    )

    assignment = (
        db.query(Assignment)
        .filter(
            Assignment.patient_id == patient_id,
            Assignment.status == "active"
        )
        .first()
    )

    physiotherapist = None

    if assignment:
        physiotherapist = (
            db.query(User)
            .filter(
                User.id == assignment.physiotherapist_id
            )
            .first()
        )

    return {
        "patient": {
            "id": patient.id,
            "name": patient.name,
            "email": patient.email,
            "role": patient.role,
            "subscription_plan": patient.subscription_plan,
            "subscription_status": patient.subscription_status,
            "subscription_expiry": (
                patient.subscription_expiry
                if patient.subscription_expiry
                else None
            ),
            "created_at": patient.created_at
        },
        "physiotherapist": (
            {
                "id": physiotherapist.id,
                "name": physiotherapist.name,
                "email": physiotherapist.email
            }
            if physiotherapist
            else None
        )
    }


@router.get("/progress")
def patient_progress(
    patient_id: int,
    db: Session = Depends(get_db)
):

    get_patient(
        patient_id,
        db
    )

    assessments = (
        db.query(Assessment)
        .filter(
            Assessment.user_id == patient_id
        )
        .order_by(
            Assessment.created_at.asc()
        )
        .all()
    )

    return [
        {
            "id": item.id,
            "risk_score": item.risk_score,
            "risk_level": item.risk_level,
            "daily_steps": item.daily_steps,
            "exercise_days": item.exercise_days,
            "created_at": item.created_at
        }
        for item in assessments
    ]