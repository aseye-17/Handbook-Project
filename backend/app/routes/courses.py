from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.core.security import get_current_user
from app import models
from app.schemas import course as course_schema

router = APIRouter()

@router.get("/", response_model=List[course_schema.Course])
async def list_courses(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    items = db.query(models.Course).filter(models.Course.owner_email == current_user["user_id"]).order_by(models.Course.id.desc()).all()
    return items

@router.post("/", response_model=course_schema.Course, status_code=status.HTTP_201_CREATED)
async def create_course(
    course_in: course_schema.CourseCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = models.Course(
        owner_email=current_user["user_id"],
        code=course_in.code,
        title=course_in.title,
        credits=course_in.credits,
        grade=course_in.grade,
        semester=course_in.semester,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(
    course_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(models.Course).filter(models.Course.id == course_id, models.Course.owner_email == current_user["user_id"]).first()
    if not item:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(item)
    db.commit()
    return None

@router.put("/{course_id}", response_model=course_schema.Course)
async def update_course(
    course_id: int,
    course_in: course_schema.CourseUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(models.Course).filter(models.Course.id == course_id, models.Course.owner_email == current_user["user_id"]).first()
    if not item:
        raise HTTPException(status_code=404, detail="Course not found")
    update_data = course_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item

@router.get("/summary")
async def gpa_summary(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    items = db.query(models.Course).filter(models.Course.owner_email == current_user["user_id"]).all()
    total_credits = sum(c.credits for c in items)
    total_weighted = sum(c.credits * c.grade for c in items)
    gpa = (total_weighted / total_credits) if total_credits > 0 else 0.0
    return {
        "totalCredits": total_credits,
        "totalWeightedPoints": total_weighted,
        "gpa": gpa,
        "count": len(items),
    }
