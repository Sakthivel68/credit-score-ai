from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import joblib
import numpy as np
import pandas as pd
import shap
import json
import os

from database import engine, get_db, Base
from models import LoanApplication, PredictionHistory
from schemas import LoanApplicationRequest, PredictionResponse, FeatureContribution, HistoryResponse

# ==============================
# Create Database Tables
# ==============================
Base.metadata.create_all(bind=engine)

# ==============================
# Initialize FastAPI App
# ==============================
app = FastAPI(
    title="Credit Score AI API",
    description="Explainable AI-Based Credit Scoring and Loan Approval System",
    version="1.0.0"
)

# ==============================
# CORS — Allow React to talk to FastAPI
# ==============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# Load ML Model
# ==============================
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/random_forest_model.pkl")

try:
    model = joblib.load(MODEL_PATH)
    explainer = shap.TreeExplainer(model)
    print("✅ Model and SHAP Explainer loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    raise RuntimeError("Model could not be loaded.")

# ==============================
# Feature Names — must match training data
# ==============================
FEATURE_NAMES = [
    "Age", "Sex", "Job", "Housing",
    "Saving accounts", "Checking account",
    "Credit amount", "Duration", "Purpose"
]

# ==============================
# Credit Score Calculator
# ==============================
def calculate_credit_score(probability: float) -> int:
    min_score = 300
    max_score = 850
    score = min_score + (probability * (max_score - min_score))
    return int(round(score))

# ==============================
# Risk Level Calculator
# ==============================
def get_risk_level(score: int) -> str:
    if score >= 800:
        return "Low Risk"
    elif score >= 650:
        return "Medium Risk"
    else:
        return "High Risk"

# ==============================
# SHAP Value Extractor
# ==============================
def get_shap_contributions(sample_df: pd.DataFrame) -> list:
    shap_values = explainer.shap_values(sample_df)

    if isinstance(shap_values, list):
        class1_shap = shap_values[1][0]
    else:
        class1_shap = shap_values[0, :, 1]

    contributions = []
    for feature, value in zip(FEATURE_NAMES, class1_shap):
        contributions.append({
            "feature": feature,
            "contribution": round(float(value), 4)
        })

    contributions.sort(key=lambda x: abs(x["contribution"]), reverse=True)
    return contributions

# ==============================
# Health Check Endpoint
# ==============================
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "Credit Score AI API is running",
        "timestamp": datetime.utcnow()
    }

# ==============================
# Predict Endpoint
# ==============================
@app.post("/predict", response_model=PredictionResponse)
def predict(request: LoanApplicationRequest, db: Session = Depends(get_db)):
    try:
        input_data = pd.DataFrame([{
            "Age"              : request.age,
            "Sex"              : request.sex,
            "Job"              : request.job,
            "Housing"          : request.housing,
            "Saving accounts"  : request.saving_accounts,
            "Checking account" : request.checking_account,
            "Credit amount"    : request.credit_amount,
            "Duration"         : request.duration,
            "Purpose"          : request.purpose
        }])

        prediction_raw  = model.predict(input_data)[0]
        probability_raw = model.predict_proba(input_data)[0]
        approval_prob   = float(probability_raw[1])

        prediction_label = "Approved" if prediction_raw == 1 else "Rejected"
        credit_score = calculate_credit_score(approval_prob)
        risk_level   = get_risk_level(credit_score)
        contributions = get_shap_contributions(input_data)

        application = LoanApplication(
            age              = request.age,
            sex              = request.sex,
            job              = request.job,
            housing          = request.housing,
            saving_accounts  = request.saving_accounts,
            checking_account = request.checking_account,
            credit_amount    = request.credit_amount,
            duration         = request.duration,
            purpose          = request.purpose
        )
        db.add(application)
        db.commit()
        db.refresh(application)

        prediction_record = PredictionHistory(
            application_id = application.id,
            prediction     = prediction_label,
            probability    = approval_prob,
            credit_score   = credit_score,
            risk_level     = risk_level,
            top_reasons    = json.dumps(contributions)
        )
        db.add(prediction_record)
        db.commit()
        db.refresh(prediction_record)

        return PredictionResponse(
            application_id = application.id,
            prediction     = prediction_label,
            probability    = round(approval_prob, 4),
            credit_score   = credit_score,
            risk_level     = risk_level,
            top_reasons    = [FeatureContribution(**c) for c in contributions],
            predicted_at   = prediction_record.predicted_at
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==============================
# History Endpoint
# ==============================
@app.get("/history", response_model=list[HistoryResponse])
def get_history(db: Session = Depends(get_db)):
    records = db.query(PredictionHistory).order_by(
        PredictionHistory.predicted_at.desc()
    ).all()
    return records