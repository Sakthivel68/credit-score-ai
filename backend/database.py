from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# ==============================
# Database Configuration
# ==============================

# Get the directory where this file is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Create database file inside backend folder
DB_PATH = os.path.join(BASE_DIR, "credit_score_app.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

print(f"Database path: {DB_PATH}")

# Create the SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for all database models
Base = declarative_base()

# ==============================
# Dependency — used in API routes
# ==============================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()