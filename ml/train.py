import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score
)

from xgboost import XGBClassifier


# =========================================================
# 1. LOAD DATA
# =========================================================

df = pd.read_csv("transactions.csv")

print("Dataset loaded!")
print("Shape:", df.shape)


# =========================================================
# 2. FEATURES
# =========================================================

features = [
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

X = df[features]
y = df["fraud"]


# =========================================================
# 3. TRAIN / VALIDATION / TEST SPLIT
# =========================================================

# 15% FINAL TEST SET
X_temp, X_test, y_temp, y_test = train_test_split(
    X,
    y,
    test_size=0.15,
    random_state=42,
    stratify=y
)

# Remaining data -> training + validation
X_train, X_val, y_train, y_val = train_test_split(
    X_temp,
    y_temp,
    test_size=0.1765,
    random_state=42,
    stratify=y_temp
)

print("\nData split:")
print("Training:", len(X_train))
print("Validation:", len(X_val))
print("Final test:", len(X_test))


# =========================================================
# 4. HANDLE CLASS IMBALANCE
# =========================================================

negative = (y_train == 0).sum()
positive = (y_train == 1).sum()

scale_pos_weight = negative / positive

print("\nClass distribution:")
print("Legitimate:", negative)
print("Fraud:", positive)
print(
    "Scale pos weight:",
    round(scale_pos_weight, 2)
)


# =========================================================
# 5. TRAIN XGBOOST
# =========================================================

model = XGBClassifier(
    n_estimators=400,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,

    scale_pos_weight=scale_pos_weight,

    eval_metric="logloss",
    random_state=42
)

print("\nTraining XGBoost model...")

model.fit(
    X_train,
    y_train
)

print("Model training completed!")


# =========================================================
# 6. FIND A GOOD THRESHOLD USING VALIDATION DATA
# =========================================================

y_val_probability = model.predict_proba(X_val)[:, 1]

best_threshold = 0.5
best_f1 = 0

print("\nSearching for best threshold...")

for threshold in np.arange(0.10, 0.91, 0.01):

    y_val_prediction = (
        y_val_probability >= threshold
    ).astype(int)

    current_f1 = f1_score(
        y_val,
        y_val_prediction
    )

    if current_f1 > best_f1:
        best_f1 = current_f1
        best_threshold = threshold

print(
    "Best threshold:",
    round(best_threshold, 2)
)

print(
    "Validation F1:",
    round(best_f1, 4)
)


# =========================================================
# 7. VALIDATION RESULTS
# =========================================================

y_val_pred = (
    y_val_probability >= best_threshold
).astype(int)

print("\n================================")
print("VALIDATION RESULTS")
print("================================")

print(
    "Precision:",
    round(
        precision_score(y_val, y_val_pred),
        4
    )
)

print(
    "Recall:",
    round(
        recall_score(y_val, y_val_pred),
        4
    )
)

print(
    "F1 Score:",
    round(
        f1_score(y_val, y_val_pred),
        4
    )
)

print(
    "ROC-AUC:",
    round(
        roc_auc_score(
            y_val,
            y_val_probability
        ),
        4
    )
)

print("\nConfusion Matrix:")
print(
    confusion_matrix(
        y_val,
        y_val_pred
    )
)


# =========================================================
# 8. FINAL HELD-OUT TEST
# =========================================================

y_test_probability = model.predict_proba(
    X_test
)[:, 1]

y_test_pred = (
    y_test_probability >= best_threshold
).astype(int)


precision = precision_score(
    y_test,
    y_test_pred,
    zero_division=0
)

recall = recall_score(
    y_test,
    y_test_pred,
    zero_division=0
)

f1 = f1_score(
    y_test,
    y_test_pred,
    zero_division=0
)

roc_auc = roc_auc_score(
    y_test,
    y_test_probability
)


print("\n================================")
print("FINAL HELD-OUT TEST RESULTS")
print("================================")

print(
    "Precision:",
    round(precision, 4)
)

print(
    "Recall:",
    round(recall, 4)
)

print(
    "F1 Score:",
    round(f1, 4)
)

print(
    "ROC-AUC:",
    round(roc_auc, 4)
)

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_test_pred,
        zero_division=0
    )
)

print("Confusion Matrix:")

print(
    confusion_matrix(
        y_test,
        y_test_pred
    )
)


# =========================================================
# 9. FALSE POSITIVE / FALSE NEGATIVE COST
# =========================================================

cm = confusion_matrix(
    y_test,
    y_test_pred
)

tn, fp, fn, tp = cm.ravel()

false_positive_cost = 200
false_negative_cost = 5000

total_fp_cost = fp * false_positive_cost
total_fn_cost = fn * false_negative_cost

total_cost = (
    total_fp_cost +
    total_fn_cost
)

print("\n================================")
print("BUSINESS COST ANALYSIS")
print("================================")

print(
    "False positives:",
    fp
)

print(
    "False negatives:",
    fn
)

print(
    "False-positive cost: ₹",
    total_fp_cost
)

print(
    "False-negative cost: ₹",
    total_fn_cost
)

print(
    "Total estimated error cost: ₹",
    total_cost
)


# =========================================================
# 10. SAVE MODEL
# =========================================================

joblib.dump(
    model,
    "fraud_model.pkl"
)

print("\nModel saved as fraud_model.pkl")


# =========================================================
# 11. SAVE THRESHOLD
# =========================================================

with open(
    "threshold.txt",
    "w"
) as f:

    f.write(
        str(best_threshold)
    )

print(
    "Threshold saved as threshold.txt"
)


# =========================================================
# 12. SAVE FEATURES
# =========================================================

with open(
    "features.txt",
    "w"
) as f:

    for feature in features:
        f.write(
            feature + "\n"
        )

print(
    "Features saved as features.txt"
)