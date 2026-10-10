from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.assessment import Assessment
from app.models.user import User


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("/summary")
def dashboard_summary(
    user_id: int | None = None,
    db: Session = Depends(get_db)
):

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="User authentication required."
        )

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User account not found."
        )

    # ---------------------------------
    # PATIENT
    # ---------------------------------

    if user.role == "patient":

        assessments = (
            db.query(Assessment)
            .filter(
                Assessment.user_id == user_id
            )
            .order_by(
                Assessment.created_at.desc()
            )
            .all()
        )

    # ---------------------------------
    # PHYSIOTHERAPIST / ADMIN
    # ---------------------------------

    else:

        assessments = (
            db.query(Assessment)
            .order_by(
                Assessment.created_at.desc()
            )
            .all()
        )

    # ---------------------------------
    # CALCULATE SUMMARY
    # ---------------------------------

    total = len(assessments)

    low = sum(
        1
        for item in assessments
        if item.risk_level == "Low"
    )

    moderate = sum(
        1
        for item in assessments
        if item.risk_level == "Moderate"
    )

    high = sum(
        1
        for item in assessments
        if item.risk_level == "High"
    )

    # ---------------------------------
    # LATEST ASSESSMENT
    # ---------------------------------

    latest = None

    if assessments:

        latest_item = assessments[0]

        latest = {
            "id": latest_item.id,
            "risk_score": latest_item.risk_score,
            "risk_level": latest_item.risk_level,
            "created_at": latest_item.created_at
        }

    return {
        "user_id": user.id,
        "user_name": user.name,
        "role": user.role,

        "total_assessments": total,

        "low_risk": low,

        "moderate_risk": moderate,

        "high_risk": high,

        "latest_assessment": latest
    }