from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ==============================
# Database Configuration
# ==============================

# This creates a SQLite file at the project root level
DATABASE_URL = "sqlite:///../database/credit_score.db"

# Create the SQLAlchemy engine
# connect_args is required for SQLite to work with FastAPI
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Session factory — used to talk to the database
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
    """
    Opens a database session for each request
    and closes it automatically when done.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        