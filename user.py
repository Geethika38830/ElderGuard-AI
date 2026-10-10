from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database.connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    password = Column(
        String,
        nullable=False
    )

    # User role
    # patient / physiotherapist / admin
    role = Column(
        String,
        nullable=False,
        default="patient"
    )

    # Subscription plan
    # free / plus / professional
    subscription_plan = Column(
        String,
        nullable=False,
        default="free"
    )

    # Subscription status
    # active / inactive
    subscription_status = Column(
        String,
        nullable=False,
        default="inactive"
    )

    # Subscription expiry date
    subscription_expiry = Column(
        DateTime,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )