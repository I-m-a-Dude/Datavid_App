from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.database import Member
from view.member_view import MemberCreate, MemberUpdate, MemberWithUpcomingBirthday
from fastapi import HTTPException
from datetime import date, timedelta
from typing import List


def create_member(db: Session, member: MemberCreate) -> Member:
    db_member = Member(
        first_name=member.first_name,
        last_name=member.last_name,
        birth_date=member.birth_date,
        country=member.country,
        city=member.city
    )
    try:
        db.add(db_member)
        db.commit()
        db.refresh(db_member)
        return db_member
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="A member with this name already exists in this location"
        )


def get_member(db: Session, member_id: int) -> Member:
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member


def get_all_members(db: Session, skip: int = 0, limit: int = 100) -> List[Member]:
    return db.query(Member).offset(skip).limit(limit).all()


def update_member(db: Session, member_id: int, member_update: MemberUpdate) -> Member:
    db_member = get_member(db, member_id)

    update_data = member_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(db_member, field, value)

    try:
        db.commit()
        db.refresh(db_member)
        return db_member
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="A member with this name already exists in this location"
        )


def delete_member(db: Session, member_id: int) -> None:
    db_member = get_member(db, member_id)
    db.delete(db_member)
    db.commit()


def days_until_next_birthday(birth_date: date) -> int:
    today = date.today()
    next_birthday = date(today.year, birth_date.month, birth_date.day)

    if next_birthday < today:
        next_birthday = date(today.year + 1, birth_date.month, birth_date.day)

    return (next_birthday - today).days


def calculate_age_at_next_birthday(birth_date: date) -> int:
    today = date.today()
    next_birthday_year = today.year

    next_birthday = date(today.year, birth_date.month, birth_date.day)
    if next_birthday < today:
        next_birthday_year = today.year + 1

    return next_birthday_year - birth_date.year


def get_members_sorted_by_upcoming_birthdays(db: Session) -> List[MemberWithUpcomingBirthday]:
    members = db.query(Member).all()

    members_with_days = []
    for member in members:
        days = days_until_next_birthday(member.birth_date)
        age = calculate_age_at_next_birthday(member.birth_date)
        members_with_days.append({
            "member": member,
            "days_until_birthday": days,
            "age_turning": age
        })

    members_with_days.sort(key=lambda x: x["days_until_birthday"])

    result = []
    for item in members_with_days:
        member = item["member"]
        result.append(MemberWithUpcomingBirthday(
            id=member.id,
            first_name=member.first_name,
            last_name=member.last_name,
            birth_date=member.birth_date,
            country=member.country,
            city=member.city,
            days_until_birthday=item["days_until_birthday"],
            age_turning=item["age_turning"]
        ))

    return result


def get_members_with_birthdays_next_30_days(db: Session) -> List[MemberWithUpcomingBirthday]:
    all_members = get_members_sorted_by_upcoming_birthdays(db)
    return [m for m in all_members if m.days_until_birthday <= 30]