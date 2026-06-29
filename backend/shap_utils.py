import pandas as pd
import joblib
import shap
import matplotlib.pyplot as plt

# ==============================
# Load Dataset
# ==============================
df = pd.read_csv("../dataset/processed_credit_data.csv")
X = df.drop("Risk", axis=1)

# ==============================
# Load Trained Model
# ==============================
model = joblib.load("../models/random_forest_model.pkl")
print("Model Loaded Successfully!")

# ==============================
# SHAP Explainer
# ==============================
explainer = shap.TreeExplainer(model)

# ==============================
# Explain First Customer
# ==============================
sample = X.iloc[[0]]
shap_values = explainer.shap_values(sample)

print("\nCustomer Details:\n")
print(sample)

print("\nPrediction:")
print(model.predict(sample))

print("\nPrediction Probability:")
print(model.predict_proba(sample))

# ==============================
# Detect SHAP output format
# ==============================
import numpy as np

if isinstance(shap_values, list):
    # Old SHAP format: list of arrays per class
    class1_shap = shap_values[1][0]
    base_value = explainer.expected_value[1]
else:
    # New SHAP format: 3D array (samples, features, classes)
    class1_shap = shap_values[0, :, 1]
    base_value = explainer.expected_value[1]

# ==============================
# Feature Contribution
# ==============================
print("\nFeature Contributions:\n")
for feature, value in zip(sample.columns, class1_shap):
    print(f"{feature:30} {value:.4f}")

# ==============================
# SHAP Waterfall Plot
# ==============================
shap.plots.waterfall(
    shap.Explanation(
        values=class1_shap,
        base_values=base_value,
        data=sample.iloc[0].values,
        feature_names=list(sample.columns)
    ),
    show=False
)

plt.tight_layout()
plt.savefig("../screenshots/shap_waterfall.png", bbox_inches="tight")
plt.close()

print("\nSHAP Waterfall Plot Saved Successfully!")