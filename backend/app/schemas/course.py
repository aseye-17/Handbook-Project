from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CourseBase(BaseModel):
    code: str
    title: str
    credits: int = Field(..., ge=0)
    grade: float = Field(..., ge=0.0, le=4.0)
    semester: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    code: Optional[str] = None
    title: Optional[str] = None
    credits: Optional[int] = Field(None, ge=0)
    grade: Optional[float] = Field(None, ge=0.0, le=4.0)
    semester: Optional[str] = None

class CourseInDBBase(CourseBase):
    id: int
    owner_email: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Course(CourseInDBBase):
    pass
