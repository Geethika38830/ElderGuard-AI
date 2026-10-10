# AI-Based Elderly Fall Risk Prediction and Health Monitoring Web Application

An AI-powered web application designed to assess and predict fall risk among elderly individuals using health, mobility, activity, and previous fall-related information.

## Features

- Elderly health and activity assessment
- AI-based fall-risk prediction
- Low / Moderate / High risk classification
- Risk score
- Risk factor identification
- Personalized preventive recommendations
- Health monitoring dashboard
- Risk history
- Risk trend visualization
- Caregiver-oriented monitoring
- REST API using FastAPI

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Material UI
- Recharts
- Axios

### Backend
- Python
- FastAPI
- SQLAlchemy
- SQLite

### Machine Learning
- Python
- Pandas
- NumPy
- Scikit-learn
- Random Forest

## Architecture

React Frontend
        |
        v
FastAPI Backend
        |
        +---- PostgreSQL/SQLite Database
        |
        +---- Machine Learning Model
                    |
                    v
             Fall Risk Prediction
                    |
          Low / Moderate / High
                    |
                    v
        Dashboard + Recommendations

## Disclaimer

This application is intended as an AI-based risk-screening and decision-support prototype. It is not intended to diagnose medical conditions or replace professional medical assessment.