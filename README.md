# Finance Dashboard Backend

A TypeScript + Express backend for a finance dashboard with role-based access control, financial record management, and analytics APIs.

## Tech Stack
- Node.js + TypeScript
- Express
- PostgreSQL + TypeORM
- JWT authentication
- Zod validation
- Jest unit tests

## Features
- User authentication (`register`, `login`, `profile`)
- Role-based permissions (`viewer`, `analyst`, `admin`)
- User management (admin)
- Financial record CRUD with filters
- Dashboard analytics (summary, category breakdown, recent activity, monthly/weekly trends)
- Input validation and structured error responses
- Rate limiting and basic security middleware

## Role Access
- Viewer:
  - Read records
  - View dashboard analytics
- Analyst:
  - Viewer permissions
  - Create and update own records
- Admin:
  - Full record access including delete
  - Manage users and roles

## Project Structure
- `src/server.ts`: app bootstrap and route wiring
- `src/controllers/`: request handlers
- `src/services/`: business logic
- `src/repositories/`: database access
- `src/models/`: TypeORM entities
- `src/middlewares/`: auth, authorization, validation, error handler
- `src/validators/`: Zod schemas
- `src/utils/`: JWT/password/error helpers
- `src/__tests__/unit/`: unit tests

## Prerequisites
- Node.js 18+
- PostgreSQL 14+

## Environment Variables
Create `.env` in project root:

```env
PORT=3000
NODE_ENV=development
APP_VERSION=1.0.0

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=finance_dashboard
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=false

# Comma-separated frontend origins
CORS_ORIGINS=http://localhost:3001

JWT_SECRET=change_this_in_production
JWT_EXPIRATION=7d
```

For Supabase in production, typically use:

```env
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
CORS_ORIGINS=https://your-app.vercel.app
```

## Setup and Run
1. Install dependencies
```bash
npm install
```

2. Create database in PostgreSQL
```sql
CREATE DATABASE finance_dashboard;
```

3. Start development server
```bash
npm run dev
```

4. Optional: seed admin user
```bash
npm run seed
```

## Test
```bash
npm test
```

## API Overview
Base URL (local): `http://localhost:3000`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/profile` (auth required)

### Users (admin)
- `POST /users`
- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`
- `GET /users/:id/permissions`
- `GET /roles`

### Records
- `POST /records` (analyst/admin)
- `GET /records`
- `GET /records/:id`
- `PATCH /records/:id` (analyst own/admin)
- `DELETE /records/:id` (admin)

Query filters for `GET /records`:
- `limit`, `offset`
- `type` (`income` or `expense`)
- `category`
- `date_from`, `date_to`
- `search`

### Dashboard
- `GET /dashboard/summary`
- `GET /dashboard/category-breakdown`
- `GET /dashboard/recent-activity`
- `GET /dashboard/monthly-trends`
- `GET /dashboard/weekly-trends`

## Error Response Format
All API errors follow this structure:

```json
{
  "status": 400,
  "error_code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "timestamp": "2026-04-03T00:00:00.000Z",
  "fields": {
    "field": "reason"
  }
}
```

## Notes
- Records use soft delete.
- Inactive users cannot access protected routes.
- Currency display in frontend is configured for INR.
