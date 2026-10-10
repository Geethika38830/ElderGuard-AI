from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User


router = APIRouter(
    prefix="/api/subscription",
    tags=["Subscription"]
)


@router.get("/status")
def subscription_status(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    return {
        "user_id": user.id,
        "plan": user.subscription_plan,
        "status": user.subscription_status,
        "expiry": user.subscription_expiry
    }


@router.post("/plus")
def activate_plus(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    if user.role != "patient":
        raise HTTPException(
            status_code=403,
            detail="Only patient accounts can activate Patient Plus."
        )

    user.subscription_plan = "plus"
    user.subscription_status = "active"
    user.subscription_expiry = (
        datetime.utcnow() + timedelta(days=30)
    )

    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "message": "Patient Plus activated successfully.",
        "subscription": {
            "plan": user.subscription_plan,
            "status": user.subscription_status,
            "expiry": user.subscription_expiry
        }
    }


@router.post("/cancel")
def cancel_subscription(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    user.subscription_plan = "free"
    user.subscription_status = "inactive"
    user.subscription_expiry = None

    db.commit()

    return {
        "success": True,
        "message": "Patient Plus subscription cancelled."
    }