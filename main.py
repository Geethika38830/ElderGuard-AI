from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database.connection import Base, engine

# =========================================================
# MODELS
# =========================================================

from app.models import (
    User,
    Assessment,
    Assignment,
    Message,
    FollowUp
)


# =========================================================
# ROUTERS
# =========================================================

from app.routers.auth import (
    router as auth_router
)

from app.routers.assessment import (
    router as assessment_router
)

from app.routers.dashboard import (
    router as dashboard_router
)

from app.routers.assignment import (
    router as assignment_router
)

from app.routers.physiotherapist import (
    router as physiotherapist_router
)

from app.routers.patient import (
    router as patient_router
)

from app.routers.admin import (
    router as admin_router
)

from app.routers.chat import (
    router as chat_router
)

from app.routers.subscription import (
    router as subscription_router
)


# =========================================================
# DATABASE SETUP
# =========================================================

# Create all tables that do not already exist.
#
# This includes:
#
# users
# assessments
# assignments
# messages
# followups
#
Base.metadata.create_all(
    bind=engine
)


# =========================================================
# SAFE USER TABLE MIGRATION
# =========================================================

def migrate_users_table():
    """
    Add role and subscription-related columns
    to an existing users table without deleting
    existing users.
    """

    with engine.begin() as connection:

        result = connection.execute(
            text(
                "PRAGMA table_info(users)"
            )
        )

        existing_columns = {
            row[1]
            for row in result.fetchall()
        }


        # =================================================
        # ROLE
        # =================================================

        if "role" not in existing_columns:

            connection.execute(
                text(
                    """
                    ALTER TABLE users
                    ADD COLUMN role VARCHAR
                    DEFAULT 'patient'
                    """
                )
            )


        # =================================================
        # SUBSCRIPTION PLAN
        # =================================================

        if (
            "subscription_plan"
            not in existing_columns
        ):

            connection.execute(
                text(
                    """
                    ALTER TABLE users
                    ADD COLUMN subscription_plan VARCHAR
                    DEFAULT 'free'
                    """
                )
            )


        # =================================================
        # SUBSCRIPTION STATUS
        # =================================================

        if (
            "subscription_status"
            not in existing_columns
        ):

            connection.execute(
                text(
                    """
                    ALTER TABLE users
                    ADD COLUMN subscription_status VARCHAR
                    DEFAULT 'inactive'
                    """
                )
            )


        # =================================================
        # SUBSCRIPTION EXPIRY
        # =================================================

        if (
            "subscription_expiry"
            not in existing_columns
        ):

            connection.execute(
                text(
                    """
                    ALTER TABLE users
                    ADD COLUMN subscription_expiry DATETIME
                    """
                )
            )


        # =================================================
        # CREATED AT
        # =================================================

        if (
            "created_at"
            not in existing_columns
        ):

            connection.execute(
                text(
                    """
                    ALTER TABLE users
                    ADD COLUMN created_at DATETIME
                    """
                )
            )


        # =================================================
        # FIX EXISTING USERS
        # =================================================

        connection.execute(
            text(
                """
                UPDATE users
                SET role = 'patient'
                WHERE role IS NULL
                """
            )
        )


        connection.execute(
            text(
                """
                UPDATE users
                SET subscription_plan = 'free'
                WHERE subscription_plan IS NULL
                """
            )
        )


        connection.execute(
            text(
                """
                UPDATE users
                SET subscription_status = 'inactive'
                WHERE subscription_status IS NULL
                """
            )
        )


# Run migration
migrate_users_table()


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(

    title=(
        "ElderCare AI - Elderly "
        "Fall Risk & Health Monitoring"
    ),

    description=(
        "AI-based elderly fall-risk screening "
        "and health-monitoring web application "
        "with patient, physiotherapist and "
        "administrator workflows."
    ),

    version="3.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# =========================================================
# CORE ROUTERS
# =========================================================

app.include_router(
    auth_router
)

app.include_router(
    assessment_router
)

app.include_router(
    dashboard_router
)


# =========================================================
# ROLE / PLATFORM ROUTERS
# =========================================================

app.include_router(
    assignment_router
)

app.include_router(
    physiotherapist_router
)

app.include_router(
    patient_router
)

app.include_router(
    admin_router
)

app.include_router(
    chat_router
)

app.include_router(
    subscription_router
)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {

        "message": (
            "ElderCare AI "
            "Health Monitoring API is running"
        ),

        "status": "healthy",

        "version": "3.0.0",

        "modules": [
            "authentication",
            "fall-risk assessment",
            "patient dashboard",
            "patient progress",
            "physiotherapist dashboard",
            "patient assignment",
            "risk monitoring",
            "follow-ups",
            "patient subscription",
            "physiotherapist chat",
            "admin dashboard"
        ]

    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "database": "connected"
    }