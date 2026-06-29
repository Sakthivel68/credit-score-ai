import pandas as pd
from sklearn.preprocessing import LabelEncoder

# ==============================
# Load Dataset
# ==============================
file_path = "../dataset/archive/german_credit_data.csv"
df = pd.read_csv(file_path)

print("Original Dataset Shape:", df.shape)

# ==============================
# Remove Unnecessary Column
# ==============================
df.drop(columns=["Unnamed: 0"], inplace=True)

# ==============================
# Fill Missing Values
# ==============================
df["Saving accounts"] = df["Saving accounts"].fillna("Unknown")
df["Checking account"] = df["Checking account"].fillna("Unknown")

# ==============================
# Encode Categorical Columns
# ==============================
label_encoder = LabelEncoder()

categorical_columns = [
    "Sex",
    "Housing",
    "Saving accounts",
    "Checking account",
    "Purpose",
    "Risk"
]

for column in categorical_columns:
    df[column] = label_encoder.fit_transform(df[column])

# ==============================
# Save Clean Dataset
# ==============================
output_path = "../dataset/processed_credit_data.csv"
df.to_csv(output_path, index=False)

print("\nDataset successfully preprocessed!")

print("\nProcessed Dataset Shape:", df.shape)

print("\nFirst 5 Rows:\n")
print(df.head())

print("\nMissing Values:\n")
print(df.isnull().sum())