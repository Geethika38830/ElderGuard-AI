def calculate_fall_risk(data):
    score = 0
    factors = []

    # Age
    age = data.get("age", 0)
    if age >= 80:
        score += 20
        factors.append("Advanced age")
    elif age >= 70:
        score += 15
        factors.append("Age-related risk")
    elif age >= 60:
        score += 10

    # Previous falls
    previous_falls = data.get("previous_falls", 0)
    if previous_falls >= 2:
        score += 25
        factors.append("Multiple previous falls")
    elif previous_falls == 1:
        score += 15
        factors.append("Previous fall history")

    # Near falls
    near_falls = data.get("near_falls", 0)
    if near_falls >= 2:
        score += 10
        factors.append("Frequent near-falls")
    elif near_falls == 1:
        score += 5
        factors.append("Previous near-fall")

    # Mobility
    mobility = data.get("mobility_difficulty", False)
    if mobility:
        score += 15
        factors.append("Mobility difficulty")

    # Balance
    balance = data.get("balance_problem", False)
    if balance:
        score += 15
        factors.append("Balance problems")

    # Dizziness
    dizziness = data.get("dizziness", False)
    if dizziness:
        score += 10
        factors.append("Dizziness")

    # Weakness
    weakness = data.get("weakness", False)
    if weakness:
        score += 5
        factors.append("Weakness or fatigue")

    # Physical activity
    activity = data.get("activity_level", "moderate")

    if activity == "low":
        score += 10
        factors.append("Low physical activity")
    elif activity == "moderate":
        score += 5

    # Walking difficulty
    walking_difficulty = data.get("walking_difficulty", False)
    if walking_difficulty:
        score += 10
        factors.append("Walking difficulty")

    # Medication risk
    medication_risk = data.get("medication_risk", False)
    if medication_risk:
        score += 5
        factors.append("Medication-related risk")

    # Limit score to 100
    score = min(score, 100)

    # Risk classification
    if score <= 30:
        risk_level = "Low"
    elif score <= 60:
        risk_level = "Moderate"
    else:
        risk_level = "High"

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "risk_factors": factors
    }