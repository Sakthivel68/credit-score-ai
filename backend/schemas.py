from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# ==============================
# Input Schema
# What React sends to FastAPI
# ==============================
class LoanApplicationRequest(BaseModel):
    age               : int   = Field(..., ge=18, le=100, description="Customer age")
    sex               : int   = Field(..., ge=0, le=1,   description="0 = Female, 1 = Male")
    job               : int   = Field(..., ge=0, le=3,   description="Job skill level 0-3")
    housing           : int   = Field(..., ge=0, le=2,   description="0=Free, 1=Own, 2=Rent")
    saving_accounts   : int   = Field(..., ge=0, le=4,   description="0=None to 4=Rich")
    checking_account  : int   = Field(..., ge=0, le=3,   description="0=None to 3=Rich")
    credit_amount     : float = Field(..., gt=0,         description="Loan amount in DM")
    duration          : int   = Field(..., gt=0,         description="Loan duration in months")
    purpose           : int   = Field(..., ge=0, le=7,   description="Purpose category 0-7")

    class Config:
        json_schema_extra = {
            "example": {
                "age": 35,
                "sex": 1,
                "job": 2,
                "housing": 1,
                "saving_accounts": 2,
                "checking_account": 1,
                "credit_amount": 5000.0,
                "duration": 24,
                "purpose": 3
            }
        }


# ==============================
# SHAP Feature Contribution
# One feature and its impact value
# ==============================
class FeatureContribution(BaseModel):
    feature    : str
    contribution: float


# ==============================
# Output Schema
# What FastAPI sends back to React
# ==============================
class PredictionResponse(BaseModel):
    application_id  : int
    prediction      : str        # "Approved" or "Rejected"
    probability     : float      # 0.0 to 1.0
    credit_score    : int        # 300 to 850
    risk_level      : str        # "Low Risk" / "Medium Risk" / "High Risk"
    top_reasons     : list[FeatureContribution]
    predicted_at    : datetime


# ==============================
# History Schema
# Used when returning prediction history list
# ==============================
class HistoryResponse(BaseModel):
    id              : int
    application_id  : int
    prediction      : str
    probability     : float
    credit_score    : int
    risk_level      : str
    predicted_at    : datetime

    class Config:
        from_attributes = True
        