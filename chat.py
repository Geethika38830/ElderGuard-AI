from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.models.assignment import Assignment
from app.models.message import Message


router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"]
)


def get_user(
    user_id: int,
    db: Session
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

    return user


def check_chat_access(
    patient_id: int,
    physiotherapist_id: int,
    db: Session
):

    patient = get_user(
        patient_id,
        db
    )

    physiotherapist = get_user(
        physiotherapist_id,
        db
    )

    if patient.role != "patient":
        raise HTTPException(
            status_code=400,
            detail="Invalid patient account."
        )

    if physiotherapist.role != "physiotherapist":
        raise HTTPException(
            status_code=400,
            detail="Invalid physiotherapist account."
        )

    if patient.subscription_plan != "plus":
        raise HTTPException(
            status_code=403,
            detail="Patient Plus subscription is required for chat."
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
            detail="This physiotherapist is not assigned to the patient."
        )


@router.get("/conversation")
def get_conversation(
    patient_id: int,
    physiotherapist_id: int,
    db: Session = Depends(get_db)
):

    check_chat_access(
        patient_id,
        physiotherapist_id,
        db
    )

    messages = (
        db.query(Message)
        .filter(
            (
                (Message.sender_id == patient_id)
                & (Message.receiver_id == physiotherapist_id)
            )
            |
            (
                (Message.sender_id == physiotherapist_id)
                & (Message.receiver_id == patient_id)
            )
        )
        .order_by(
            Message.created_at.asc()
        )
        .all()
    )

    return [
        {
            "id": item.id,
            "sender_id": item.sender_id,
            "receiver_id": item.receiver_id,
            "message": item.message,
            "created_at": item.created_at,
            "read_status": item.read_status
        }
        for item in messages
    ]


@router.post("/send")
def send_message(
    sender_id: int,
    receiver_id: int,
    message: str,
    db: Session = Depends(get_db)
):

    sender = get_user(
        sender_id,
        db
    )

    receiver = get_user(
        receiver_id,
        db
    )

    patient_id = (
        sender_id
        if sender.role == "patient"
        else receiver_id
    )

    physiotherapist_id = (
        sender_id
        if sender.role == "physiotherapist"
        else receiver_id
    )

    check_chat_access(
        patient_id,
        physiotherapist_id,
        db
    )

    if not message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty."
        )

    new_message = Message(
        sender_id=sender_id,
        receiver_id=receiver_id,
        message=message.strip(),
        read_status="unread"
    )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return {
        "success": True,
        "message": {
            "id": new_message.id,
            "sender_id": new_message.sender_id,
            "receiver_id": new_message.receiver_id,
            "message": new_message.message,
            "created_at": new_message.created_at
        }
    }