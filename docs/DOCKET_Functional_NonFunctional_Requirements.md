# Docket Backend — Functional & Non-Functional Requirements
**Legal Case Management Platform · Capstone 2026**  
*Functional requirements define what the system must do. Non-functional requirements define how well it must do it.*

---

## Part 1 — Functional Requirements

Functional requirements describe specific behaviours the backend API must exhibit. Each is labelled with a priority (Must / Should / Could) and the module it belongs to.

---

### FR-01 — Authentication

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01.1 | The system must authenticate users via email and password | Must |
| FR-01.2 | On successful login, the system must return a signed JWT containing the user's `id`, `email`, and `role` | Must |
| FR-01.3 | The system must reject login attempts from deactivated lawyer accounts | Must |
| FR-01.4 | The system must hash all passwords using bcrypt before storage | Must |
| FR-01.5 | The system must never return a password field in any API response | Must |
| FR-01.6 | The system must provide an auth middleware that validates the JWT on every protected route | Must |
| FR-01.7 | The system must provide a role middleware that enforces access control per endpoint | Must |
| FR-01.8 | The system must return 401 for missing, expired, or tampered tokens | Must |
| FR-01.9 | The system must return 403 when a valid user attempts an action their role does not permit | Must |
| FR-01.10 | The system must expose a `GET /api/auth/me` endpoint that returns the authenticated user's profile | Must |

---

### FR-02 — Lawyers Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-02.1 | The system must allow `senior_partner` to create new lawyer accounts | Must |
| FR-02.2 | The system must return a list of all active lawyers (`is_active = true`) | Must |
| FR-02.3 | The system must return a single lawyer's profile and their associated cases | Must |
| FR-02.4 | The system must allow `senior_partner` to update any lawyer's profile | Should |
| FR-02.5 | The system must allow `senior_partner` to deactivate a lawyer (soft-delete via `is_active = false`) | Must |
| FR-02.6 | The system must reject creation of a lawyer account with a duplicate email | Must |
| FR-02.7 | The system must validate that `role` is one of: `senior_partner`, `associate`, `secretary` | Must |
| FR-02.8 | The system must reject lawyer creation if `password` is fewer than 8 characters | Must |

---

### FR-03 — Clients Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-03.1 | The system must allow `senior_partner` and `secretary` to create client profiles | Must |
| FR-03.2 | The system must return a list of all active clients with optional text search | Must |
| FR-03.3 | The system must return a single client's profile alongside all cases linked to that client | Must |
| FR-03.4 | The system must allow `senior_partner` and `secretary` to update client profiles | Must |
| FR-03.5 | The system must allow `senior_partner` to soft-delete a client | Should |
| FR-03.6 | The system must reject client creation with a duplicate email | Must |
| FR-03.7 | The system must validate `client_type` as one of: `individual`, `corporate` | Must |
| FR-03.8 | The system must validate phone numbers against Nigerian (+234) or international format | Must |
| FR-03.9 | The system must not allow `associate` to create, update, or delete client profiles | Must |

---

### FR-04 — Cases Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-04.1 | The system must auto-generate case IDs in the format `SLT-001`, `SLT-002` etc. | Must |
| FR-04.2 | The system must allow `senior_partner` and `secretary` to create cases | Must |
| FR-04.3 | The system must not allow `associate` to create cases | Must |
| FR-04.4 | The system must default case `status` to `Pending` when not provided | Must |
| FR-04.5 | The system must reject case creation if `filed_date` is a future date | Must |
| FR-04.6 | The system must reject case creation if `client_id` does not reference an active client | Must |
| FR-04.7 | The system must reject case creation if `lawyer_id` (when provided) does not reference an active lawyer | Must |
| FR-04.8 | The system must return all cases for `senior_partner` and `secretary` | Must |
| FR-04.9 | The system must return only assigned cases when the requester is an `associate` | Must |
| FR-04.10 | The system must allow `associate` to update only cases assigned to them | Must |
| FR-04.11 | The system must restrict case deletion to `senior_partner` only | Must |
| FR-04.12 | Case deletion must be a soft-delete — the record is retained in the database | Must |
| FR-04.13 | The system must enforce the case status lifecycle transition matrix | Must |
| FR-04.14 | The system must set `closed_date` automatically when status changes to `Closed` | Must |
| FR-04.15 | The system must clear `closed_date` when a Closed case is reopened | Should |
| FR-04.16 | Only `senior_partner` may transition a case from `Closed` to `Active` | Must |
| FR-04.17 | The system must validate `case_type` against allowed ENUM values | Must |
| FR-04.18 | The system must support filtering cases by `status`, `case_type`, `lawyer_id` | Must |
| FR-04.19 | The system must support text search on cases across title, case ID, and client name | Must |
| FR-04.20 | The system must support pagination on all list endpoints | Should |

---

### FR-05 — Hearings Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-05.1 | Any authenticated user may schedule a hearing | Must |
| FR-05.2 | The system must reject hearing creation if `hearing_date` is not a future date | Must |
| FR-05.3 | The system must reject hearing creation if the case status is `Closed` | Must |
| FR-05.4 | The system must validate `hearing_time` as `HH:MM` 24-hour format when provided | Must |
| FR-05.5 | The system must include an `urgency` flag on every hearing response (`red`, `orange`, `green`) | Must |
| FR-05.6 | Urgency must be computed as: ≤3 days = `red`, ≤7 days = `orange`, >7 days = `green` | Must |
| FR-05.7 | The system must allow updates to hearing `notes` and `outcome` fields | Should |
| FR-05.8 | The system must allow `senior_partner` and `secretary` to delete hearings | Must |
| FR-05.9 | The system must restrict hearing edits to `senior_partner`, `secretary`, and the lawyer assigned to that case | Must |
| FR-05.10 | The system must support filtering hearings by `upcoming`, `this_week`, and `case_id` | Should |

---

### FR-06 — Dashboard Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-06.1 | The system must return aggregate case counts by status for the dashboard | Must |
| FR-06.2 | The system must return a count of hearings scheduled within the next 7 days | Must |
| FR-06.3 | The system must return the next 10 upcoming hearings sorted by date ascending | Must |
| FR-06.4 | The system must return the 10 most recently updated cases | Must |
| FR-06.5 | Dashboard stats for `associate` must be scoped to their assigned cases only | Must |
| FR-06.6 | Dashboard stats for `senior_partner` and `secretary` must be firm-wide | Must |

---

### FR-07 — Email & Notifications

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-07.1 | The system must send a welcome email when a new lawyer account is created | Should |
| FR-07.2 | The system must send a hearing confirmation email when a hearing is scheduled | Should |
| FR-07.3 | The system must send alert emails for hearings ≤3 days away | Should |
| FR-07.4 | The system must send alert emails for hearings ≤1 day away | Should |
| FR-07.5 | The email alert job must run as a scheduled background task (cron) | Should |
| FR-07.6 | Email alerts must be sent to the assigned lawyer and the senior partner | Should |

---

### FR-08 — Data Integrity & General

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-08.1 | All list endpoints must exclude soft-deleted records | Must |
| FR-08.2 | All responses must follow a consistent JSON shape: `{ success, message, data }` | Must |
| FR-08.3 | All error responses must include a human-readable `message` and numeric `status` | Must |
| FR-08.4 | All models must include `created_at` and `updated_at` timestamps | Must |
| FR-08.5 | The system must expose `GET /api/health` as an unauthenticated health check | Must |
| FR-08.6 | The system must validate all input using `express-validator` before processing | Must |
| FR-08.7 | The system must expose Swagger documentation at `GET /api/docs` | Should |
| FR-08.8 | All primary keys for new records must be UUIDs (except cases which use SLT-XXX) | Must |

---

## Part 2 — Non-Functional Requirements

Non-functional requirements define quality attributes — how the system must behave, not just what it must do.

---

### NFR-01 — Performance

| ID | Requirement | Target | How Verified |
|----|-------------|--------|-------------|
| NFR-01.1 | All CRUD API responses must be returned within an acceptable time | < 500ms | Manual Postman timing |
| NFR-01.2 | Dashboard aggregation queries must not cause noticeable lag | < 800ms | Postman timing with seeded data |
| NFR-01.3 | List endpoints with 50+ records must still respond quickly | < 600ms | Load test with seeded data |
| NFR-01.4 | Search queries must return results without full table scans on large datasets | Indexed fields | DB query inspection |

---

### NFR-02 — Security

| ID | Requirement | Target | How Verified |
|----|-------------|--------|-------------|
| NFR-02.1 | All passwords must be hashed with bcrypt before storage | bcrypt cost factor ≥ 10 | DB inspection |
| NFR-02.2 | JWTs must be signed with a strong secret stored in `.env` — never hardcoded | Secret ≥ 32 chars | Code review |
| NFR-02.3 | JWT expiry must be enforced — expired tokens must return 401 | Configurable via env | Test with expired token |
| NFR-02.4 | All role checks must be enforced at the API level — frontend cannot bypass them | 403 on unauthorized calls | Security test suite |
| NFR-02.5 | No sensitive data (password, raw token) must ever appear in an API response | Absent from all responses | Response inspection |
| NFR-02.6 | The API must use Helmet.js to set secure HTTP headers | Headers present | Browser dev tools |
| NFR-02.7 | CORS must be configured to only allow requests from known origins | Configured origins | Postman + browser test |
| NFR-02.8 | The API must not expose raw database error messages to the client | Generic 500 message | Test invalid DB states |

---

### NFR-03 — Reliability & Error Handling

| ID | Requirement | Target | How Verified |
|----|-------------|--------|-------------|
| NFR-03.1 | The API must never return an unhandled 500 error to the client | Global error handler catches all | Test all error states |
| NFR-03.2 | Validation errors must return field-level messages, not a generic failure | Error array per field | Test invalid inputs |
| NFR-03.3 | Form data must not be lost on failed API calls — the API must return enough info to repopulate the form | Field errors in response | Frontend integration test |
| NFR-03.4 | All database operations must fail gracefully with appropriate HTTP status codes | 404, 409, 422, 400 used correctly | Test suite |
| NFR-03.5 | The app must start up and validate that all required environment variables are present | Startup check | Remove a required env var |

---

### NFR-04 — Maintainability

| ID | Requirement | Target | How Verified |
|----|-------------|--------|-------------|
| NFR-04.1 | Route handlers must delegate business logic to service/controller files — not inline in route definitions | Separated layers | Code review |
| NFR-04.2 | No single file should exceed 200 lines of code | < 200 lines | Code review |
| NFR-04.3 | All environment-specific config must be in `.env` — no hardcoded values in source code | Zero hardcoded secrets | Code review |
| NFR-04.4 | Database changes must be made via Sequelize migrations — not manual SQL | Migration files present | DB migration history |
| NFR-04.5 | The codebase must follow a consistent folder structure as defined in the project setup | Structure enforced | Code review |

---

### NFR-05 — Usability (Developer Experience)

| ID | Requirement | Target | How Verified |
|----|-------------|--------|-------------|
| NFR-05.1 | The API must be fully documented with Swagger at `/api/docs` | All 29 endpoints documented | Open Swagger UI |
| NFR-05.2 | A Postman collection must be provided for all endpoints | Collection file in repo | Import into Postman |
| NFR-05.3 | The README must include setup instructions, env variable reference, and seed credentials | Complete README | New team member setup test |
| NFR-05.4 | Running `npm run seed` must populate the DB with enough data to demo all features | ≥ 15 cases, all statuses | Run seed + visual check |

---

### NFR-06 — Compatibility

| ID | Requirement | Target | How Verified |
|----|-------------|--------|-------------|
| NFR-06.1 | The API must serve the web frontend (React) and mobile app (React Native) from the same endpoints | No platform-specific routes | Cross-client testing |
| NFR-06.2 | The API must handle CORS preflight requests correctly for browser-based clients | OPTIONS returns 200 | Browser dev tools |
| NFR-06.3 | All date/time values must be stored and returned in ISO 8601 format | `YYYY-MM-DD` / `HH:MM` | Response inspection |
| NFR-06.4 | All timezone handling assumes WAT (UTC+1) for V1 | No timezone conversion needed | Data inspection |

---

## Requirements Summary

| Category | Must | Should | Could | Total |
|----------|------|--------|-------|-------|
| Authentication | 10 | 0 | 0 | 10 |
| Lawyers | 7 | 1 | 0 | 8 |
| Clients | 8 | 1 | 0 | 9 |
| Cases | 17 | 3 | 0 | 20 |
| Hearings | 8 | 2 | 0 | 10 |
| Dashboard | 6 | 0 | 0 | 6 |
| Email & Notifications | 0 | 6 | 0 | 6 |
| Data Integrity | 7 | 1 | 0 | 8 |
| **Functional Total** | **63** | **14** | **0** | **77** |
| Performance | — | — | — | 4 |
| Security | — | — | — | 8 |
| Reliability | — | — | — | 5 |
| Maintainability | — | — | — | 5 |
| Developer Experience | — | — | — | 4 |
| Compatibility | — | — | — | 4 |
| **Non-Functional Total** | — | — | — | **30** |
| **Grand Total** | — | — | — | **107** |

---

*Docket Backend · Functional & Non-Functional Requirements v1.0 · March 2026*
