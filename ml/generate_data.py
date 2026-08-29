import pandas as pd
import numpy as np

np.random.seed(42)

N = 20000

# ---------------------------------------------------------
# Basic information
# ---------------------------------------------------------

transaction_id = [f"TXN{i:05d}" for i in range(1, N + 1)]

customer_id = [
    f"CUST{np.random.randint(1, 5001):05d}"
    for _ in range(N)
]

# ---------------------------------------------------------
# Transaction features
# ---------------------------------------------------------

amount = np.round(
    np.random.lognormal(mean=6.5, sigma=1.0, size=N),
    2
)

amount = np.clip(amount, 50, 100000)

account_age_days = np.random.randint(1, 2000, N)

transactions_last_10min = np.random.poisson(1.5, N)
transactions_last_10min = np.clip(
    transactions_last_10min, 0, 15
)

transactions_last_1hr = (
    transactions_last_10min
    + np.random.poisson(3, N)
)

transactions_last_1hr = np.clip(
    transactions_last_1hr, 0, 30
)

avg_transaction_amount = np.round(
    np.random.lognormal(mean=6.0, sigma=0.7, size=N),
    2
)

avg_transaction_amount = np.clip(
    avg_transaction_amount,
    50,
    30000
)

failed_attempts = np.random.poisson(0.5, N)
failed_attempts = np.clip(
    failed_attempts,
    0,
    8
)

is_new_device = np.random.binomial(
    1,
    0.15,
    N
)

is_new_location = np.random.binomial(
    1,
    0.12,
    N
)

distance_from_usual_location = np.round(
    np.random.exponential(scale=30, size=N),
    2
)

distance_from_usual_location = np.clip(
    distance_from_usual_location,
    0,
    3000
)

hour = np.random.randint(0, 24, N)

# ---------------------------------------------------------
# Stronger fraud signal
# ---------------------------------------------------------

fraud_score = np.zeros(N)

# Large transaction
fraud_score += np.where(
    amount > 15000,
    2.5,
    0
)

# Very large transaction
fraud_score += np.where(
    amount > 30000,
    2.5,
    0
)

# High transaction velocity
fraud_score += np.where(
    transactions_last_10min >= 4,
    2.5,
    0
)

fraud_score += np.where(
    transactions_last_1hr >= 10,
    2.0,
    0
)

# Failed payment attempts
fraud_score += np.where(
    failed_attempts >= 2,
    2.0,
    0
)

fraud_score += np.where(
    failed_attempts >= 4,
    1.5,
    0
)

# New device / location
fraud_score += is_new_device * 1.8
fraud_score += is_new_location * 1.8

# Large geographical movement
fraud_score += np.where(
    distance_from_usual_location > 500,
    2.5,
    0
)

# New account
fraud_score += np.where(
    account_age_days < 30,
    1.5,
    0
)

# Late-night transactions
fraud_score += np.where(
    (hour <= 4),
    1.0,
    0
)

# ---------------------------------------------------------
# Important interaction patterns
# ---------------------------------------------------------

# Large amount + new device
fraud_score += np.where(
    (amount > 20000) & (is_new_device == 1),
    3.0,
    0
)

# Large amount + new location
fraud_score += np.where(
    (amount > 20000) & (is_new_location == 1),
    3.0,
    0
)

# High velocity + failed attempts
fraud_score += np.where(
    (transactions_last_10min >= 4) &
    (failed_attempts >= 2),
    3.0,
    0
)

# Add controlled randomness
fraud_score += np.random.normal(
    0,
    0.8,
    N
)

# ---------------------------------------------------------
# Convert score to probability
# ---------------------------------------------------------

fraud_probability = 1 / (
    1 + np.exp(-(fraud_score - 5.5))
)

# ---------------------------------------------------------
# Generate fraud label
# ---------------------------------------------------------

fraud = np.random.binomial(
    1,
    fraud_probability
)

# ---------------------------------------------------------
# Create dataframe
# ---------------------------------------------------------

df = pd.DataFrame({
    "transaction_id": transaction_id,
    "customer_id": customer_id,
    "amount": amount,
    "account_age_days": account_age_days,
    "transactions_last_10min": transactions_last_10min,
    "transactions_last_1hr": transactions_last_1hr,
    "avg_transaction_amount": avg_transaction_amount,
    "failed_attempts": failed_attempts,
    "is_new_device": is_new_device,
    "is_new_location": is_new_location,
    "distance_from_usual_location":
        distance_from_usual_location,
    "hour": hour,
    "fraud": fraud
})

# ---------------------------------------------------------
# Save
# ---------------------------------------------------------

df.to_csv(
    "transactions.csv",
    index=False
)

print("Dataset created successfully!")

print(f"Total transactions: {len(df)}")

print(
    f"Fraud transactions: {df['fraud'].sum()}"
)

print(
    f"Legitimate transactions: "
    f"{(df['fraud'] == 0).sum()}"
)

print(
    f"Fraud percentage: "
    f"{df['fraud'].mean() * 100:.2f}%"
)

print("\nFirst 5 transactions:")
print(df.head())