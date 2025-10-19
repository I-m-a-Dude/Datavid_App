from pydantic import BaseModel, field_validator
from datetime import date
from typing import Optional


class MemberBase(BaseModel):
    first_name: str
    last_name: str
    birth_date: date
    country: str
    city: str


class MemberCreate(MemberBase):
    @field_validator('birth_date')
    @classmethod
    def validate_age(cls, v):
        today = date.today()
        age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
        if age < 18:
            raise ValueError('Member must be at least 18 years old')
        return v


class MemberUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    birth_date: Optional[date] = None
    country: Optional[str] = None
    city: Optional[str] = None

    @field_validator('birth_date')
    @classmethod
    def validate_age(cls, v):
        if v is not None:
            today = date.today()
            age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
            if age < 18:
                raise ValueError('Member must be at least 18 years old')
        return v


class MemberResponse(MemberBase):
    id: int

    class Config:
        from_attributes = True


class MemberWithUpcomingBirthday(MemberResponse):
    days_until_birthday: int
    age_turning: int