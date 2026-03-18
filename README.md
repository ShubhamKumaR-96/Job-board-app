# Job Board App

A full-stack job board application where recruiters can post jobs and seekers can apply.

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS v4

**Backend**
- Node.js + Express
- TypeScript + ts-node
- JWT Authentication
- bcryptjs (password hashing)

**Database**
- PostgreSQL
- Prisma ORM v5.22

## Project Structure

```
job-board-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── types/
│   │   ├── lib/
│   │   └── assets/
│   └── vite.config.ts
│
└── backend/
    ├── src/
    │   ├── controllers/
    │   │   ├── auth.controller.ts
    │   │   ├── job.controller.ts
    │   │   └── application.controller.ts
    │   ├── routes/
    │   │   ├── auth.route.ts
    │   │   ├── job.routes.ts
    │   │   └── application.route.ts
    │   ├── middleware/
    │   │   └── auth.middleware.ts
    │   └── index.ts
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    └── .env
```

## Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(SEEKER)
  createdAt DateTime @default(now())
}

model Job {
  id          Int      @id @default(autoincrement())
  title       String
  company     String
  location    String
  salary      String?
  description String
  createdAt   DateTime @default(now())
  postedById  Int
}

model Application {
  id          Int               @id @default(autoincrement())
  status      ApplicationStatus @default(PENDING)
  createdAt   DateTime          @default(now())
  jobId       Int
  applicantId Int
}

enum Role { RECRUITER SEEKER }
enum ApplicationStatus { PENDING ACCEPTED REJECTED }
```

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL

### Installation

**Clone the repo**
```bash
git clone https://github.com/ShubhamKumaR-96/Job-board-app.git
cd Job-board-app
```

**Backend setup**
```bash
cd backend
npm install
```

Create `.env` file in `backend/`:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/jobboard"
JWT_SECRET="jobboard_secret_key_2026"
```

Run migrations:
```bash
npx prisma migrate dev --name init
```

Start backend:
```bash
npm run dev
```

**Frontend setup**
```bash
cd frontend
npm install
npm run dev
```

## API Reference

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login user | No |

**Register body:**
```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "password123",
  "role": "RECRUITER"
}
```

---

### Jobs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/jobs` | Get all jobs | No |
| GET | `/api/jobs/:id` | Get job by ID | No |
| POST | `/api/jobs` | Create job | RECRUITER |
| PUT | `/api/jobs/:id` | Update job | RECRUITER (owner only) |
| DELETE | `/api/jobs/:id` | Delete job | RECRUITER (owner only) |

**Create job body:**
```json
{
  "title": "React Developer",
  "company": "Google",
  "location": "Bangalore",
  "salary": "20 LPA",
  "description": "2 years experience needed"
}
```

---

### Applications

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/applications/:jobId` | Apply to job | SEEKER |
| GET | `/api/applications/my` | My applications | SEEKER |
| GET | `/api/applications/jobId/:id` | Job's applications | RECRUITER |
| PUT | `/api/applications/:id` | Update status | RECRUITER |

**Update status body:**
```json
{
  "status": "ACCEPTED"
}
```
Status values: `PENDING` | `ACCEPTED` | `REJECTED`

---

### Authorization Header
All protected routes require:
```
Authorization: Bearer <token>
```

## Progress

- [x] Project setup — frontend & backend
- [x] Tailwind CSS configured
- [x] PostgreSQL + Prisma setup
- [x] Database schema + migrations
- [x] Auth APIs (register, login, JWT)
- [x] Auth middleware (role-based)
- [x] Job CRUD APIs
- [x] Application APIs
- [ ] Frontend pages (Login, Register)
- [ ] Job listing page
- [ ] Job detail + Apply button
- [ ] Recruiter dashboard
- [ ] Seeker dashboard
- [ ] Deploy (Vercel + Railway)
