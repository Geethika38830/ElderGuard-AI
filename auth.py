from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import hashlib

from app.database.connection import get_db
from app.models.user import User


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


def hash_password(password: str) -> str:
    return hashlib.sha256(
        password.encode("utf-8")
    ).hexdigest()


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):

    email = email.strip().lower()

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if user.password != hash_password(password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "subscription_plan": user.subscription_plan,
            "subscription_status": user.subscription_status,
            "subscription_expiry": (
                user.subscription_expiry.isoformat()
                if user.subscription_expiry
                else None
            )
        }
    }


# =========================================================
# REGISTER PATIENT
# =========================================================

@router.post("/register")
def register(
    name: str,
    email: str,
    password: str,
    db: Session = Depends(get_db)
):

    name = name.strip()
    email = email.strip().lower()

    # -----------------------------
    # Validation
    # -----------------------------

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Name is required"
        )

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email is required"
        )

    if len(password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 6 characters"
        )

    # -----------------------------
    # Existing user
    # -----------------------------

    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists"
        )

    # -----------------------------
    # Create patient
    # -----------------------------

    user = User(
        name=name,
        email=email,
        password=hash_password(password),

        # Every normal registration
        # starts as a patient.
        role="patient",

        # Free plan by default.
        subscription_plan="free",

        # No paid subscription initially.
        subscription_status="inactive",

        subscription_expiry=None
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "message": "Registration successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "subscription_plan": user.subscription_plan,
            "subscription_status": user.subscription_status,
            "subscription_expiry": None
        }
    }