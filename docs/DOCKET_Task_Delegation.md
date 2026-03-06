# Docket Backend — Task Delegation
**Legal Case Management Platform · Capstone 2026**  
*This document assigns every backend task to a specific person. Assignments are based on skill level, critical path priority, and the need to keep all 6 team members productive simultaneously without anyone blocking anyone else.*

---

## Team

| Name | Level | Role |
|------|-------|------|
| **Shemaiah** | Mid-level | Team Lead — owns critical path, final code review, unblocks team |
| **Kuol** | Mid-level | Senior contributor — owns the most complex modules |
| **Ola** | Beginner | Contributor |
| **Omotayo** | Beginner | Contributor |
| **Sonia** | Beginner | Contributor |
| **Oluwaseyi** | Beginner | Contributor |

---

## Ground Rules

- **Shemaiah and Kuol do not touch beginner tasks** unless someone is completely stuck. The critical path is their primary responsibility.
- **No beginner starts their task until Task 1 (Project Setup) is merged.** Everything is built on top of the foundation.
- **Every person works on their own Git branch.** Branch naming: `feature/<task-name>` e.g. `feature/lawyers-module`.
- **No one merges their own PR.** Shemaiah reviews and merges all PRs.
- **If a beginner is stuck for more than 30 minutes**, they flag it immediately — do not sit on a blocker silently.
- **Shemaiah establishes the pattern first.** Before beginners write a single route, Shemaiah must have completed the Auth module so they can see the exact code structure — controllers, services, validation, error handling — and replicate it.

---

## Task Assignments

---

### 🔴 TASK 1 — Project Setup & Base Configuration
**Owner: Shemaiah**  
**Branch:** `main` / initial commit  
**Deadline: Day 1 — before anyone else writes code**

This is the first task and it belongs to the team lead. No one else can start until this is done and merged.

| Deliverable | Detail |
|-------------|--------|
| Repo structure | All folders created: `src/config`, `src/controllers`, `src/middlewares`, `src/models`, `src/routes`, `src/services`, `src/utils` |
| Express app | `app.js` with middleware stack wired up |
| Environment | `.env.example` committed, `.env` gitignored, `dotenv` loaded on startup |
| Security | `helmet` and `cors` registered |
| Logging | `morgan` in dev mode |
| Error handling | Global error handler middleware + 404 catch-all |
| Health check | `GET /api/health` → `{ status: "ok" }` |
| npm scripts | `start`, `dev` (nodemon), `migrate`, `seed`, `migrate:undo` |
| Sequelize config | `src/config/database.js` with env-based config |
| README skeleton | Basic setup instructions placeholder |

**Done when:** `npm run dev` starts the server, `GET /api/health` returns 200, folder structure is in place, and the branch is merged to `main`.

---

### 🔴 TASK 2 — Database Migrations & Models
**Owner: Shemaiah**  
**Branch:** `feature/database-models`  
**Deadline: Day 1 (same day as setup, immediately after)**

Shemaiah owns this because the migration order and association definitions require experience. A mistake here breaks everything downstream.

| Deliverable | Detail |
|-------------|--------|
| lawyers migration | Table created with all fields and constraints |
| clients migration | Table created with all fields and constraints |
| cases migration | Table with FKs → lawyers and clients |
| hearings migration | Table with FKs → cases and lawyers |
| Lawyer model | Sequelize model with `hasMany Cases`, `hasMany Hearings` |
| Client model | Sequelize model with `hasMany Cases` |
| Case model | Sequelize model with `belongsTo Client`, `belongsTo Lawyer`, `hasMany Hearings` |
| Hearing model | Sequelize model with `belongsTo Case`, `belongsTo Lawyer` |
| Associations file | All associations wired in `src/models/index.js` |

**Migration order is mandatory:**
```
1. lawyers
2. clients
3. cases       (FK → lawyers, clients)
4. hearings    (FK → cases, lawyers)
```

**Done when:** `npm run migrate` runs without errors and all 4 tables exist in MySQL with correct columns and FK constraints.

---

### 🔴 TASK 3 — Authentication System
**Owner: Kuol**  
**Branch:** `feature/auth`  
**Deadline: Day 1–2**

Kuol owns auth because it is the most security-critical piece of the entire API. It also serves as the **pattern reference** — the structure Kuol establishes here (controller → service → route → middleware) is the exact pattern every beginner will replicate for their module.

| Deliverable | Detail |
|-------------|--------|
| `POST /api/auth/login` | Validates input, compares bcrypt hash, returns signed JWT |
| `POST /api/auth/logout` | Returns 200, handles client-side token invalidation |
| `GET /api/auth/me` | Returns authenticated user profile (no password) |
| `authMiddleware` | Validates JWT, attaches `req.user`, returns 401 on failure |
| `requireRole()` | Factory middleware, returns 403 on role mismatch |
| bcrypt integration | Password hashed on lawyer creation, compared on login |
| JWT generation | Signed with `JWT_SECRET` env var, includes `id`, `email`, `role` |
| Error responses | Consistent `{ success, message, status }` shape on all failures |

**Done when:** Login returns a JWT, `GET /api/auth/me` with that token returns the user, calling a protected route without a token returns 401, calling with wrong role returns 403.

> ⚠️ **This task is the gate for all beginner tasks.** Kuol must communicate to the team the moment auth is merged so beginners can start.

---

### 🟡 TASK 4 — Lawyers Module
**Owner: Ola**  
**Branch:** `feature/lawyers-module`  
**Starts after:** Task 3 is merged  
**Deadline: Day 2–3**

The lawyers module is the most beginner-friendly of the CRUD modules — it has no complex business logic, clear validation rules, and straightforward role guards. Good first task.

| Deliverable | Detail |
|-------------|--------|
| `GET /api/lawyers` | Returns all active lawyers |
| `POST /api/lawyers` | Creates lawyer, hashes password, `senior_partner` only |
| `GET /api/lawyers/:id` | Returns lawyer profile + associated cases |
| `PUT /api/lawyers/:id` | Updates profile, `senior_partner` only |
| `PATCH /api/lawyers/:id/deactivate` | Sets `is_active = false`, `senior_partner` only |
| Validation | `full_name`, `email` (unique), `specialty`, `role` (ENUM), `password` (min 8) |
| Role guards | `requireRole('senior_partner')` on POST, PUT, PATCH |
| Password | Never returned in any response |

**Reference:** Follow the exact same controller/service/route pattern from Task 3 (Auth). Ask Kuol if the pattern is unclear.

---

### 🟡 TASK 5 — Clients Module
**Owner: Omotayo**  
**Branch:** `feature/clients-module`  
**Starts after:** Task 3 is merged  
**Deadline: Day 2–3**

Clients module is parallel to lawyers — same complexity level, clear validation rules. Can be built simultaneously with Task 4.

| Deliverable | Detail |
|-------------|--------|
| `GET /api/clients` | Returns all active clients, supports `?search=` query param |
| `POST /api/clients` | Creates client, `senior_partner` and `secretary` only |
| `GET /api/clients/:id` | Returns client profile + array of linked cases |
| `PUT /api/clients/:id` | Updates profile, `senior_partner` and `secretary` only |
| `DELETE /api/clients/:id` | Soft-delete, `senior_partner` only |
| Validation | `full_name` (min 2), `email` (unique, valid format), `phone` (+234 or international), `client_type` (ENUM) |
| Role guards | `requireRole('senior_partner', 'secretary')` on POST and PUT; `requireRole('senior_partner')` on DELETE |
| Search | `?search=` filters by `full_name` and `email` using `LIKE` query |

**Reference:** Follow the exact same controller/service/route pattern from Task 3 (Auth).

---

### 🟡 TASK 6 — Cases Module
**Owner: Kuol**  
**Branch:** `feature/cases-module`  
**Starts after:** Tasks 4 and 5 are merged  
**Deadline: Day 3**

Cases is the most complex module in the entire backend — auto-generated IDs, status lifecycle enforcement, role-scoped queries, ownership checks, and 8 endpoints. This must be owned by Kuol.

| Deliverable | Detail |
|-------------|--------|
| `GET /api/cases` | All cases for senior_partner/secretary; own cases only for associate |
| `POST /api/cases` | Creates case, auto-generates SLT-XXX ID, senior_partner/secretary only |
| `GET /api/cases/:id` | Full case detail |
| `PUT /api/cases/:id` | Updates case; associate restricted to own cases |
| `DELETE /api/cases/:id` | Soft-delete, senior_partner only |
| `PATCH /api/cases/:id/assign` | Assigns/reassigns lawyer, senior_partner/secretary only |
| `PATCH /api/cases/:id/status` | Updates status with lifecycle enforcement |
| `GET /api/cases/:id/hearings` | Lists all hearings for a case |
| Case ID generation | Query max existing ID, increment, format as `SLT-001` |
| Status lifecycle | Enforce transition matrix — return 422 on invalid transition |
| `closed_date` | Auto-set when status → Closed; cleared on reopen |
| Ownership check | Associate can only edit cases where `lawyer_id = req.user.id` |
| Validation | title (5–300 chars), client_id (active client), case_type (ENUM), filed_date (not future) |

---

### 🟡 TASK 7 — Database Seeders
**Owner: Shemaiah**  
**Branch:** `feature/seeders`  
**Starts after:** Task 6 is merged  
**Deadline: Day 3**

Shemaiah owns seeders because the data needs to be realistic, cover all edge cases, and the seed order must respect foreign key constraints. Bad seed data will waste everyone's time debugging.

| Deliverable | Detail |
|-------------|--------|
| Lawyers seeder | 6 lawyers: 1 senior_partner, 3 associates, 2 secretaries — passwords bcrypt hashed |
| Clients seeder | 10 clients: mix of individual and corporate |
| Cases seeder | 15–20 cases: all 5 statuses, varied types, some unassigned |
| Hearings seeder | 12 hearings: past, today, tomorrow, ≤3 days, ≤7 days, >7 days — covers all urgency states |
| Known credentials | Documented test logins for all 3 roles |

**Seed order:** lawyers → clients → cases → hearings (FK constraint order)

**Test credentials to seed:**
```
senior@docket.com     / Password123!   (senior_partner)
associate@docket.com  / Password123!   (associate)
secretary@docket.com  / Password123!   (secretary)
```

**Done when:** `npm run seed` populates the DB and all 3 test accounts can log in via `POST /api/auth/login`.

---

### 🟢 TASK 8 — Hearings Module
**Owner: Sonia**  
**Branch:** `feature/hearings-module`  
**Starts after:** Task 6 is merged  
**Deadline: Day 3–4**

Hearings has slightly more business logic than lawyers and clients (future date validation, closed case check, urgency flag computation) but follows the same pattern. Suitable for a beginner who has seen the previous modules as reference.

| Deliverable | Detail |
|-------------|--------|
| `GET /api/hearings` | All hearings, supports `?filter=upcoming`, `?filter=this_week`, `?case_id=` |
| `POST /api/hearings` | Creates hearing, all authenticated users |
| `GET /api/hearings/:id` | Single hearing detail |
| `PUT /api/hearings/:id` | Updates hearing; associate restricted to own cases |
| `DELETE /api/hearings/:id` | Deletes hearing, senior_partner and secretary only |
| Future date validation | Reject if `hearing_date` is today or in the past |
| Closed case check | Reject if case status is `Closed` — return 422 |
| Time format validation | `hearing_time` must be `HH:MM` if provided |
| Urgency flag | Compute and attach `urgency: "red" \| "orange" \| "green"` to every hearing response |
| Ownership check | Associate can only edit hearings on their assigned cases |

**Urgency logic:**
```js
const daysUntil = Math.ceil((hearingDate - today) / (1000 * 60 * 60 * 24));
urgency = daysUntil <= 3 ? 'red' : daysUntil <= 7 ? 'orange' : 'green';
```

---

### 🟢 TASK 9 — Dashboard Endpoints
**Owner: Oluwaseyi**  
**Branch:** `feature/dashboard`  
**Starts after:** Task 7 (seeders) is merged  
**Deadline: Day 4**

Dashboard is pure read and aggregation — no mutations, no complex business logic. The main challenge is writing the correct Sequelize queries. Good task for a beginner who understands models.

| Deliverable | Detail |
|-------------|--------|
| `GET /api/dashboard/stats` | Returns `totalCases`, `activeCases`, `pendingCases`, `urgentCases`, `inReviewCases`, `closedCases`, `hearingsThisWeek` |
| `GET /api/dashboard/upcoming-hearings` | Next 10 hearings sorted by `hearing_date` ASC, includes urgency flag |
| `GET /api/dashboard/recent-cases` | Last 10 cases by `updated_at` DESC |
| Role scoping | senior_partner and secretary: firm-wide; associate: own cases only |
| hearingsThisWeek | Count of hearings where `hearing_date` is between today and today + 7 days |

**Sequelize hints:**
```js
// hearingsThisWeek
const today = new Date();
const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
where: { hearing_date: { [Op.between]: [today, nextWeek] } }

// Count cases by status
where: { status: 'Active', ...(isAssociate ? { lawyer_id: req.user.id } : {}) }
```

---

### 🟢 TASK 10 — Filters & Search
**Owner: Omotayo**  
**Branch:** `feature/filters-search`  
**Starts after:** Task 5 (clients) is merged — builds on top of existing routes  
**Deadline: Day 4**

Filters are enhancements layered on top of Omotayo's existing clients module and the cases module. This keeps Omotayo productive on a second task after Task 5 is done.

| Deliverable | Detail |
|-------------|--------|
| Cases: status filter | `GET /api/cases?status=Active` |
| Cases: case_type filter | `GET /api/cases?case_type=Criminal` |
| Cases: lawyer filter | `GET /api/cases?lawyer_id=uuid` |
| Cases: text search | `GET /api/cases?search=johnson` — matches title, case ID, client name |
| Hearings: upcoming | `GET /api/hearings?filter=upcoming` |
| Hearings: this_week | `GET /api/hearings?filter=this_week` |
| Hearings: by case | `GET /api/hearings?case_id=SLT-001` |
| Pagination | `?page=1&limit=20` on all list endpoints |
| Combined filters | Multiple query params work together (AND logic) |

**Sequelize hints:**
```js
// Dynamic where clause
const where = {};
if (req.query.status) where.status = req.query.status;
if (req.query.case_type) where.case_type = req.query.case_type;
if (req.query.search) {
    where[Op.or] = [
        { title: { [Op.like]: `%${req.query.search}%` } },
        { id: { [Op.like]: `%${req.query.search}%` } }
    ];
}
```

---

### ⚪ TASK 11 — Swagger Documentation
**Owner: Ola**  
**Branch:** `feature/swagger-docs`  
**Starts after:** Task 4 (lawyers) is merged — Ola's second task  
**Deadline: Day 5**

After Ola completes the lawyers module, Swagger documentation is a natural second task. It requires reading through all the routes and writing JSDoc annotations — good for reinforcing understanding of the whole API.

| Deliverable | Detail |
|-------------|--------|
| Swagger setup | `swagger-jsdoc` + `swagger-ui-express` configured in `app.js` |
| Accessible at | `GET /api/docs` |
| Auth endpoints | All 3 documented with request/response examples |
| Lawyers endpoints | All 5 documented |
| Clients endpoints | All 5 documented |
| Cases endpoints | All 8 documented |
| Hearings endpoints | All 5 documented |
| Dashboard endpoints | All 3 documented |
| Auth header | `Authorization: Bearer <token>` documented as security scheme |
| Error responses | 400, 401, 403, 404, 409, 422 documented on relevant endpoints |

---

### ⚪ TASK 12 — Email Service (Nodemailer)
**Owner: Shemaiah**  
**Branch:** `feature/email-service`  
**Starts after:** Task 1 (setup) — completely standalone  
**Deadline: Day 4–5**

Shemaiah owns email and cron because they are standalone but require careful integration. Can be worked on in gaps between reviewing PRs and unblocking the team.

| Deliverable | Detail |
|-------------|--------|
| Nodemailer config | SMTP setup via `.env` variables |
| Email service utility | `src/services/emailService.js` with reusable `sendEmail()` function |
| Welcome email | Triggered when `POST /api/lawyers` creates a new account |
| Hearing confirmation | Triggered when `POST /api/hearings` creates a hearing |
| Alert email templates | 3-day alert and 1-day alert templates ready for cron job |

---

### ⚪ TASK 13 — Cron Job — Hearing Alerts
**Owner: Shemaiah**  
**Branch:** `feature/cron-hearing-alerts`  
**Starts after:** Task 12 (email service)  
**Deadline: Day 5**

| Deliverable | Detail |
|-------------|--------|
| node-cron setup | Registered in `app.js` or a dedicated `src/services/cronService.js` |
| 3-day job | Daily at 08:00 WAT — queries hearings within ≤3 days, triggers alert email |
| 1-day job | Daily at 08:00 WAT — queries hearings within ≤1 day, triggers urgent email |
| Recipients | Assigned lawyer + senior_partner on each alert |
| Logging | Job execution logged to console |

---

## Delegation Summary Table

| Task | Owner | Priority | Depends On | Branch | Deadline |
|------|-------|----------|-----------|--------|----------|
| 1. Project Setup | **Shemaiah** | 🔴 Critical | Nothing | `main` | Day 1 |
| 2. DB Models & Migrations | **Shemaiah** | 🔴 Critical | Task 1 | `feature/database-models` | Day 1 |
| 3. Auth System | **Kuol** | 🔴 Critical | Task 2 | `feature/auth` | Day 1–2 |
| 4. Lawyers Module | **Ola** | 🟡 High | Task 3 | `feature/lawyers-module` | Day 2–3 |
| 5. Clients Module | **Omotayo** | 🟡 High | Task 3 | `feature/clients-module` | Day 2–3 |
| 6. Cases Module | **Kuol** | 🟡 High | Tasks 4, 5 | `feature/cases-module` | Day 3 |
| 7. Seeders | **Shemaiah** | 🟡 High | Task 6 | `feature/seeders` | Day 3 |
| 8. Hearings Module | **Sonia** | 🟢 Parallel | Task 6 | `feature/hearings-module` | Day 3–4 |
| 9. Dashboard Endpoints | **Oluwaseyi** | 🟢 Parallel | Task 7 | `feature/dashboard` | Day 4 |
| 10. Filters & Search | **Omotayo** | 🟢 Parallel | Task 5 | `feature/filters-search` | Day 4 |
| 11. Swagger Docs | **Ola** | ⚪ Standalone | Task 4 | `feature/swagger-docs` | Day 5 |
| 12. Email Service | **Shemaiah** | ⚪ Standalone | Task 1 | `feature/email-service` | Day 4–5 |
| 13. Cron Jobs | **Shemaiah** | ⚪ Standalone | Task 12 | `feature/cron-hearing-alerts` | Day 5 |

---

## Workload Distribution

| Name | Tasks | Type |
|------|-------|------|
| **Shemaiah** | 1, 2, 7, 12, 13 | Setup + Seeders + Standalone + Lead |
| **Kuol** | 3, 6 | Auth + Cases (hardest two modules) |
| **Ola** | 4, 11 | Lawyers + Swagger |
| **Omotayo** | 5, 10 | Clients + Filters |
| **Sonia** | 8 | Hearings |
| **Oluwaseyi** | 9 | Dashboard |

---

## Day-by-Day Team View

| Day | Shemaiah | Kuol | Ola | Omotayo | Sonia | Oluwaseyi |
|-----|----------|------|-----|---------|-------|-----------|
| Day 1 | Setup + DB Models | — (waiting on models) | — | — | — | — |
| Day 1–2 | Review PRs + Email | Auth System | — | — | — | — |
| Day 2–3 | Review PRs | Cases Module | Lawyers Module | Clients Module | — | — |
| Day 3 | Seeders | Cases Module | Lawyers Module | Clients Module | — | — |
| Day 3–4 | Email Service | Review + Unblock | Swagger Docs | Filters & Search | Hearings Module | — |
| Day 4 | Cron Jobs | Review + Unblock | Swagger Docs | Filters & Search | Hearings Module | Dashboard |
| Day 5 | Bug fixes + README | Final review | Swagger polish | Filters polish | Hearings polish | Dashboard polish |
| Day 6–7 | Demo prep + full test run | Support | — | — | — | — |

---

## PR Review Rules

| Rule | Detail |
|------|--------|
| All PRs reviewed by Shemaiah | No self-merges |
| PR must include | A brief description of what was built and how to test it |
| PR is blocked if | It breaks an existing route, missing validation, or returns inconsistent response shape |
| Beginner PRs | Kuol reviews first if Shemaiah is heads-down on critical path |
| Merge order | Tasks 1 → 2 → 3 before any beginner task is merged to `main` |

---

## Escalation Protocol

If any team member is stuck for **more than 30 minutes:**

1. Drop a message in the team group with: what you're trying to do, what you've tried, and the exact error
2. Shemaiah or Kuol picks it up within the hour
3. If it's a blocker that affects another person's task — escalate immediately, not after 30 minutes

---

*Docket Backend · Task Delegation v1.0 · March 2026*  
*Shemaiah is the team lead. When in doubt, ask. When blocked, say so immediately.*
