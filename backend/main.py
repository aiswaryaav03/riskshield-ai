from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="RiskShield AI",
    description="AI-powered transaction fraud detection API",
    version="1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# LOAD MODEL
# =========================================================

model = joblib.load("../ml/fraud_model.pkl")

with open("../ml/threshold.txt", "r") as f:
    threshold = float(f.read())


# =========================================================
# FEATURES
# =========================================================

FEATURES = [
    "amount",
    "account_age_days",
    "transactions_last_10min",
    "transactions_last_1hr",
    "avg_transaction_amount",
    "failed_attempts",
    "is_new_device",
    "is_new_location",
    "distance_from_usual_location",
    "hour"
]


# =========================================================
# INPUT FORMAT
# =========================================================

class Transaction(BaseModel):
    amount: float
    account_age_days: int
    transactions_last_10min: int
    transactions_last_1hr: int
    avg_transaction_amount: float
    failed_attempts: int
    is_new_device: int
    is_new_location: int
    distance_from_usual_location: float
    hour: int


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    return {
        "message": "RiskShield AI API is running",
        "model": "XGBoost",
        "threshold": threshold
    }


# =========================================================
# PREDICT
# =========================================================

@app.post("/predict")
def predict(transaction: Transaction):

    # Convert Pydantic object to dictionary
    data = {
        "amount": transaction.amount,
        "account_age_days": transaction.account_age_days,
        "transactions_last_10min": transaction.transactions_last_10min,
        "transactions_last_1hr": transaction.transactions_last_1hr,
        "avg_transaction_amount": transaction.avg_transaction_amount,
        "failed_attempts": transaction.failed_attempts,
        "is_new_device": transaction.is_new_device,
        "is_new_location": transaction.is_new_location,
        "distance_from_usual_location":
            transaction.distance_from_usual_location,
        "hour": transaction.hour
    }

    # Create dataframe
    df = pd.DataFrame(
        [data],
        columns=FEATURES
    )

    # -----------------------------------------------------
    # ML prediction
    # -----------------------------------------------------

    probability = float(
        model.predict_proba(df)[0][1]
    )

    risk_score = round(
        probability * 100,
        2
    )


    # -----------------------------------------------------
    # Risk level
    # -----------------------------------------------------

    if probability < 0.30:

        risk_level = "LOW"
        action = "ALLOW"

    elif probability < threshold:

        risk_level = "MEDIUM"
        action = "REVIEW"

    else:

        risk_level = "HIGH"
        action = "MANUAL_REVIEW"


    # -----------------------------------------------------
    # Explanation
    # -----------------------------------------------------

    reasons = []

    if transaction.amount > 20000:
        reasons.append(
            "Transaction amount is unusually high"
        )

    if transaction.transactions_last_10min >= 4:
        reasons.append(
            "High transaction velocity"
        )

    if transaction.failed_attempts >= 2:
        reasons.append(
            "Multiple failed payment attempts"
        )

    if transaction.is_new_device == 1:
        reasons.append(
            "Transaction originated from a new device"
        )

    if transaction.is_new_location == 1:
        reasons.append(
            "Transaction originated from a new location"
        )

    if transaction.distance_from_usual_location > 500:
        reasons.append(
            "Large distance from usual location"
        )

    if transaction.account_age_days < 30:
        reasons.append(
            "Recently created account"
        )

    if transaction.hour <= 4:
        reasons.append(
            "Transaction occurred during unusual hours"
        )

    if len(reasons) == 0:

        reasons.append(
            "No major suspicious behavioural indicators detected"
        )


    # -----------------------------------------------------
    # Return result
    # -----------------------------------------------------

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "recommended_action": action,
        "reasons": reasons,
        "model": "XGBoost",
        "threshold": round(threshold * 100, 2)
    }