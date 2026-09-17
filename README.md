# Alene High School Website

Full-stack web application for Alene High School, mirroring the structure of
`kshs.academy` with 7 pages: Home, About Us, STEM Center, Hobbies, News,
Contact Us, and Entrance Exam Result.

## Stack

- **Frontend:** Next.js 14 (App Router) + React + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Icons:** lucide-react
- **Images:** Unsplash placeholder URLs with animated skeleton fallbacks

## Project Structure

```
client/   Next.js frontend (7 app routes + shared components)
server/   Express API + Prisma schema/seed
```

## Getting Started

### 1. Backend (server/)

```bash
cd server
npm install
cp .env.example .env      # set DATABASE_URL, JWT_SECRET, etc.
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev                # http://localhost:4000
```

### 2. Frontend (client/)

```bash
cd client
npm install
cp .env.local.example .env.local
npm run dev                # http://localhost:3000
```

## API Endpoints

- `GET  /api/results/:registrationId` — look up an entrance exam result
- `GET  /api/news` — list news articles (supports `?category=` and `?search=`)
- `GET  /api/news/:slug` — fetch a single article
- `POST /api/auth/login` — user login
- `POST /api/auth/register` — user registration

## Sample Exam Registration IDs

Seeded via `prisma/seed.ts`: `AHS-2026-0001`, `AHS-2026-0002`,
`AHS-2026-0003`, `AHS-2026-0004`.
