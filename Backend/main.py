from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from models import get_db, init_db
from view import (
    MemberCreate,
    MemberUpdate,
    MemberResponse,
    MemberWithUpcomingBirthday,
    AIMessageRequest,
    AIMessageResponse
)
from controller import (
    create_member,
    get_member,
    get_all_members,
    update_member,
    delete_member,
    get_members_sorted_by_upcoming_birthdays,
    get_members_with_birthdays_next_30_days,
    generate_birthday_message
)

"""CORS and init stuff"""
app = FastAPI(
    title="Member Birthday Management API",
    description="API for managing members and generating personalized birthday messages",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/")
async def root():
    return {
        "message": "Member Birthday Management API",
        "docs": "/docs"
    }


"""CRUD Endpoints"""
@app.post("/members", response_model=MemberResponse, status_code=201)
def create_new_member(member: MemberCreate, db: Session = Depends(get_db)):
    return create_member(db, member)


@app.get("/members", response_model=List[MemberResponse])
def list_members(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_all_members(db, skip, limit)


@app.get("/members/{member_id}", response_model=MemberResponse)
def get_member_by_id(member_id: int, db: Session = Depends(get_db)):
    return get_member(db, member_id)


@app.put("/members/{member_id}", response_model=MemberResponse)
def update_member_by_id(
        member_id: int,
        member_update: MemberUpdate,
        db: Session = Depends(get_db)
):
    return update_member(db, member_id, member_update)


@app.delete("/members/{member_id}", status_code=204)
def delete_member_by_id(member_id: int, db: Session = Depends(get_db)):
    delete_member(db, member_id)
    return None


"""Birthday-related Endpoints"""
@app.get("/members/birthdays/upcoming", response_model=List[MemberWithUpcomingBirthday])
def get_upcoming_birthdays(db: Session = Depends(get_db)):
    return get_members_sorted_by_upcoming_birthdays(db)


@app.get("/members/birthdays/next-30-days", response_model=List[MemberWithUpcomingBirthday])
def get_birthdays_next_30_days(db: Session = Depends(get_db)):
    return get_members_with_birthdays_next_30_days(db)


# AI message generation endpoint
@app.post("/ai/birthday-message", response_model=AIMessageResponse)
def generate_ai_birthday_message(
        request: AIMessageRequest,
        db: Session = Depends(get_db)
):
    """
    Generate a personalized birthday message using AI

    - **member_id**: ID of the member
    - **tone**: 'friendly' or 'formal' (default: friendly)
    - **localize_language**: Whether to use the member's country language (default: false)

    Returns the message with explainability (model, parameters, method, rationale)
    """
    return generate_birthday_message(db, request)