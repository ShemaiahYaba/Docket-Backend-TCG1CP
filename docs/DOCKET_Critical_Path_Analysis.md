# Docket Backend — Critical Path Analysis
**Legal Case Management Platform · Capstone 2026**  
*This document defines the order of execution, blockers, and parallel-safe work for the backend team. Every task delegation decision flows from this document.*

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          🚀  START                                  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
╔═════════════════════════════════════════════════════════════════════╗
║              🔴  CRITICAL PATH — Must complete in order             ║
║                                                                     ║
║  ┌─────────────────────────────────────────────────────────────┐   ║
║  │  1️⃣  PROJECT SETUP                                          │   ║
║  │  • Init repo & folder structure                             │   ║
║  │  • Express app scaffold                                     │   ║
║  │  • dotenv + environment config                              │   ║
║  │  • CORS + Helmet + Morgan                                   │   ║
║  │  • Base error handler + 404 handler                        │   ║
║  │  • Health check route  GET /api/health                     │   ║
║  │  • package.json scripts (start, dev, migrate, seed)        │   ║
║  └──────────────────────────┬────────────────────────────────┘   ║
║                             │                                       ║
║                             ▼                                       ║
║  ┌─────────────────────────────────────────────────────────────┐   ║
║  │  2️⃣  DATABASE — MIGRATIONS & MODELS                         │   ║
║  │  • Sequelize config + DB connection test                    │   ║
║  │  • lawyers table + model       (migrate first — no FKs)    │   ║
║  │  • clients table + model       (migrate second — no FKs)   │   ║
║  │  • cases table + model         (FK → lawyers, clients)     │   ║
║  │  • hearings table + model      (FK → cases, lawyers)       │   ║
║  │  • All Sequelize associations defined                       │   ║
║  └──────────────────────────┬────────────────────────────────┘   ║
║                             │                                       ║
║                             ▼                                       ║
║  ┌─────────────────────────────────────────────────────────────┐   ║
║  │  3️⃣  AUTHENTICATION SYSTEM                                  │   ║
║  │  • POST  /api/auth/login    → returns JWT                   │   ║
║  │  • POST  /api/auth/logout                                   │   ║
║  │  • GET   /api/auth/me                                       │   ║
║  │  • JWT generation + verification (jsonwebtoken)             │   ║
║  │  • bcrypt password hashing                                  │   ║
║  │  • auth middleware  → attaches req.user to every request    │   ║
║  │  • role middleware  → requireRole('senior_partner') etc.    │   ║
║  └──────────────────────────┬────────────────────────────────┘   ║
╚═════════════════════════════╪═══════════════════════════════════════╝
                              │
                              ▼
╔═════════════════════════════════════════════════════════════════════╗
║         🟡  HIGH PRIORITY — Unblocks frontend & mobile fast         ║
║                                                                     ║
║              ┌──────────────┴──────────────┐                       ║
║              │                             │                       ║
║              ▼                             ▼                       ║
║  ┌───────────────────────┐   ┌───────────────────────────┐        ║
║  │  4️⃣  LAWYERS MODULE   │   │  5️⃣  CLIENTS MODULE       │        ║
║  │                       │   │                           │        ║
║  │  GET    /api/lawyers  │   │  GET    /api/clients      │        ║
║  │  POST   /api/lawyers  │   │  POST   /api/clients      │        ║
║  │  GET    /api/lawyers  │   │  GET    /api/clients/:id  │        ║
║  │         /:id          │   │  PUT    /api/clients/:id  │        ║
║  │  PUT    /api/lawyers  │   │  DELETE /api/clients/:id  │        ║
║  │         /:id          │   │  Role checks applied      │        ║
║  │  PATCH  /:id/         │   │  Validation applied       │        ║
║  │         deactivate    │   └─────────────┬─────────────┘        ║
║  │  Role checks applied  │                 │                       ║
║  └──────────┬────────────┘                 │                       ║
║             └──────────────┬───────────────┘                       ║
║                            │                                        ║
║                            ▼                                        ║
║  ┌─────────────────────────────────────────────────────────────┐   ║
║  │  6️⃣  CASES MODULE  (most complex — must be owned by         │   ║
║  │                     a mid-level engineer)                   │   ║
║  │                                                             │   ║
║  │  GET    /api/cases                                          │   ║
║  │  POST   /api/cases                                          │   ║
║  │  GET    /api/cases/:id                                      │   ║
║  │  PUT    /api/cases/:id                                      │   ║
║  │  DELETE /api/cases/:id          (senior_partner only)       │   ║
║  │  PATCH  /api/cases/:id/assign                               │   ║
║  │  PATCH  /api/cases/:id/status                               │   ║
║  │  GET    /api/cases/:id/hearings                             │   ║
║  │  Case ID auto-generation  SLT-001, SLT-002...               │   ║
║  │  Status lifecycle enforcement                               │   ║
║  │  Role-scoped results (associate sees own cases only)        │   ║
║  └──────────────────────────┬────────────────────────────────┘   ║
║                             │                                       ║
║                             ▼                                       ║
║  ┌─────────────────────────────────────────────────────────────┐   ║
║  │  7️⃣  DATABASE SEEDERS                                       │   ║
║  │  • 6 lawyers  (1 senior_partner, 3 associates, 2 secretaries│   ║
║  │  • 10 clients (individual + corporate mix)                  │   ║
║  │  • 15–20 cases (all 5 statuses represented)                 │   ║
║  │  • 10–15 hearings (past / today / ≤3d / ≤7d / future)      │   ║
║  │  • Known test credentials seeded for all 3 roles            │   ║
║  └──────────────────────────┬────────────────────────────────┘   ║
╚═════════════════════════════╪═══════════════════════════════════════╝
                              │
                              ▼
╔═════════════════════════════════════════════════════════════════════╗
║      🟢  NON-BLOCKING — Build in parallel once seeders are done     ║
║                                                                     ║
║         ┌────────────────┬──────────────────┬───────────────┐      ║
║         │                │                  │               │      ║
║         ▼                ▼                  ▼               │      ║
║  ┌────────────┐  ┌──────────────┐  ┌─────────────┐         │      ║
║  │  8️⃣        │  │  9️⃣           │  │  🔟          │         │      ║
║  │  HEARINGS  │  │  DASHBOARD   │  │  FILTERS &  │         │      ║
║  │  MODULE    │  │  ENDPOINTS   │  │  SEARCH     │         │      ║
║  │            │  │              │  │             │         │      ║
║  │ GET        │  │ GET /stats   │  │ ?status=    │         │      ║
║  │ /hearings  │  │ GET          │  │ ?case_type= │         │      ║
║  │ POST       │  │ /upcoming-   │  │ ?lawyer_id= │         │      ║
║  │ /hearings  │  │  hearings    │  │ ?search=    │         │      ║
║  │ GET /:id   │  │ GET          │  │ ?filter=    │         │      ║
║  │ PUT /:id   │  │ /recent-     │  │  upcoming   │         │      ║
║  │ DELETE/:id │  │  cases       │  │ ?filter=    │         │      ║
║  │            │  │ Role-scoped  │  │  this_week  │         │      ║
║  │ Future date│  │ aggregations │  │ Pagination  │         │      ║
║  │ validation │  │              │  │ ?page=      │         │      ║
║  │ Urgency    │  │              │  │ &limit=     │         │      ║
║  │ flag logic │  │              │  │             │         │      ║
║  └─────┬──────┘  └──────┬───────┘  └──────┬──────┘         │      ║
║        └────────────────┴──────────────────┘               │      ║
╚════════════════════════════════════════════════════════════╪════════╝
                                                             │
                                                             ▼
╔═════════════════════════════════════════════════════════════════════╗
║         ⚪  STANDALONE — Zero dependencies, build anytime           ║
║                                                                     ║
║  ┌───────────────────────────────────────────────────────────┐     ║
║  │  1️⃣1️⃣  SWAGGER DOCUMENTATION                              │     ║
║  │  • swagger-jsdoc + swagger-ui-express                     │     ║
║  │  • Accessible at  GET /api/docs                           │     ║
║  │  • All 25+ endpoints documented                           │     ║
║  │  • Request body + response schemas                        │     ║
║  │  • Auth header + error responses documented               │     ║
║  └───────────────────────────────────────────────────────────┘     ║
║                                                                     ║
║  ┌───────────────────────────────────────────────────────────┐     ║
║  │  1️⃣2️⃣  EMAIL SERVICE  (Nodemailer)                        │     ║
║  │  • SMTP config via .env                                   │     ║
║  │  • Welcome email on new lawyer account                    │     ║
║  │  • Hearing confirmation email                             │     ║
║  │  • Hearing alert emails (≤3 days, ≤1 day)                │     ║
║  └───────────────────────────────────────────────────────────┘     ║
║                                                                     ║
║  ┌───────────────────────────────────────────────────────────┐     ║
║  │  1️⃣3️⃣  CRON JOB — HEARING ALERTS  (node-cron)            │     ║
║  │  • Runs daily at 08:00 WAT                                │     ║
║  │  • Query hearings within ≤3 days → trigger email          │     ║
║  │  • Query hearings within ≤1 day  → trigger email          │     ║
║  │  • Completely independent of all API routes               │     ║
║  └───────────────────────────────────────────────────────────┘     ║
╚═════════════════════════════════════════════════════════════════════╝
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│              ✅  API COMPLETE — READY FOR PRESENTATION               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Section 1 — The Critical Path Explained

The critical path is the **longest chain of dependent tasks** that determines the earliest possible completion date. Any delay on the critical path delays the entire project. Everything outside the critical path can slip slightly without affecting the deadline — as long as the critical path stays on track.

### The Non-Negotiable Chain

```
Project Setup → DB Models & Migrations → Auth System → Cases/Clients/Lawyers → Seeders
```

These five steps are sequential. None of them can start until the previous one is complete. This is the spine of the entire backend.

---

## Section 2 — Task Breakdown by Priority

---

### 🔴 CRITICAL — Tier 1 (Blocking everything)

---

#### TASK 1 — Project Setup & Base Configuration

**Why it's critical:** No team member can write a single line of route code until this exists. The repo, the folder structure, and the base Express app are the foundation every other task builds on.

**Blocks:** Every single other task on the backend. Also blocks frontend and mobile from having anything to integrate with.

| Item | Detail |
|------|--------|
| Initialize Git repo | Main branch + dev branch from day one |
| Folder structure | `src/config`, `src/controllers`, `src/middlewares`, `src/models`, `src/routes`, `src/services`, `src/utils` |
| Express app scaffold | `app.js` with middleware stack registered |
| Environment config | `.env` file, `dotenv` loaded, all variables defined |
| CORS setup | Configured to accept requests from frontend origin and mobile |
| Helmet | Registered as first middleware for security headers |
| Morgan | HTTP request logging in dev mode |
| Base error handler | Global error handling middleware (catches unhandled errors, returns consistent JSON) |
| 404 handler | Catch-all route that returns `{ success: false, message: "Route not found", status: 404 }` |
| Health check route | `GET /api/health` → returns `{ status: "ok" }` so frontend/mobile can verify API is live |
| npm scripts | `start`, `dev` (nodemon), `migrate`, `seed`, `migrate:undo` |

**Completion signal:** Running `npm run dev` starts the server. `GET /api/health` returns 200.

---

#### TASK 2 — Database Migrations & Models

**Why it's critical:** Every endpoint reads from or writes to the database. Without models and tables, no route can function. Foreign key constraints also enforce the order migrations must run in.

**Blocks:** Auth (lawyers table needed for user login), all CRUD modules, seeders.

**Migration order is mandatory — foreign keys enforce it:**

```
1. lawyers     (no foreign keys — must run first)
2. clients     (no foreign keys — can run alongside lawyers)
3. cases       (FK → lawyers.id, FK → clients.id — must run after both)
4. hearings    (FK → cases.id, FK → lawyers.id — must run last)
```

| Model | Key Fields | Associations |
|-------|-----------|--------------|
| Lawyer | id (UUID), full_name, email, password, specialty, role, is_active | hasMany Cases, hasMany Hearings (created_by) |
| Client | id (UUID), full_name, email, phone, client_type, address | hasMany Cases |
| Case | id (VARCHAR SLT-XXX), title, case_type, status, client_id, lawyer_id, filed_date, closed_date | belongsTo Client, belongsTo Lawyer, hasMany Hearings |
| Hearing | id (UUID), case_id, hearing_date, hearing_time, court_name, notes, outcome, created_by | belongsTo Case, belongsTo Lawyer (created_by) |

**Completion signal:** `npm run migrate` runs without errors. All 4 tables visible in MySQL with correct columns and foreign key constraints.

---

#### TASK 3 — Authentication System

**Why it's critical:** Every single protected route — which is all routes except login — requires the auth middleware to be present and working. Frontend cannot test any feature. Mobile cannot test any feature. Role-based access cannot be tested. Nothing works without auth.

**Blocks:** Every route that requires a logged-in user (which is all of them except `/api/auth/login`).

| Endpoint | Method | Auth Required | Description |
|----------|--------|--------------|-------------|
| `/api/auth/login` | POST | ❌ No | Email + password → returns JWT |
| `/api/auth/logout` | POST | ✅ Yes | Invalidates session (token blacklist or client-side) |
| `/api/auth/me` | GET | ✅ Yes | Returns current user profile from JWT |

**What must be built:**

| Component | Detail |
|-----------|--------|
| Login handler | Validates email + password, compares bcrypt hash, generates JWT with `{ id, email, role }` payload |
| JWT generation | Signs token with `JWT_SECRET`, sets expiry from `JWT_EXPIRES_IN` env var |
| Auth middleware | Extracts Bearer token from `Authorization` header, verifies signature, attaches `req.user` |
| Role middleware | Factory function `requireRole(...roles)` — e.g. `requireRole('senior_partner')` — returns 403 if role doesn't match |
| Error responses | 401 for missing/invalid token, 403 for insufficient role, consistent JSON shape |
| Password hashing | bcrypt hash on lawyer creation, bcrypt compare on login |

**JWT Payload shape:**
```json
{
  "id": "uuid-here",
  "email": "lawyer@firm.com",
  "role": "senior_partner",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Standard error response shape (used across entire API):**
```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "status": 403
}
```

**Completion signal:** `POST /api/auth/login` with valid credentials returns a JWT. Adding the token to `Authorization: Bearer <token>` and calling `GET /api/auth/me` returns the user profile. Calling any protected route without a token returns 401.

---

### 🟡 HIGH PRIORITY — Tier 2 (Unblocks frontend and mobile fast)

---

#### TASK 4 — Lawyers Module

**Why high priority:** Case assignment depends on lawyers existing. Also, the login user IS a lawyer — so the lawyers table seeds must exist before meaningful auth testing can happen.

**Blocks:** Case assignment, lawyer directory on frontend/mobile.

| Endpoint | Method | Role Guard |
|----------|--------|-----------|
| `/api/lawyers` | GET | All authenticated |
| `/api/lawyers` | POST | `senior_partner` only |
| `/api/lawyers/:id` | GET | All authenticated |
| `/api/lawyers/:id` | PUT | `senior_partner` only |
| `/api/lawyers/:id/deactivate` | PATCH | `senior_partner` only |

**Validation rules:**
- `full_name`: required, min 2 chars
- `email`: required, valid format, unique
- `specialty`: required
- `role`: required, must be `senior_partner | associate | secretary`
- `password`: required on create, min 8 chars, bcrypt hashed before save

---

#### TASK 5 — Clients Module

**Why high priority:** Cases require a `client_id`. No client = no case creation possible.

**Blocks:** Case creation, client directory on frontend/mobile.

| Endpoint | Method | Role Guard |
|----------|--------|-----------|
| `/api/clients` | GET | All authenticated |
| `/api/clients` | POST | `senior_partner`, `secretary` |
| `/api/clients/:id` | GET | All authenticated |
| `/api/clients/:id` | PUT | `senior_partner`, `secretary` |
| `/api/clients/:id` | DELETE | `senior_partner` only (soft delete) |

**Validation rules:**
- `full_name`: required, min 2 chars
- `email`: required, valid format, unique
- `phone`: required, validated Nigerian format (`+234...`) or international
- `client_type`: required, must be `individual | corporate`

---

#### TASK 6 — Cases Module

**Why high priority:** Cases is the core of the entire platform. It is the most complex module, has the most endpoints, and is the most visible feature to the frontend and mobile teams. It also has the most business logic (status lifecycle, case ID generation, soft delete).

**Blocks:** Dashboard stats, hearings (need a case to attach to), filters, frontend cases page, mobile cases tab.

| Endpoint | Method | Role Guard |
|----------|--------|-----------|
| `/api/cases` | GET | All authenticated |
| `/api/cases` | POST | `senior_partner`, `secretary` |
| `/api/cases/:id` | GET | All authenticated |
| `/api/cases/:id` | PUT | `senior_partner`, `secretary`, assigned `associate` |
| `/api/cases/:id` | DELETE | `senior_partner` only (soft delete) |
| `/api/cases/:id/assign` | PATCH | `senior_partner`, `secretary` |
| `/api/cases/:id/status` | PATCH | All authenticated (with lifecycle rules) |
| `/api/cases/:id/hearings` | GET | All authenticated |

**Key business logic:**
- Case ID auto-generation: `SLT-001`, `SLT-002`... (query max ID, increment)
- `filed_date` defaults to today, cannot be future date
- `closed_date` auto-set when status changes to `Closed`
- Associate lawyers can only edit their own assigned cases
- `GET /api/cases` must scope results: associates see only their assigned cases by default

**Case status lifecycle:**

| From | Allowed Transitions |
|------|-------------------|
| Pending | Active, In Review, Closed |
| Active | Pending, In Review, Urgent, Closed |
| In Review | Active, Pending, Closed |
| Urgent | Active, In Review, Closed |
| Closed | Active (senior_partner only — reopen) |

**Validation rules:**
- `title`: required, min 5 chars, max 300 chars
- `client_id`: required, must reference existing active client
- `case_type`: required, must be valid ENUM value (`Civil`, `Criminal`, `Corporate`, `Family`, `Property`)
- `status`: defaults to `Pending`
- `lawyer_id`: optional at creation, must reference active lawyer if provided

---

#### TASK 7 — Database Seeders

**Why high priority:** Frontend and mobile teams are building UI in parallel. Without seeded data they cannot render a realistic interface, test filters, or demo the product convincingly. Seeders must cover all edge cases — all statuses, upcoming and past hearings, all role types.

**Blocks:** Realistic integration testing for frontend and mobile. Demo readiness.

| Seeder | Records | Notes |
|--------|---------|-------|
| Lawyers | 6 minimum | 1 senior_partner, 3 associates, 2 secretaries — with hashed passwords |
| Clients | 10 minimum | Mix of individual and corporate |
| Cases | 15–20 | All 5 statuses represented, varied types, some unassigned |
| Hearings | 10–15 | Mix of past, today, tomorrow, ≤3 days, ≤7 days, >7 days — to test urgency logic |

**Seed credentials (for team testing):**
```
senior_partner@docket.com   / password123
associate@docket.com        / password123
secretary@docket.com        / password123
```

---

### 🟢 NON-BLOCKING — Tier 3 (Important, parallel-safe)

---

#### TASK 8 — Hearings Module

**Why non-blocking:** Depends on cases existing but does not block any other backend module. Frontend can display cases without hearings.

| Endpoint | Method | Role Guard |
|----------|--------|-----------|
| `/api/hearings` | GET | All authenticated |
| `/api/hearings` | POST | All authenticated |
| `/api/hearings/:id` | GET | All authenticated |
| `/api/hearings/:id` | PUT | `senior_partner`, `secretary`, assigned `associate` |
| `/api/hearings/:id` | DELETE | `senior_partner`, `secretary` |

**Key business logic:**
- `hearing_date` must be a future date — reject with 400 if in the past
- Cannot schedule hearing on a `Closed` case — reject with 422
- `hearing_time` if provided must be valid `HH:MM` 24-hour format
- Urgency flag returned in response: `{ ...hearing, urgency: "red" | "orange" | "green" }` based on days until hearing

**Validation rules:**
- `case_id`: required, must exist, case must not be Closed
- `hearing_date`: required, must be future date
- `hearing_time`: optional, HH:MM format if provided

---

#### TASK 9 — Dashboard Endpoints

**Why non-blocking:** Pure aggregation — reads from tables that already exist. Doesn't block any other module. Frontend can hardcode placeholder stats while this is being built.

| Endpoint | Returns |
|----------|---------|
| `GET /api/dashboard/stats` | `{ totalCases, activeCases, pendingCases, urgentCases, hearingsThisWeek }` |
| `GET /api/dashboard/upcoming-hearings` | Next 10 hearings sorted by date ascending, with urgency flag |
| `GET /api/dashboard/recent-cases` | Last 10 cases by `updated_at` descending |

**Role-based scoping:**
- `senior_partner` and `secretary`: see firm-wide stats
- `associate`: stats scoped to their assigned cases only

---

#### TASK 10 — Filters & Search

**Why non-blocking:** List endpoints work without filters. Filters are enhancements layered on top of working routes. Frontend can integrate with unfiltered data first and add query params once filtering is ready.

| Filter | Endpoint | Query Param |
|--------|----------|------------|
| Status | `GET /api/cases` | `?status=Active` |
| Case type | `GET /api/cases` | `?case_type=Criminal` |
| Lawyer | `GET /api/cases` | `?lawyer_id=uuid` |
| Text search | `GET /api/cases` | `?search=johnson` — matches title, case ID, client name |
| Upcoming | `GET /api/hearings` | `?filter=upcoming` |
| This week | `GET /api/hearings` | `?filter=this_week` |
| By case | `GET /api/hearings` | `?case_id=SLT-001` |
| Pagination | All list endpoints | `?page=1&limit=20` |

---

### ⚪ STANDALONE — Tier 4 (Zero dependencies, build anytime)

---

#### TASK 11 — Swagger Documentation

**Why standalone:** Documentation doesn't affect any route's functionality. It can be written progressively as routes are completed and polished at the end.

- Accessible at `GET /api/docs`
- Every endpoint documented with method, path, description, request body schema, response schema, and error responses
- Auth header documented (`Authorization: Bearer <token>`)
- All ENUM values listed for `status`, `case_type`, `role`, `client_type`

---

#### TASK 12 — Email Service (Nodemailer)

**Why standalone:** No route depends on email being configured. It's a fire-and-forget service layer. Routes work perfectly without it.

| Email Trigger | Recipient | Template |
|--------------|-----------|---------|
| New lawyer account created | Lawyer | Welcome + login credentials |
| Hearing scheduled | Assigned lawyer | Hearing confirmation with date, court, case |
| Hearing alert (≤3 days) | Assigned lawyer + senior partner | Urgency reminder |
| Hearing alert (≤1 day) | Assigned lawyer + senior partner | Final reminder |

---

#### TASK 13 — Cron Job — Hearing Alerts

**Why standalone:** Runs as a background service completely independent of the request-response cycle. Can be added to the app at any point without touching existing routes.

- Runs daily at `08:00 WAT`
- Queries all hearings where `hearing_date` is within 3 days and case is not `Closed`
- Queries all hearings where `hearing_date` is within 1 day
- Triggers email service for each match
- Logs job execution to console/morgan

---

## Section 3 — Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| 1. Project Setup | Nothing | Everything |
| 2. DB Models & Migrations | Task 1 | Tasks 3, 4, 5, 6, 7 |
| 3. Auth System | Task 2 | Tasks 4, 5, 6, 7, 8, 9, 10 |
| 4. Lawyers Module | Task 3 | Task 6 (assignment) |
| 5. Clients Module | Task 3 | Task 6 (creation) |
| 6. Cases Module | Tasks 4, 5 | Tasks 7, 8, 9, 10 |
| 7. Seeders | Task 6 | Frontend/Mobile testing |
| 8. Hearings Module | Task 6 | Task 9 (dashboard stats) |
| 9. Dashboard Endpoints | Tasks 6, 7, 8 | Nothing |
| 10. Filters & Search | Task 6 | Nothing |
| 11. Swagger Docs | All tasks | Nothing |
| 12. Email Service | Task 1 | Task 13 |
| 13. Cron Jobs | Task 12 | Nothing |

---

## Section 4 — Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| DB migrations fail due to FK order | Medium | High | Always migrate lawyers → clients → cases → hearings |
| Auth middleware misconfigured — all routes return 401 | Medium | Critical | Test auth in isolation before wiring to other routes |
| JWT secret not set in .env — tokens fail silently | Low | Critical | Health check test on startup that validates all required env vars exist |
| Cases module delayed — blocks frontend critical path | Medium | High | You or Kuol must own this personally |
| Seeders with bad data break foreign key constraints | Medium | Medium | Seed in order: lawyers → clients → cases → hearings |
| Role middleware too restrictive — blocks own testing | Low | Medium | Always seed a `senior_partner` account first with known credentials |
| Frontend integrates before seeders are ready | Medium | Medium | Provide Postman collection early so frontend can test manually |

---

## Section 5 — Day-by-Day Suggested Execution Order

| Day | Priority | What must be done |
|-----|----------|------------------|
| Day 1 | 🔴 Critical | Project setup complete, DB migrations run, base Express app live |
| Day 1–2 | 🔴 Critical | Auth system complete and tested — login returns JWT, middleware protects routes |
| Day 2 | 🟡 High | Lawyers + Clients modules complete with validation |
| Day 2–3 | 🟡 High | Cases module complete — most complex, needs most time |
| Day 3 | 🟡 High | Seeders complete — frontend and mobile can now integrate |
| Day 3–4 | 🟢 Parallel | Hearings + Dashboard + Filters built in parallel |
| Day 4–5 | ⚪ Standalone | Email service, cron jobs, Swagger documentation |
| Day 5–6 | ✅ Polish | Bug fixes, edge case handling, full Postman collection, README |
| Day 7 | 🎯 Presentation | Demo run-through, seed data verified, API deployed or localhost ready |

---

*Docket Backend · Critical Path Analysis v1.0 · March 2026*
*This document should be the first thing every backend team member reads before writing any code.*
