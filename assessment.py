from pydantic import BaseModel, Field


class AssessmentCreate(BaseModel):

    # Patient information

    elderly_name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    age: int = Field(
        ...,
        ge=1,
        le=120
    )

    gender: str = Field(
        ...,
        min_length=1
    )

    height: float = Field(
        ...,
        gt=0,
        le=250
    )

    weight: float = Field(
        ...,
        gt=0,
        le=300
    )


    # Activity

    daily_steps: int = Field(
        default=0,
        ge=0
    )

    exercise_days: int = Field(
        default=0,
        ge=0,
        le=7
    )


    # Physical condition

    mobility: int = Field(
        default=3,
        ge=1,
        le=5
    )

    balance: int = Field(
        default=3,
        ge=1,
        le=5
    )

    walking_difficulty: int = Field(
        default=3,
        ge=1,
        le=5
    )


    # Fall history

    previous_falls: int = Field(
        default=0,
        ge=0
    )

    near_falls: int = Field(
        default=0,
        ge=0
    )


    # Symptoms

    dizziness: int = Field(
        default=1,
        ge=1,
        le=5
    )

    weakness: int = Field(
        default=1,
        ge=1,
        le=5
    )


    # Medication

    medication_risk: bool = False


class AssessmentResponse(BaseModel):

    id: int

    elderly_name: str

    risk_score: int

    risk_level: str

    risk_factors: list[str]

    recommendations: list[str]