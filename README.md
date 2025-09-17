# Handbook Project

A full-stack app for a Programme Handbook with authentication and a GPA calculator.

- Backend: FastAPI + SQLAlchemy + JWT + Alembic (in `backend/`)
- Frontend: Expo (React Native) / Web (in project root) with expo-router

## Features
- **User Authentication**
  - Email/password signup and login
  - JWT bearer tokens
  - Profile read/update
  - Stateless logout (client deletes token)
- **GPA Calculator**
  - Add/edit/remove completed courses
  - Validates inputs with clear, inline errors
  - Accepts grade as letter (A, B+, ...), percent (0–100), or points (0.0–4.0)
  - Uses grading bands:
    - A (80–100) → 4.0
    - B+ (75–79) → 3.5
    - B (70–74) → 3.0
    - C+ (65–69) → 2.5
    - C (60–64) → 2.0
    - D+ (55–59) → 1.5
    - D (50–54) → 1.0
    - E (45–49) → 0.5
    - F (0–44) → 0.0
  - Persists courses to the backend (create/list/update/delete)

## Quick Start

### 1) Backend (API)
Folder: `backend/`

Requirements: Python 3.10+

```powershell
# From backend/
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Create env (copy example)
Copy-Item .env.example .env
# Edit .env and set:
# - SECRET_KEY (long random string)
# - CORS_ORIGINS to include your frontend origin(s)

# Initialize DB tables via Alembic (first time)
.\.venv\Scripts\python -m alembic upgrade head

# Run the server
.\.venv\Scripts\python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Docs:
- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health: http://localhost:8000/health

### 2) Frontend (Expo / Web)
Folder: project root

```powershell
npm install
npx expo start
# or start on LAN (recommended for device testing):
# npx expo start --lan
```

Web usually runs at http://localhost:19006 (Expo), http://localhost:3000 (CRA), or http://localhost:5173 (Vite).

### Backend Base URL for the Frontend
The frontend reads `EXPO_PUBLIC_API_BASE_URL` if set. Otherwise it defaults to:
- Web: `http://localhost:8000`
- Android emulator: `http://10.0.2.2:8000`

For physical device testing, set your computer's LAN IP:
```powershell
$env:EXPO_PUBLIC_API_BASE_URL="http://YOUR_LAN_IP:8000"
npx expo start --lan
```

Make sure your backend `CORS_ORIGINS` (in `backend/.env`) includes your frontend origin(s), e.g.:
```env
CORS_ORIGINS=["http://localhost:19006","http://localhost:3000","http://localhost:5173"]
```
Restart the backend after editing `.env`.

## Authentication API
Base path: `/api/v1`

- `POST /auth/signup` (JSON): `{ email, password, full_name? }`
- `POST /auth/login` (form-encoded): `username=<email>&password=<password>`
- `POST /auth/logout` (stateless): instructs client to delete token
- `GET /users/me` (auth): current user profile
- `PUT /users/me` (auth): update `{ full_name?, password? }`

Token usage:
- Send `Authorization: Bearer <access_token>` header for protected endpoints.

## GPA API
All endpoints require `Authorization: Bearer <token>`

- `GET /courses/` — list your courses
- `POST /courses/` — create a course
  - `{ code, title, credits, grade, semester? }` where `grade` is points (0.0–4.0)
- `PUT /courses/{id}` — update a course
- `DELETE /courses/{id}` — delete a course
- `GET /courses/summary` — `{ totalCredits, totalWeightedPoints, gpa, count }`

Note: The frontend accepts letter or percentage and converts to points before saving.

## Project Structure
```
Handbook-Project/
├─ app/                    # Expo router screens (tabs, auth, etc.)
│  └─ (tabs)/calculator.tsx   # GPA calculator UI (connected to backend)
├─ contexts/
│  └─ AuthContext.tsx      # Real auth using backend + token storage
├─ utils/
│  └─ api.ts               # API client for auth & GPA endpoints
├─ backend/
│  ├─ app/
│  │  ├─ core/             # config & security (JWT)
│  │  ├─ models/           # SQLAlchemy models (User, Course)
│  │  ├─ routes/           # FastAPI routers (auth, users, courses)
│  │  ├─ schemas/          # Pydantic schemas
│  │  ├─ database.py       # engine + SessionLocal
│  │  └─ main.py           # app wiring & CORS
│  ├─ migrations/          # Alembic migrations
│  ├─ .env.example
│  └─ requirements.txt
├─ package.json
├─ tsconfig.json
└─ README.md (this file)
```

## Common Tasks

- **Add a user:** Use Swagger `POST /api/v1/auth/signup`, then `POST /api/v1/auth/login`.
- **Change profile name:** `PUT /api/v1/users/me` with `{ "full_name": "New Name" }`.
- **Add a course:** In the app GPA tab; or POST to `/api/v1/courses/` with points.
- **Edit a course:** In the app GPA tab; or PUT `/api/v1/courses/{id}`.
- **Delete a course:** In the app GPA tab; or DELETE `/api/v1/courses/{id}`.

## Troubleshooting

- **CORS errors (browser):**
  - Add your frontend origin to `CORS_ORIGINS` in `backend/.env` and restart backend.

- **Cannot connect from device (Expo Go):**
  - Use `npx expo start --lan`.
  - Set `EXPO_PUBLIC_API_BASE_URL` to `http://<your-lan-ip>:8000`.
  - Ensure Windows Firewall allows port 8000 inbound.

- **Login fails:**
  - Must send form fields `username` and `password` (not `email`).

- **Token expired or invalid:**
  - Login again to get a new token. Changing `SECRET_KEY` invalidates old tokens.

- **Alembic migration issues:**
  - Regenerate and upgrade:
    ```powershell
    .\.venv\Scripts\python -m alembic revision --autogenerate -m "sync"
    .\.venv\Scripts\python -m alembic upgrade head
    ```
