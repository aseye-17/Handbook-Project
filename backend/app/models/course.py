from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.sql import func
from sqlalchemy.types import DateTime

from app.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    owner_email = Column(String, index=True, nullable=False)  # simplify ownership by email

    code = Column(String, nullable=False)
    title = Column(String, nullable=False)
    credits = Column(Integer, nullable=False)
    grade = Column(Float, nullable=False)  # numeric grade points (e.g., 4.0, 3.7)
    semester = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
