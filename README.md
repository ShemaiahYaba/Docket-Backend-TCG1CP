# Docket — Backend API
**Legal Case Management Platform · Capstone 2026**

A RESTful API for Nigerian law firms to manage cases, clients, lawyers, and court hearings. Built with Node.js, Express, MySQL, and Sequelize.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [API Overview](#api-overview)
- [Test Credentials](#test-credentials)
- [Project Structure](#project-structure)
- [Scripts Reference](#scripts-reference)
- [Team](#team)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js v20+ |
| Framework | Express.js v4 |
| Database | MySQL 8 |
| ORM | Sequelize v6 |
| Auth | JWT + bcrypt |
| Validation | express-validator |
| Email | Nodemailer |
| Scheduling | node-cron |
| Docs | Swagger UI (`/api/docs`) |
| Logging | Morgan |

---

## Prerequisites

Make sure you have these installed before starting:

- **Node.js** v20 or higher — [nodejs.org](https://nodejs.org)
- **MySQL** 8.x running locally — [mysql.com](https://dev.mysql.com/downloads/)
- **Git**
- **npm** (comes with Node.js)

Verify your versions:
```bash
node -v      # should be v20+
mysql --version
npm -v
```

---

## Getting Started

### 1. Clone the repository
```bash
git clone <repo-url>
cd docket-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create your environment file
```bash
cp .env.example .env
```
Then open `.env` and fill in your values. See [Environment Variables](#environment-variables) below.

### 4. Create the MySQL database
```bash
mysql -u root -p
```
```sql
CREATE DATABASE docket_db;
EXIT;
```

### 5. Run migrations
```bash
npm run migrate
```

### 6. Seed the database
```bash
npm run seed
```

### 7. Start the server
```bash
npm run dev
```

### 8. Verify it's running
```
GET http://localhost:5000/api/health
```
Expected response:
```json
{ "status": "ok" }
```

---

## Environment Variables

Create a `.env` file in the project root. Use `.env.example` as the template.

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=docket_db
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRES_IN=7d

# Email (Nodemailer — use Gmail App Password or any SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM="Docket <no-reply@docket.com>"
```

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | Port the server runs on |
| `NODE_ENV` | Yes | `development` or `production` |
| `DB_HOST` | Yes | MySQL host (usually `localhost`) |
| `DB_PORT` | Yes | MySQL port (usually `3306`) |
| `DB_NAME` | Yes | Name of the MySQL database |
| `DB_USER` | Yes | MySQL username |
| `DB_PASSWORD` | Yes | MySQL password |
| `JWT_SECRET` | Yes | Secret key for signing JWTs — must be strong |
| `JWT_EXPIRES_IN` | Yes | Token expiry e.g. `7d`, `24h` |
| `MAIL_HOST` | No | SMTP host for email sending |
| `MAIL_PORT` | No | SMTP port |
| `MAIL_USER` | No | SMTP username |
| `MAIL_PASS` | No | SMTP password or app password |
| `MAIL_FROM` | No | Sender name and address |

> `.env` is gitignored. Never commit it. Share credentials with teammates via a secure channel.

---

## Database Setup

### Migrations

Run all migrations (creates all tables in the correct order):
```bash
npm run migrate
```

Undo the last migration:
```bash
npm run migrate:undo
```

Undo all migrations (drops all tables):
```bash
npm run migrate:undo:all
```

### Migration order

Migrations run in this order due to foreign key constraints:
```
1. lawyers     (no foreign keys)
2. clients     (no foreign keys)
3. cases       (FK → lawyers, clients)
4. hearings    (FK → cases, lawyers)
```

### Seeders

Populate the database with test data:
```bash
npm run seed
```

Undo all seeders (clears seeded data):
```bash
npm run seed:undo
```

> Always run `npm run migrate` before `npm run seed`.

---

## Running the Server

### Development (auto-restart on file changes)
```bash
npm run dev
```

### Production
```bash
npm start
```

Server runs at: `http://localhost:5000`

---

## API Overview

Base URL: `http://localhost:5000/api`

All protected endpoints require:
```
Authorization: Bearer <token>
```

### Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/login | No | Login and get JWT |
| POST | /auth/logout | Yes | Logout |
| GET | /auth/me | Yes | Get current user |
| GET | /lawyers | Yes | List all lawyers |
| POST | /lawyers | Yes | Create lawyer |
| GET | /lawyers/:id | Yes | Get lawyer by ID |
| PUT | /lawyers/:id | Yes | Update lawyer |
| PATCH | /lawyers/:id/deactivate | Yes | Deactivate lawyer |
| GET | /clients | Yes | List all clients |
| POST | /clients | Yes | Create client |
| GET | /clients/:id | Yes | Get client by ID |
| PUT | /clients/:id | Yes | Update client |
| DELETE | /clients/:id | Yes | Delete client |
| GET | /cases | Yes | List cases |
| POST | /cases | Yes | Create case |
| GET | /cases/:id | Yes | Get case by ID |
| PUT | /cases/:id | Yes | Update case |
| DELETE | /cases/:id | Yes | Delete case |
| PATCH | /cases/:id/assign | Yes | Assign lawyer |
| PATCH | /cases/:id/status | Yes | Update status |
| GET | /cases/:id/hearings | Yes | Get case hearings |
| GET | /hearings | Yes | List hearings |
| POST | /hearings | Yes | Schedule hearing |
| GET | /hearings/:id | Yes | Get hearing by ID |
| PUT | /hearings/:id | Yes | Update hearing |
| DELETE | /hearings/:id | Yes | Delete hearing |
| GET | /dashboard/stats | Yes | Case statistics |
| GET | /dashboard/upcoming-hearings | Yes | Next 10 hearings |
| GET | /dashboard/recent-cases | Yes | Last 10 cases |

### Swagger Docs

Interactive API documentation available at:
```
http://localhost:5000/api/docs
```

### Postman Collection

Import `DOCKET_Postman_Collection.json` into Postman for a pre-built collection of all endpoints with sample request bodies. See `DOCKET_Postman_Guide.md` for usage instructions.

---

## Test Credentials

Seeded by `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Senior Partner | `senior@docket.com` | `Password123!` |
| Associate | `associate@docket.com` | `Password123!` |
| Secretary | `secretary@docket.com` | `Password123!` |

---

## Project Structure

```
docket-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Sequelize connection config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── lawyerController.js
│   │   ├── clientController.js
│   │   ├── caseController.js
│   │   ├── hearingController.js
│   │   └── dashboardController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── roleMiddleware.js     # Role-based access control
│   │   ├── validate.js           # express-validator error handler
│   │   └── errorHandler.js       # Global error + 404 handler
│   ├── models/
│   │   ├── index.js              # Associations
│   │   ├── Lawyer.js
│   │   ├── Client.js
│   │   ├── Case.js
│   │   └── Hearing.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── lawyerRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── caseRoutes.js
│   │   ├── hearingRoutes.js
│   │   └── dashboardRoutes.js
│   ├── services/
│   │   ├── emailService.js       # Nodemailer wrappers
│   │   └── cronService.js        # node-cron hearing alerts
│   ├── utils/
│   │   └── helpers.js            # Shared utility functions
│   └── app.js                    # Express app + middleware stack
├── migrations/                   # Sequelize migration files
├── seeders/                      # Database seed files
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Template for .env
├── .gitignore
├── package.json
└── README.md
```

---

## Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| Start | `npm start` | Run in production |
| Dev | `npm run dev` | Run with nodemon (auto-restart) |
| Migrate | `npm run migrate` | Run all pending migrations |
| Migrate Undo | `npm run migrate:undo` | Undo last migration |
| Migrate Undo All | `npm run migrate:undo:all` | Drop all tables |
| Seed | `npm run seed` | Populate DB with test data |
| Seed Undo | `npm run seed:undo` | Clear seeded data |

---

## Roles & Permissions Summary

| Action | Senior Partner | Associate | Secretary |
|--------|:--------------:|:---------:|:---------:|
| Create lawyers | ✅ | ❌ | ❌ |
| Create cases | ✅ | ❌ | ✅ |
| Create clients | ✅ | ❌ | ✅ |
| View all cases | ✅ | Own only | ✅ |
| Delete cases | ✅ | ❌ | ❌ |
| Assign lawyers | ✅ | ❌ | ✅ |
| Reopen closed case | ✅ | ❌ | ❌ |
| Schedule hearings | ✅ | ✅ | ✅ |
| Firm-wide dashboard | ✅ | Personal | ✅ |

---

## Team

| Name | Role |
|------|------|
| Shemaiah | Team Lead, Project Setup, DB Models, Seeders |
| Kuol | Auth System, Cases Module |
| Ola | Lawyers Module, Swagger Docs |
| Omotayo | Clients Module, Filters & Search |
| Sonia | Hearings Module |
| Oluwaseyi | Dashboard Endpoints |

---

*Docket Backend · March 2026 · TechCrush Backend Engineering Capstone*
