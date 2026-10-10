from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from app.database.connection import Base


class FollowUp(Base):
    __tablename__ = "followups"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    patient_id = Column(
        Integer,
        nullable=False,
        index=True
    )

    physiotherapist_id = Column(
        Integer,
        nullable=False,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    notes = Column(
        Text,
        nullable=True
    )

    status = Column(
        String,
        nullable=False,
        default="pending"
    )

    followup_date = Column(
        DateTime,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )