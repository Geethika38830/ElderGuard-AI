from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import hashlib

from app.database.connection import get_db
from app.models.user import User
from app.models.assessment import Assessment
from app.models.assignment import Assignment


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


# =========================================================
# PASSWORD HASHING
# =========================================================

def hash_password(password: str) -> str:
    return hashlib.sha256(
        password.encode("utf-8")
    ).hexdigest()


# =========================================================
# ADMIN VALIDATION
# =========================================================

def get_admin(
    admin_id: int,
    db: Session
):

    admin = (
        db.query(User)
        .filter(User.id == admin_id)
        .first()
    )

    if not admin or admin.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Administrator access required."
        )

    return admin


# =========================================================
# ADMIN DASHBOARD
# =========================================================

@router.get("/dashboard")
def admin_dashboard(
    admin_id: int,
    db: Session = Depends(get_db)
):

    get_admin(
        admin_id,
        db
    )

    users = db.query(User).all()

    patients = [
        user for user in users
        if user.role == "patient"
    ]

    physiotherapists = [
        user for user in users
        if user.role == "physiotherapist"
    ]

    admins = [
        user for user in users
        if user.role == "admin"
    ]

    assessments = (
        db.query(Assessment)
        .all()
    )

    high = sum(
        1
        for item in assessments
        if item.risk_level == "High"
    )

    plus_users = sum(
        1
        for user in patients
        if user.subscription_plan == "plus"
        and user.subscription_status == "active"
    )

    active_assignments = (
        db.query(Assignment)
        .filter(
            Assignment.status == "active"
        )
        .count()
    )

    return {
        "total_users": len(users),
        "total_patients": len(patients),
        "total_physiotherapists": len(physiotherapists),
        "total_admins": len(admins),
        "total_assessments": len(assessments),
        "high_risk_assessments": high,
        "plus_subscribers": plus_users,
        "active_assignments": active_assignments
    }


# =========================================================
# ALL USERS
# =========================================================

@router.get("/users")
def get_users(
    admin_id: int,
    db: Session = Depends(get_db)
):

    get_admin(
        admin_id,
        db
    )

    users = (
        db.query(User)
        .order_by(
            User.created_at.desc()
        )
        .all()
    )

    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "subscription_plan": user.subscription_plan,
            "subscription_status": user.subscription_status,
            "subscription_expiry": user.subscription_expiry,
            "created_at": user.created_at
        }
        for user in users
    ]


# =========================================================
# ALL PATIENTS
# =========================================================

@router.get("/patients")
def get_patients(
    admin_id: int,
    db: Session = Depends(get_db)
):

    get_admin(
        admin_id,
        db
    )

    patients = (
        db.query(User)
        .filter(
            User.role == "patient"
        )
        .order_by(
            User.name.asc()
        )
        .all()
    )

    return [
        {
            "id": patient.id,
            "name": patient.name,
            "email": patient.email,
            "subscription_plan": patient.subscription_plan,
            "subscription_status": patient.subscription_status
        }
        for patient in patients
    ]


# =========================================================
# ALL PHYSIOTHERAPISTS
# =========================================================

@router.get("/physiotherapists")
def get_physiotherapists(
    admin_id: int,
    db: Session = Depends(get_db)
):

    get_admin(
        admin_id,
        db
    )

    physiotherapists = (
        db.query(User)
        .filter(
            User.role == "physiotherapist"
        )
        .order_by(
            User.name.asc()
        )
        .all()
    )

    return [
        {
            "id": item.id,
            "name": item.name,
            "email": item.email,
            "role": item.role
        }
        for item in physiotherapists
    ]


# =========================================================
# CREATE PHYSIOTHERAPIST
# =========================================================

@router.post("/physiotherapists/create")
def create_physiotherapist(
    admin_id: int,
    name: str,
    email: str,
    password: str,
    db: Session = Depends(get_db)
):

    # Verify admin
    get_admin(
        admin_id,
        db
    )

    name = name.strip()
    email = email.strip().lower()
    password = password.strip()

    # -------------------------
    # Validation
    # -------------------------

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Physiotherapist name is required."
        )

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Physiotherapist email is required."
        )

    if len(password) < 6:
        raise HTTPException(
            status_code=400,
            detail=(
                "Password must contain "
                "at least 6 characters."
            )
        )

    # -------------------------
    # Check duplicate email
    # -------------------------

    existing_user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail=(
                "An account with this "
                "email already exists."
            )
        )

    # -------------------------
    # Create physiotherapist
    # -------------------------

    physiotherapist = User(
        name=name,
        email=email,
        password=hash_password(password),
        role="physiotherapist",
        subscription_plan="professional",
        subscription_status="active",
        subscription_expiry=None
    )

    db.add(
        physiotherapist
    )

    db.commit()

    db.refresh(
        physiotherapist
    )

    return {
        "success": True,
        "message": (
            "Physiotherapist account "
            "created successfully."
        ),
        "physiotherapist": {
            "id": physiotherapist.id,
            "name": physiotherapist.name,
            "email": physiotherapist.email,
            "role": physiotherapist.role,
            "subscription_plan": (
                physiotherapist.subscription_plan
            ),
            "subscription_status": (
                physiotherapist.subscription_status
            )
        }
    }


# =========================================================
# DELETE / DEACTIVATE PHYSIOTHERAPIST
# =========================================================

@router.delete("/physiotherapists/{physiotherapist_id}")
def delete_physiotherapist(
    physiotherapist_id: int,
    admin_id: int,
    db: Session = Depends(get_db)
):

    get_admin(
        admin_id,
        db
    )

    physiotherapist = (
        db.query(User)
        .filter(
            User.id == physiotherapist_id,
            User.role == "physiotherapist"
        )
        .first()
    )

    if not physiotherapist:
        raise HTTPException(
            status_code=404,
            detail="Physiotherapist not found."
        )

    # Deactivate existing assignments
    assignments = (
        db.query(Assignment)
        .filter(
            Assignment.physiotherapist_id
            == physiotherapist_id,
            Assignment.status == "active"
        )
        .all()
    )

    for assignment in assignments:
        assignment.status = "inactive"

    # Instead of deleting the user permanently,
    # mark the account inactive.
    physiotherapist.subscription_status = "inactive"

    db.commit()

    return {
        "success": True,
        "message": (
            "Physiotherapist account "
            "deactivated successfully."
        )
    }