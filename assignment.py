from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.models.assignment import Assignment


router = APIRouter(
    prefix="/api/assignment",
    tags=["Assignments"]
)


@router.post("/assign")
def assign_patient(
    admin_id: int,
    patient_id: int,
    physiotherapist_id: int,
    db: Session = Depends(get_db)
):

    admin = (
        db.query(User)
        .filter(User.id == admin_id)
        .first()
    )

    if not admin or admin.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only administrators can assign patients."
        )

    patient = (
        db.query(User)
        .filter(User.id == patient_id)
        .first()
    )

    if not patient or patient.role != "patient":
        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    physiotherapist = (
        db.query(User)
        .filter(User.id == physiotherapist_id)
        .first()
    )

    if not physiotherapist or physiotherapist.role != "physiotherapist":
        raise HTTPException(
            status_code=404,
            detail="Physiotherapist not found."
        )

    existing = (
        db.query(Assignment)
        .filter(
            Assignment.patient_id == patient_id,
            Assignment.physiotherapist_id == physiotherapist_id,
            Assignment.status == "active"
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Patient is already assigned to this physiotherapist."
        )

    assignment = Assignment(
        patient_id=patient_id,
        physiotherapist_id=physiotherapist_id,
        status="active"
    )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return {
        "success": True,
        "message": "Patient assigned successfully.",
        "assignment": {
            "id": assignment.id,
            "patient_id": assignment.patient_id,
            "physiotherapist_id": assignment.physiotherapist_id,
            "status": assignment.status,
            "assigned_at": assignment.assigned_at
        }
    }


@router.get("/patients")
def get_assigned_patients(
    physiotherapist_id: int,
    db: Session = Depends(get_db)
):

    physiotherapist = (
        db.query(User)
        .filter(User.id == physiotherapist_id)
        .first()
    )

    if not physiotherapist or physiotherapist.role != "physiotherapist":
        raise HTTPException(
            status_code=403,
            detail="Invalid physiotherapist account."
        )

    assignments = (
        db.query(Assignment)
        .filter(
            Assignment.physiotherapist_id == physiotherapist_id,
            Assignment.status == "active"
        )
        .all()
    )

    patients = []

    for assignment in assignments:

        patient = (
            db.query(User)
            .filter(User.id == assignment.patient_id)
            .first()
        )

        if patient:
            patients.append({
                "id": patient.id,
                "name": patient.name,
                "email": patient.email,
                "assignment_id": assignment.id,
                "assigned_at": assignment.assigned_at
            })

    return patients


@router.get("/physiotherapists")
def get_physiotherapists(
    admin_id: int,
    db: Session = Depends(get_db)
):

    admin = (
        db.query(User)
        .filter(User.id == admin_id)
        .first()
    )

    if not admin or admin.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only administrators can access this."
        )

    physiotherapists = (
        db.query(User)
        .filter(User.role == "physiotherapist")
        .all()
    )

    return [
        {
            "id": item.id,
            "name": item.name,
            "email": item.email
        }
        for item in physiotherapists
    ]


@router.get("/all")
def get_all_assignments(
    admin_id: int,
    db: Session = Depends(get_db)
):

    admin = (
        db.query(User)
        .filter(User.id == admin_id)
        .first()
    )

    if not admin or admin.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only administrators can access assignments."
        )

    assignments = (
        db.query(Assignment)
        .order_by(Assignment.assigned_at.desc())
        .all()
    )

    result = []

    for assignment in assignments:

        patient = (
            db.query(User)
            .filter(User.id == assignment.patient_id)
            .first()
        )

        physiotherapist = (
            db.query(User)
            .filter(
                User.id == assignment.physiotherapist_id
            )
            .first()
        )

        result.append({
            "id": assignment.id,
            "patient_id": assignment.patient_id,
            "patient_name": patient.name if patient else "Unknown",
            "physiotherapist_id": assignment.physiotherapist_id,
            "physiotherapist_name": (
                physiotherapist.name
                if physiotherapist
                else "Unknown"
            ),
            "status": assignment.status,
            "assigned_at": assignment.assigned_at
        })

    return result


@router.delete("/{assignment_id}")
def remove_assignment(
    assignment_id: int,
    admin_id: int,
    db: Session = Depends(get_db)
):

    admin = (
        db.query(User)
        .filter(User.id == admin_id)
        .first()
    )

    if not admin or admin.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only administrators can remove assignments."
        )

    assignment = (
        db.query(Assignment)
        .filter(Assignment.id == assignment_id)
        .first()
    )

    if not assignment:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found."
        )

    assignment.status = "inactive"

    db.commit()

    return {
        "success": True,
        "message": "Assignment removed successfully."
    }