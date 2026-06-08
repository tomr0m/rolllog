# RollLog — BJJ Training Journal

A BJJ training journal with RPG-style progression. Phase 1: Foundation + Authentication + Profile Setup.

## Tech Stack

**Backend:** Python 3.12, FastAPI, SQLAlchemy 2.0, Alembic, passlib/bcrypt, python-jose (JWT), uv  
**Frontend:** Vite + React + TypeScript, Tailwind CSS v4, Axios, React Router v6, Framer Motion  
**Database:** PostgreSQL

---

## Backend Setup

```bash
cd backend

# 1. Create virtualenv
uv venv
source .venv/bin/activate

# 2. Install dependencies
uv pip install -e .

# 3. Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET:
#   DATABASE_URL=postgresql+psycopg://USER@localhost:5432/rolllog
#   JWT_SECRET=your-secret-key

# 4. Run migrations
alembic upgrade head

# 5. Start dev server
uvicorn app.main:app --reload --port 8000
```

API docs available at http://localhost:8000/docs

---

## Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# VITE_API_URL=http://localhost:8000

# 3. Start dev server
npm run dev
```

App available at http://localhost:5173

---

## API Endpoints (Phase 1)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/signup` | — | Register new user |
| POST | `/api/auth/login` | — | Login, get JWT |
| GET | `/api/auth/me` | Bearer | Get current user |
| POST | `/api/profile/onboarding` | Bearer | Complete onboarding |

---

## User Flow

```
/ → not authed          → /login
/ → authed, no onboard  → /onboarding
/ → authed + onboarded  → /dashboard
```

---

## Phase Roadmap

- **Phase 1**  — Auth + profile onboarding
- **Phase 2** — Training session logging
- **Phase 3** — Techniques system + XP/unlocks
- **Phase 4** — AI coach
