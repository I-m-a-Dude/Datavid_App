from datetime import date, timedelta
from models.database import SessionLocal, Member, init_db


def seed_members():
    init_db()
    db = SessionLocal()

    # simple check
    existing = db.query(Member).count()
    if existing > 0:
        print(f"Database already has {existing} members. Skipping seed.")
        db.close()
        return

    today = date.today()

    sample_members = [

        Member(
            first_name="Alice",
            last_name="Johnson",
            birth_date=date(1990, today.month, (today.day + 5) % 28 + 1),
            country="United States",
            city="New York"
        ),
        Member(
            first_name="Bob",
            last_name="Smith",
            birth_date=date(1985, (today.month % 12) + 1 if today.day > 15 else today.month, 15),
            country="Canada",
            city="Toronto"
        ),
        Member(
            first_name="Carlos",
            last_name="Garcia",
            birth_date=date(1992, (today.month % 12) + 1 if today.day > 5 else today.month, 25),
            country="Spain",
            city="Madrid"
        ),
        Member(
            first_name="Diana",
            last_name="Mueller",
            birth_date=date(1988, (today.month + 1) % 12 + 1, 10),
            country="Germany",
            city="Berlin"
        ),
        Member(
            first_name="Ethan",
            last_name="Brown",
            birth_date=date(1995, (today.month + 3) % 12 + 1, 20),
            country="United Kingdom",
            city="London"
        ),
        Member(
            first_name="Fiona",
            last_name="Dubois",
            birth_date=date(1987, (today.month + 6) % 12 + 1, 15),
            country="France",
            city="Paris"
        ),
        Member(
            first_name="George",
            last_name="Rossi",
            birth_date=date(1993, (today.month + 9) % 12 + 1, 5),
            country="Italy",
            city="Rome"
        ),
        Member(
            first_name="Hannah",
            last_name="Silva",
            birth_date=date(1991, today.month, today.day - 1 if today.day > 1 else 28),
            country="Brazil",
            city="São Paulo"
        ),
        Member(
            first_name="Ivan",
            last_name="Popov",
            birth_date=date(1989, today.month, today.day),
            country="Russia",
            city="Moscow"
        ),
        Member(
            first_name="Julia",
            last_name="Sato",
            birth_date=date(1994, today.month, (today.day % 28) + 1),
            country="Japan",
            city="Tokyo"
        ),
    ]

    try:
        db.add_all(sample_members)
        db.commit()
        print(f"Successfully seeded {len(sample_members)} members!")

        for member in sample_members:
            print(f"  - {member.first_name} {member.last_name} ({member.city}, {member.country})")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_members()