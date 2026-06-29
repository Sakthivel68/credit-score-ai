import pandas as pd
import joblib
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score
)

# ==============================
# Load Dataset
# ==============================

df = pd.read_csv("../dataset/processed_credit_data.csv")

X = df.drop("Risk", axis=1)
y = df["Risk"]

# ==============================
# Split Dataset
# ==============================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# ==============================
# Improved Random Forest
# ==============================

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    min_samples_split=5,
    random_state=42
)

model.fit(X_train, y_train)

# ==============================
# Prediction
# ==============================

y_pred = model.predict(X_test)

# ==============================
# Evaluation
# ==============================

accuracy = accuracy_score(y_test, y_pred)

print("\nAccuracy:", accuracy)

print("\nClassification Report\n")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix\n")
print(confusion_matrix(y_test, y_pred))

# ==============================
# ROC AUC
# ==============================

probability = model.predict_proba(X_test)[:,1]

roc = roc_auc_score(y_test, probability)

print("\nROC-AUC Score:", roc)

# ==============================
# Cross Validation
# ==============================

scores = cross_val_score(model, X, y, cv=5)

print("\nCross Validation Scores")

print(scores)

print("\nAverage CV Accuracy:", scores.mean())

# ==============================
# Feature Importance
# ==============================

importance = model.feature_importances_

feature_importance = pd.DataFrame({
    "Feature": X.columns,
    "Importance": importance
})

feature_importance = feature_importance.sort_values(
    by="Importance",
    ascending=False
)

print("\nFeature Importance\n")

print(feature_importance)

plt.figure(figsize=(8,6))

plt.barh(
    feature_importance["Feature"],
    feature_importance["Importance"]
)

plt.xlabel("Importance")

plt.title("Random Forest Feature Importance")

plt.tight_layout()

plt.savefig("../screenshots/feature_importance.png")

plt.show()

# ==============================
# Save Model
# ==============================

joblib.dump(model, "../models/random_forest_model.pkl")

print("\nModel Saved Successfully!")