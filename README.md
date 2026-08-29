RiskShield AI
AI-Powered Transaction Fraud & Risk Manager

RiskShield AI is a machine-learning-based transaction risk detection system designed to identify suspicious payment behaviour and convert ML predictions into explainable, actionable risk decisions.

The system analyzes transaction characteristics such as transaction amount, transaction velocity, device/location changes, failed payment attempts, account age, geographic distance, and transaction time.

It produces:

 Fraud probability
 Risk level
 Recommended action
 Explainable risk signals
 Model performance metrics
 Business impact estimates


**Problem**

Payment platforms need to detect fraudulent activity without unnecessarily affecting legitimate customers.
A fraud detection system therefore needs to balance two different risks:

**False Negatives:** fraudulent transactions that are missed.

**False Positives:** legitimate transactions that are incorrectly flagged.

RiskShield AI addresses this using an XGBoost fraud classifier combined with a configurable decision threshold and explainable risk signals.

##  Solution

RiskShield AI follows the pipeline:

Transaction Data
       │
       ▼
Feature Processing
       │
       ▼
XGBoost Fraud Model
       │
       ▼
Fraud Probability
       │
       ▼
Risk Decision Engine
       │
   ┌───┴───────────┐
   ▼               ▼
Risk Level     Recommended
                 Action
       │
       ▼
Risk Explanation
       │
       ▼
React Dashboard
```

The system is designed as a **defense-oriented risk assessment prototype**. It does not automatically execute irreversible financial actions.


## Machine Learning

### Model

**XGBoost Classifier**

The model was trained using a synthetic transaction dataset containing:

* **20,000 total transactions**
* **831 fraudulent transactions**
* **19,169 legitimate transactions**
* **4.15% fraud rate**

### Features

The model uses the following transaction and behavioural features:

amount
account_age_days
transactions_last_10min
transactions_last_1hr
avg_transaction_amount
failed_attempts
is_new_device
is_new_location
distance_from_usual_location
hour

### Data Split

Training Set      13,999 transactions
Validation Set     3,001 transactions
Held-out Test      3,000 transactions


The final test set was kept separate from model threshold selection and was used for final evaluation.


## Model Performance

### Held-out Test Results

| Metric    |     Result |
| --------- | ---------: |
| ROC-AUC   | **80.65%** |
| Precision | **30.53%** |
| Recall    | **32.00%** |
| F1 Score  | **31.25%** |

### Decision Threshold

The decision threshold selected using the validation set was:

**65%**

Transactions above the selected fraud-probability threshold are classified as high risk and sent for further review.

---

##  Explainable Risk Signals

RiskShield presents the behavioural signals associated with a transaction so that users can understand why a transaction received its risk assessment.

Example signals include:

* Unusually high transaction amount
* High transaction velocity
* New device
* New location
* Large distance from usual location
* Multiple failed payment attempts
* Recently created account
* Unusual transaction hour

The current UI presents these as **risk signals**. They should not be interpreted as direct model feature-importance scores unless a dedicated explainability method such as SHAP is used.


##  Risk Decisions

The system uses the model probability together with the configured threshold to classify transactions.

Example actions:

LOW RISK
   ↓
ALLOW

MEDIUM RISK
   ↓
REVIEW

HIGH RISK
   ↓
MANUAL_REVIEW

The purpose of the recommended action is to support human review rather than automatically making an irreversible financial decision.

## Business Impact Analysis

The held-out test set produced:

False Positives: 91
False Negatives: 85

Using the project's illustrative cost assumptions:

False-positive cost: ₹200
False-negative cost: ₹5,000

the estimated error cost is:

False-positive cost = 91 × ₹200
                    = ₹18,200

False-negative cost = 85 × ₹5,000
                    = ₹4,25,000

Total estimated error cost
                    = ₹4,43,200
These figures are **illustrative estimates based on the synthetic test data and assumed costs**. They are not actual Razorpay financial-loss figures.

##  Application Features

### Transaction Analysis

Users can enter transaction characteristics and send them to the fraud detection API.

### AI Risk Assessment

The dashboard displays:

* Risk score
* Risk level
* Recommended action
* Decision threshold
* Risk explanation

### Risk Signal Analysis

Behavioural indicators are visualized to make the risk assessment easier to understand.

### Transaction History

The frontend keeps a session-level history of analyzed transactions.

### Model Performance

The dashboard displays the final held-out test metrics.

### Business Impact

The dashboard displays the estimated cost of false-positive and false-negative decisions.

##  Technology Stack

### Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* XGBoost
* Joblib

### Backend

* FastAPI
* Uvicorn
* Pydantic

### Frontend

* React
* Vite
* CSS

### Development

* Visual Studio Code
* Git
* GitHub


##  Project Structure

riskshield-ai/
│
├── backend/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── ModelPerformance.jsx
│   │   ├── RiskSignals.jsx
│   │   ├── BusinessImpact.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── ml/
│   ├── generate_data.py
│   ├── train.py
│   ├── fraud_model.pkl
│   ├── threshold.txt
│   └── features.txt
│
├── .gitignore
└── README.md

#  Getting Started

## 1. Clone the repository

git clone https://github.com/aiswaryaav03/riskshield-ai.git
cd riskshield-ai

## 2. Generate the dataset

Navigate to the ML folder:


cd ml

Install the Python dependencies if necessary:


pip install pandas numpy scikit-learn xgboost joblib


Generate the synthetic transaction dataset:


python generate_data.py

This creates:


transactions.csv


The generated CSV is intentionally excluded from version control.

## 3. Train the model

From the `ml` directory:

python train.py

This produces:


fraud_model.pkl
threshold.txt
features.txt

## 4. Start the backend

Open another terminal:

cd backend

Install backend requirements:


pip install -r requirements.txt


Start FastAPI:

uvicorn main:app --reload

The API will be available at:


http://127.0.0.1:8000

Swagger API documentation:


http://127.0.0.1:8000/docs



## 5. Start the frontend

Open another terminal:

cd frontend

Install Node dependencies:


npm install


Start the development server:


npm run dev


The frontend will normally be available at:


http://localhost:5173

##  Example Transaction

### Suspicious Transaction


{
  "amount": 45000,
  "account_age_days": 5,
  "transactions_last_10min": 8,
  "transactions_last_1hr": 15,
  "avg_transaction_amount": 1800,
  "failed_attempts": 3,
  "is_new_device": 1,
  "is_new_location": 1,
  "distance_from_usual_location": 1200,
  "hour": 2
}


Example result from the current model:

Risk Score: 96.57%
Risk Level: HIGH
Recommended Action: MANUAL_REVIEW


##  Normal Transaction Example

{
  "amount": 500,
  "account_age_days": 500,
  "transactions_last_10min": 1,
  "transactions_last_1hr": 2,
  "avg_transaction_amount": 600,
  "failed_attempts": 0,
  "is_new_device": 0,
  "is_new_location": 0,
  "distance_from_usual_location": 5,
  "hour": 14
}

Example result from the current model:

Risk Score: 2.67%
Risk Level: LOW
Recommended Action: ALLOW


##  Design Philosophy

RiskShield AI focuses on:

**Detection → Explanation → Decision Support → Auditability**

Rather than relying only on a binary fraud label, the system provides a risk score and supporting behavioural signals so that a merchant or risk analyst can make a more informed decision.



##  Limitations

This is a prototype built using synthetic transaction data.

The current model should not be considered suitable for production financial decisions without:

* Real-world transaction data
* Stronger validation
* Calibration and threshold analysis
* Continuous monitoring
* Drift detection
* Privacy and security controls
* Production-grade infrastructure
* Human oversight

The reported metrics are therefore prototype evaluation results rather than production performance guarantees.


##  Future Improvements

Potential future improvements include:

* SHAP-based model explanations
* Real-time transaction streaming
* Persistent transaction and audit storage
* Model monitoring and drift detection
* Better threshold optimization based on business costs
* Analyst feedback loops
* Continuous model retraining
* Production deployment
* Additional fraud and chargeback detection models


##  Author

**Aiswarya AV**

GitHub:

https://github.com/aiswaryaav03
