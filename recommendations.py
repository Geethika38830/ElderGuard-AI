def generate_recommendations(risk_level, risk_factors):
    recommendations = []

    if "Balance problems" in risk_factors:
        recommendations.append(
            "Practice balance and stability exercises regularly."
        )

    if "Mobility difficulty" in risk_factors or "Walking difficulty" in risk_factors:
        recommendations.append(
            "Use appropriate walking support and avoid walking on unsafe surfaces."
        )

    if "Previous fall history" in risk_factors or "Multiple previous falls" in risk_factors:
        recommendations.append(
            "Discuss previous falls with a healthcare professional and review fall-prevention measures."
        )

    if "Dizziness" in risk_factors:
        recommendations.append(
            "Stand up slowly and seek medical advice if dizziness occurs frequently."
        )

    if "Low physical activity" in risk_factors:
        recommendations.append(
            "Increase safe daily physical activity gradually according to individual ability."
        )

    if "Weakness or fatigue" in risk_factors:
        recommendations.append(
            "Maintain adequate rest, nutrition, hydration, and safe strengthening activities."
        )

    if "Medication-related risk" in risk_factors:
        recommendations.append(
            "Ask a healthcare professional to review medications that may affect balance or alertness."
        )

    if not recommendations:
        recommendations.append(
            "Maintain regular physical activity, good lighting, safe surroundings, and routine health monitoring."
        )

    if risk_level == "High":
        recommendations.append(
            "High-risk result: consider discussing the assessment with a healthcare professional or caregiver."
        )

    elif risk_level == "Moderate":
        recommendations.append(
            "Moderate-risk result: continue monitoring and take preventive measures to reduce fall risk."
        )

    else:
        recommendations.append(
            "Continue healthy activity and regular monitoring to maintain a low fall-risk profile."
        )

    return recommendations