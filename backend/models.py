from sqlalchemy import Column, Integer, Float, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

# ==============================
# Table 1 — Loan Applications
# Stores customer input data
# ==============================
class LoanApplication(Base):
    __tablename__ = "loan_applications"

    id              = Column(Integer, primary_key=True, index=True)
    age             = Column(Integer, nullable=False)
    sex             = Column(Integer, nullable=False)
    job             = Column(Integer, nullable=False)
    housing         = Column(Integer, nullable=False)
    saving_accounts = Column(Integer, nullable=False)
    checking_account= Column(Integer, nullable=False)
    credit_amount   = Column(Float, nullable=False)
    duration        = Column(Integer, nullable=False)
    purpose         = Column(Integer, nullable=False)
    created_at      = Column(DateTime, default=datetime.utcnow)

    # One application → one prediction
    prediction      = relationship("PredictionHistory", back_populates="application", uselist=False)


# ==============================
# Table 2 — Prediction History
# Stores ML results and SHAP explanation
# ==============================
class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id              = Column(Integer, primary_key=True, index=True)
    application_id  = Column(Integer, ForeignKey("loan_applications.id"))
    prediction      = Column(String, nullable=False)   # "Approved" or "Rejected"
    probability     = Column(Float, nullable=False)    # e.g. 0.93
    credit_score    = Column(Integer, nullable=False)  # e.g. 820
    risk_level      = Column(String, nullable=False)   # "Low Risk" / "Medium Risk" / "High Risk"
    top_reasons     = Column(Text, nullable=False)     # JSON string of SHAP values
    predicted_at    = Column(DateTime, default=datetime.utcnow)

    # Link back to the application
    application     = relationship("LoanApplication", back_populates="prediction")
    