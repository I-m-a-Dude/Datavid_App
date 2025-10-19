# Birthday Manager - Backend

A FastAPI-based REST API for the challenge

## 🏗️ Architecture

The backend follows a clean **MVC (Model-View-Controller)** architecture pattern:

- **Models**: Database schema and ORM layer (SQLAlchemy)
- **Views**: Pydantic schemas for request/response validation
- **Controllers**: Business logic and data processing
- **Main**: FastAPI application and route definitions

### Architecture Diagram

```
┌─────────────────┐
│   Frontend      │
│  (React App)    │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│   main.py       │◄── FastAPI Application Entry Point
│  (Routes/API)   │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌─────────┐ ┌──────────────┐
│Controller│ │  View Layer  │
│  Layer   │ │  (Schemas)   │
└────┬─────┘ └──────────────┘
     │
     ▼
┌──────────┐
│  Models  │◄── SQLAlchemy ORM
│  Layer   │
└────┬─────┘
     │
     ▼
┌──────────┐
│ SQLite   │
│ Database │
└──────────┘
```

## 📁 Project Structure

```
backend/
│
├── main.py                      # FastAPI application entry point & routes
├── config.py                    # Configuration and environment variables
├── requirements.txt             # Python dependencies
├── birthday_manager.db          # SQLite database (auto-generated)
├── test_main.http              # HTTP test requests for API endpoints
│
├── models/                      # Data models & database layer
│   ├── __init__.py             # Package exports
│   └── database.py             # SQLAlchemy models & DB connection
│
├── view/                        # Request/Response schemas (Pydantic)
│   ├── __init__.py             # Package exports
│   ├── member_view.py          # Member-related schemas
│   └── ai_view.py              # AI message schemas
│
└── controller/                  # Business logic layer
    ├── __init__.py             # Package exports
    ├── member_controller.py    # Member CRUD & birthday calculations
    └── ai_controller.py        # AI message generation logic
```


## 🚀 Getting Started

### Prerequisites
- Python 3.13+
- Mistral AI API key

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file:**
   ```bash
   MISTRAL_API_KEY=your_api_key_here
   ```

### Running the Application

```bash
uvicorn main:app --reload
```

The API will be available at:
- Base URL: `http://127.0.0.1:8000`
- Interactive docs: `http://127.0.0.1:8000/docs`
- Alternative docs: `http://127.0.0.1:8000/redoc`

## 🔧 API Endpoints

### Member Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/members` | Create new member |
| GET | `/members` | List all members |
| GET | `/members/{id}` | Get member by ID |
| PUT | `/members/{id}` | Update member |
| DELETE | `/members/{id}` | Delete member |

### Birthday Features

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/members/birthdays/upcoming` | All upcoming birthdays (sorted) |
| GET | `/members/birthdays/next-30-days` | Birthdays in next 30 days |

### AI Features

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/birthday-message` | Generate personalized message |

## 📊 Database Schema

```sql
CREATE TABLE members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    birth_date DATE NOT NULL,
    country VARCHAR NOT NULL,
    city VARCHAR NOT NULL,
    UNIQUE (first_name, last_name, country, city)
);
```

**Constraints:**
- Age validation: Member must be 18+ years old
- Unique constraint: No duplicate members in same location

## 🧪 Testing

Use the `test_main.http` file with your IDE's HTTP client

## 🛠️ Technologies Used

- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation and settings
- **Mistral AI** - AI-powered message generation
- **SQLite** - Lightweight database (no need to install apps to work)
- **Uvicorn** - ASGI server

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MISTRAL_API_KEY` | Mistral AI API key for message generation | Yes |

