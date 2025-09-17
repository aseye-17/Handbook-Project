# Handbook API (FastAPI)

A lightweight authentication backend using FastAPI, SQLAlchemy, and JWT.

## Features
- Email/password signup and login
- JWT bearer tokens
- Profile read/update for the current user
- CORS configured via settings

## Requirements
- Python 3.10+

## Quick Start
```powershell
# From backend/ directory
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Copy example env and edit as needed
Copy-Item .env.example .env

# Run dev server
.\.venv\Scripts\python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables (`.env`)
See `.env.example` for all supported values.
- `SECRET_KEY` (required for production) — random, long string.
- `DATABASE_URL` — default is SQLite `sqlite:///./sql_app.db`.
- `CORS_ORIGINS` — JSON array of allowed frontend origins.
- `ACCESS_TOKEN_EXPIRE_MINUTES` — token lifetime in minutes.

## Project Structure
```
backend/
├─ app/
│  ├─ core/
│  │  ├─ config.py         # Settings and env
│  │  └─ security.py       # JWT + password hashing
│  ├─ models/
│  │  └─ user.py           # SQLAlchemy User model
│  ├─ routes/
│  │  ├─ auth.py           # /auth endpoints (login, signup, logout)
│  │  └─ users.py          # /users endpoints (me, update me)
│  ├─ schemas/
│  │  ├─ token.py          # Token schemas
│  │  └─ user.py           # User schemas
│  ├─ database.py          # SQLAlchemy engine/session
│  └─ main.py              # FastAPI app wiring
├─ requirements.txt
├─ .env.example            # Sample env file (copy to .env)
└─ README.md
```

## API
- `POST /api/v1/auth/signup` (JSON): `{ email, password, full_name? }`
- `POST /api/v1/auth/login` (form): `username=<email>&password=<password>`
- `POST /api/v1/auth/logout` (stateless): instructs client to delete token
- `GET /api/v1/users/me` (auth): returns current user profile
- `PUT /api/v1/users/me` (auth): update `{ full_name?, password? }`

## Notes
- The app creates DB tables on startup (dev convenience). For production, use Alembic migrations.
- Restrict CORS in `app/core/config.py` for production.
- Never commit `.env`.

## Next Steps (Optional)
- Add Alembic migrations folder and scripts.
- Add refresh tokens + revoke strategy.
- Add rate limiting/lockout for failed logins.
- Add unit/integration tests (e.g., `pytest`).
