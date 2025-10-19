from sqlalchemy import create_engine, Column, Integer, String, Date, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import date
from config import settings

engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False, index=True)
    last_name = Column(String, nullable=False, index=True)
    birth_date = Column(Date, nullable=False)
    country = Column(String, nullable=False, index=True)
    city = Column(String, nullable=False)

    __table_args__ = (
        UniqueConstraint('first_name', 'last_name', 'country', 'city',
                        name='unique_member_location'),
    )

    def __repr__(self):
        return f"<Member(id={self.id}, name={self.first_name} {self.last_name}, country={self.country})>"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)