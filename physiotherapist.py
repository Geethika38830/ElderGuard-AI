from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.models.assessment import Assessment
from app.models.assignment import Assignment
from app.models.followup import FollowUp


router = APIRouter(
    prefix="/api/physiotherapist",
    tags=["Physiotherapist"]
)


def get_physio(
    physiotherapist_id: int,
    db: Session
):

    user = (
        db.query(User)
        .filter(User.id == physiotherapist_id)
        .first()
    )

    if not user or user.role != "physiotherapist":
        raise HTTPException(
            status_code=403,
            detail="Invalid physiotherapist account."
        )

    return user


def get_patient_ids(
    physiotherapist_id: int,
    db: Session
):

    assignments = (
        db.query(Assignment)
        .filter(
            Assignment.physiotherapist_id == physiotherapist_id,
            Assignment.status == "active"
        )
        .all()
    )

    return [
        assignment.patient_id
        for assignment in assignments
    ]


@router.get("/dashboard")
def physiotherapist_dashboard(
    physiotherapist_id: int,
    db: Session = Depends(get_db)
):

    physio = get_physio(
        physiotherapist_id,
        db
    )

    patient_ids = get_patient_ids(
        physiotherapist_id,
        db
    )

    assessments = (
        db.query(Assessment)
        .filter(
            Assessment.user_id.in_(patient_ids)
        )
        .order_by(
            Assessment.created_at.desc()
        )
        .all()
        if patient_ids
        else []
    )

    high = sum(
        1 for item in assessments
        if item.risk_level == "High"
    )

    moderate = sum(
        1 for item in assessments
        if item.risk_level == "Moderate"
    )

    low = sum(
        1 for item in assessments
        if item.risk_level == "Low"
    )

    latest = []

    for item in assessments[:10]:

        patient = (
            db.query(User)
            .filter(User.id == item.user_id)
            .first()
        )

        latest.append({
            "assessment_id": item.id,
            "patient_id": item.user_id,
            "patient_name": (
                patient.name
                if patient
                else item.elderly_name
            ),
            "risk_score": item.risk_score,
            "risk_level": item.risk_level,
            "created_at": item.created_at
        })

    return {
        "physiotherapist": {
            "id": physio.id,
            "name": physio.name,
            "email": physio.email
        },
        "total_patients": len(patient_ids),
        "total_assessments": len(assessments),
        "high_risk": high,
        "moderate_risk": moderate,
        "low_risk": low,
        "recent_assessments": latest
    }


@router.get("/patient/{patient_id}")
def patient_details(
    patient_id: int,
    physiotherapist_id: int,
    db: Session = Depends(get_db)
):

    get_physio(
        physiotherapist_id,
        db
    )

    assignment = (
        db.query(Assignment)
        .filter(
            Assignment.patient_id == patient_id,
            Assignment.physiotherapist_id == physiotherapist_id,
            Assignment.status == "active"
        )
        .first()
    )

    if not assignment:
        raise HTTPException(
            status_code=403,
            detail="Patient is not assigned to this physiotherapist."
        )

    patient = (
        db.query(User)
        .filter(User.id == patient_id)
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    assessments = (
        db.query(Assessment)
        .filter(
            Assessment.user_id == patient_id
        )
        .order_by(
            Assessment.created_at.desc()
        )
        .all()
    )

    history = []

    for item in assessments:

        factors = (
            [
                x.strip()
                for x in item.risk_factors.split(",")
                if x.strip()
            ]
            if item.risk_factors
            else []
        )

        history.append({
            "id": item.id,
            "risk_score": item.risk_score,
            "risk_level": item.risk_level,
            "risk_factors": factors,
            "created_at": item.created_at
        })

    latest = history[0] if history else None

    return {
        "patient": {
            "id": patient.id,
            "name": patient.name,
            "email": patient.email,
            "subscription_plan": patient.subscription_plan,
            "subscription_status": patient.subscription_status
        },
        "latest_assessment": latest,
        "assessment_history": history
    }


@router.get("/risk-monitoring")
def risk_monitoring(
    physiotherapist_id: int,
    db: Session = Depends(get_db)
):

    get_physio(
        physiotherapist_id,
        db
    )

    patient_ids = get_patient_ids(
        physiotherapist_id,
        db
    )

    results = []

    for patient_id in patient_ids:

        patient = (
            db.query(User)
            .filter(User.id == patient_id)
            .first()
        )

        latest = (
            db.query(Assessment)
            .filter(
                Assessment.user_id == patient_id
            )
            .order_by(
                Assessment.created_at.desc()
            )
            .first()
        )

        if patient and latest:

            results.append({
                "patient_id": patient.id,
                "patient_name": patient.name,
                "risk_score": latest.risk_score,
                "risk_level": latest.risk_level,
                "created_at": latest.created_at
            })

    results.sort(
        key=lambda x: x["risk_score"],
        reverse=True
    )

    return results


@router.post("/followups")
def create_followup(
    physiotherapist_id: int,
    patient_id: int,
    title: str,
    notes: str = "",
    db: Session = Depends(get_db)
):

    get_physio(
        physiotherapist_id,
        db
    )

    assignment = (
        db.query(Assignment)
        .filter(
            Assignment.patient_id == patient_id,
            Assignment.physiotherapist_id == physiotherapist_id,
            Assignment.status == "active"
        )
        .first()
    )

    if not assignment:
        raise HTTPException(
            status_code=403,
            detail="Patient is not assigned to this physiotherapist."
        )

    followup = FollowUp(
        patient_id=patient_id,
        physiotherapist_id=physiotherapist_id,
        title=title,
        notes=notes,
        status="pending"
    )

    db.add(followup)
    db.commit()
    db.refresh(followup)

    return {
        "success": True,
        "message": "Follow-up created successfully.",
        "followup": {
            "id": followup.id,
            "patient_id": followup.patient_id,
            "title": followup.title,
            "notes": followup.notes,
            "status": followup.status,
            "created_at": followup.created_at
        }
    }


@router.get("/followups")
def get_followups(
    physiotherapist_id: int,
    db: Session = Depends(get_db)
):

    get_physio(
        physiotherapist_id,
        db
    )

    followups = (
        db.query(FollowUp)
        .filter(
            FollowUp.physiotherapist_id == physiotherapist_id
        )
        .order_by(
            FollowUp.created_at.desc()
        )
        .all()
    )

    result = []

    for item in followups:

        patient = (
            db.query(User)
            .filter(User.id == item.patient_id)
            .first()
        )

        result.append({
            "id": item.id,
            "patient_id": item.patient_id,
            "patient_name": (
                patient.name
                if patient
                else "Unknown"
            ),
            "title": item.title,
            "notes": item.notes,
            "status": item.status,
            "followup_date": item.followup_date,
            "created_at": item.created_at
        })

    return result