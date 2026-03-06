# Docket Backend — Endpoints & Test Cases
**Legal Case Management Platform · Capstone 2026**  
*Complete reference for all API endpoints, expected behaviours, and test cases the backend must satisfy before presentation.*

---

## Base URL

```
http://localhost:5000/api
```

All endpoints are prefixed with `/api`. All protected endpoints require:

```
Authorization: Bearer <JWT>
```

All responses follow this shape:

```json
// Success
{ "success": true, "message": "...", "data": { } }

// Error
{ "success": false, "message": "...", "status": 400 }
```

---

## 1. Authentication Endpoints

---

### POST /api/auth/login

**Description:** Authenticates a lawyer and returns a signed JWT.  
**Auth required:** No

**Request body:**
```json
{
  "email": "senior@docket.com",
  "password": "password123"
}
```

**Success response — 200:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "full_name": "Chukwuemeka Obi",
      "email": "senior@docket.com",
      "role": "senior_partner",
      "specialty": "Corporate Law"
    }
  }
}
```

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-AUTH-01 | Valid credentials | Correct email + password | 200 + JWT returned |
| TC-AUTH-02 | Wrong password | Correct email, wrong password | 401 Unauthorized |
| TC-AUTH-03 | Non-existent email | Email not in DB | 401 Unauthorized |
| TC-AUTH-04 | Missing email field | No email in body | 400 Bad Request |
| TC-AUTH-05 | Missing password field | No password in body | 400 Bad Request |
| TC-AUTH-06 | Invalid email format | `notanemail` | 400 Bad Request |
| TC-AUTH-07 | Empty request body | `{}` | 400 Bad Request |
| TC-AUTH-08 | Deactivated lawyer account | `is_active = false` | 401 Unauthorized |
| TC-AUTH-09 | SQL injection attempt | `" OR 1=1 --` in email | 401 — no data leak |

---

### POST /api/auth/logout

**Description:** Logs out the current user (invalidates session client-side).  
**Auth required:** Yes

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-AUTH-10 | Valid logout | Valid JWT in header | 200 + success message |
| TC-AUTH-11 | Logout without token | No Authorization header | 401 Unauthorized |
| TC-AUTH-12 | Logout with expired token | Expired JWT | 401 Unauthorized |

---

### GET /api/auth/me

**Description:** Returns the profile of the currently authenticated user.  
**Auth required:** Yes

**Success response — 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "full_name": "Chukwuemeka Obi",
    "email": "senior@docket.com",
    "role": "senior_partner",
    "specialty": "Corporate Law",
    "is_active": true
  }
}
```

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-AUTH-13 | Valid token | Correct JWT | 200 + user profile |
| TC-AUTH-14 | No token | Missing header | 401 Unauthorized |
| TC-AUTH-15 | Malformed token | `Bearer badtoken` | 401 Unauthorized |
| TC-AUTH-16 | Expired token | JWT past expiry | 401 Unauthorized |
| TC-AUTH-17 | Tampered token | Modified payload | 401 Unauthorized |

---

## 2. Lawyers Endpoints

---

### GET /api/lawyers

**Description:** Returns list of all active lawyers.  
**Auth required:** Yes — all roles

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-LAW-01 | Get all lawyers | Valid JWT (any role) | 200 + array of lawyers |
| TC-LAW-02 | No token | Missing header | 401 Unauthorized |
| TC-LAW-03 | Deactivated lawyers excluded | DB has inactive lawyer | Inactive lawyer not in response |
| TC-LAW-04 | Empty table | No lawyers in DB | 200 + empty array |

---

### POST /api/lawyers

**Description:** Creates a new lawyer account.  
**Auth required:** Yes — `senior_partner` only

**Request body:**
```json
{
  "full_name": "Adaeze Nwosu",
  "email": "adaeze@docket.com",
  "password": "securepass1",
  "specialty": "Civil Litigation",
  "role": "associate",
  "phone": "+2348012345678"
}
```

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-LAW-05 | Valid creation | All required fields | 201 + new lawyer (no password in response) |
| TC-LAW-06 | Associate tries to create | Associate JWT | 403 Forbidden |
| TC-LAW-07 | Secretary tries to create | Secretary JWT | 403 Forbidden |
| TC-LAW-08 | Duplicate email | Email already exists | 409 Conflict |
| TC-LAW-09 | Missing full_name | No full_name | 400 Bad Request |
| TC-LAW-10 | Missing email | No email | 400 Bad Request |
| TC-LAW-11 | Invalid email format | `notanemail` | 400 Bad Request |
| TC-LAW-12 | Missing role | No role field | 400 Bad Request |
| TC-LAW-13 | Invalid role value | `role: "admin"` | 400 Bad Request |
| TC-LAW-14 | Missing specialty | No specialty | 400 Bad Request |
| TC-LAW-15 | Password too short | `pass` (< 8 chars) | 400 Bad Request |
| TC-LAW-16 | Password stored as hash | Valid creation | Password in DB is bcrypt hash |

---

### GET /api/lawyers/:id

**Description:** Returns a single lawyer's profile and assigned cases.  
**Auth required:** Yes — all roles

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-LAW-17 | Valid ID | Existing lawyer UUID | 200 + lawyer profile + cases |
| TC-LAW-18 | Non-existent ID | Random UUID | 404 Not Found |
| TC-LAW-19 | Invalid UUID format | `abc123` | 400 Bad Request |
| TC-LAW-20 | No token | Missing header | 401 Unauthorized |

---

### PUT /api/lawyers/:id

**Description:** Updates a lawyer's profile.  
**Auth required:** Yes — `senior_partner` only

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-LAW-21 | Valid update | Valid fields + senior_partner JWT | 200 + updated lawyer |
| TC-LAW-22 | Associate tries to update | Associate JWT | 403 Forbidden |
| TC-LAW-23 | Update with duplicate email | Email belongs to another lawyer | 409 Conflict |
| TC-LAW-24 | Non-existent ID | Random UUID | 404 Not Found |
| TC-LAW-25 | Update own password | Valid new password | 200 — password re-hashed |

---

### PATCH /api/lawyers/:id/deactivate

**Description:** Soft-deactivates a lawyer account (`is_active = false`).  
**Auth required:** Yes — `senior_partner` only

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-LAW-26 | Valid deactivation | Existing lawyer ID | 200 + `is_active: false` |
| TC-LAW-27 | Associate tries | Associate JWT | 403 Forbidden |
| TC-LAW-28 | Non-existent ID | Random UUID | 404 Not Found |
| TC-LAW-29 | Already deactivated | `is_active` already false | 200 — idempotent |
| TC-LAW-30 | Deactivated lawyer login | After deactivation | 401 Unauthorized |

---

## 3. Clients Endpoints

---

### GET /api/clients

**Description:** Returns list of all active clients with optional search.  
**Auth required:** Yes — all roles

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-CLI-01 | Get all clients | Valid JWT | 200 + array of clients |
| TC-CLI-02 | Search by name | `?search=johnson` | 200 + matching clients only |
| TC-CLI-03 | Search by email | `?search=johnson@gmail` | 200 + matching clients |
| TC-CLI-04 | No match | `?search=zzznomatch` | 200 + empty array |
| TC-CLI-05 | No token | Missing header | 401 Unauthorized |

---

### POST /api/clients

**Description:** Creates a new client profile.  
**Auth required:** Yes — `senior_partner`, `secretary`

**Request body:**
```json
{
  "full_name": "Emeka Johnson",
  "email": "emeka@johnson.com",
  "phone": "+2348023456789",
  "client_type": "individual",
  "address": "14 Broad Street, Lagos"
}
```

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-CLI-06 | Valid creation | All required fields | 201 + new client |
| TC-CLI-07 | Associate tries | Associate JWT | 403 Forbidden |
| TC-CLI-08 | Duplicate email | Email already exists | 409 Conflict |
| TC-CLI-09 | Missing full_name | No full_name | 400 Bad Request |
| TC-CLI-10 | Missing email | No email | 400 Bad Request |
| TC-CLI-11 | Invalid email | `notanemail` | 400 Bad Request |
| TC-CLI-12 | Missing phone | No phone | 400 Bad Request |
| TC-CLI-13 | Invalid client_type | `type: "business"` | 400 Bad Request |
| TC-CLI-14 | Missing client_type | No type field | 400 Bad Request |
| TC-CLI-15 | Address optional | No address field | 201 — address null |

---

### GET /api/clients/:id

**Description:** Returns a client's profile and all associated cases.  
**Auth required:** Yes — all roles

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-CLI-16 | Valid ID | Existing client UUID | 200 + client + cases array |
| TC-CLI-17 | Non-existent ID | Random UUID | 404 Not Found |
| TC-CLI-18 | No token | Missing header | 401 Unauthorized |

---

### PUT /api/clients/:id

**Description:** Updates a client's profile.  
**Auth required:** Yes — `senior_partner`, `secretary`

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-CLI-19 | Valid update | Valid fields | 200 + updated client |
| TC-CLI-20 | Associate tries | Associate JWT | 403 Forbidden |
| TC-CLI-21 | Duplicate email on update | Email belongs to another client | 409 Conflict |
| TC-CLI-22 | Non-existent ID | Random UUID | 404 Not Found |

---

### DELETE /api/clients/:id

**Description:** Soft-deletes a client (marks inactive, not removed from DB).  
**Auth required:** Yes — `senior_partner` only

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-CLI-23 | Valid delete | Existing client ID | 200 + success |
| TC-CLI-24 | Associate tries | Associate JWT | 403 Forbidden |
| TC-CLI-25 | Secretary tries | Secretary JWT | 403 Forbidden |
| TC-CLI-26 | Non-existent ID | Random UUID | 404 Not Found |
| TC-CLI-27 | Deleted client in GET /clients | After delete | Client not returned in list |

---

## 4. Cases Endpoints

---

### GET /api/cases

**Description:** Returns list of cases. Associates see only their assigned cases.  
**Auth required:** Yes — all roles

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-CASE-01 | Senior partner gets all | senior_partner JWT | 200 + all cases |
| TC-CASE-02 | Associate gets own only | associate JWT | 200 + only assigned cases |
| TC-CASE-03 | Secretary gets all | secretary JWT | 200 + all cases |
| TC-CASE-04 | No token | Missing header | 401 Unauthorized |
| TC-CASE-05 | Empty result | No cases in DB | 200 + empty array |

---

### POST /api/cases

**Description:** Creates a new case. Case ID auto-generated as SLT-XXX.  
**Auth required:** Yes — `senior_partner`, `secretary`

**Request body:**
```json
{
  "title": "Johnson v. Federal Republic of Nigeria",
  "description": "Criminal appeal case",
  "case_type": "Criminal",
  "client_id": "uuid",
  "lawyer_id": "uuid",
  "filed_date": "2026-03-06"
}
```

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-CASE-06 | Valid creation | All required fields | 201 + case with SLT-XXX ID |
| TC-CASE-07 | Associate tries | Associate JWT | 403 Forbidden |
| TC-CASE-08 | Missing title | No title | 400 Bad Request |
| TC-CASE-09 | Title too short | title < 5 chars | 400 Bad Request |
| TC-CASE-10 | Title too long | title > 300 chars | 400 Bad Request |
| TC-CASE-11 | Missing client_id | No client_id | 400 Bad Request |
| TC-CASE-12 | Non-existent client_id | UUID not in clients | 404 Not Found |
| TC-CASE-13 | Non-existent lawyer_id | UUID not in lawyers | 404 Not Found |
| TC-CASE-14 | Invalid case_type | `case_type: "Other"` | 400 Bad Request |
| TC-CASE-15 | Future filed_date | Date in future | 400 Bad Request |
| TC-CASE-16 | Status defaults to Pending | No status provided | 201 + `status: "Pending"` |
| TC-CASE-17 | lawyer_id optional | No lawyer_id | 201 + `lawyer_id: null` |
| TC-CASE-18 | Case ID auto-increments | Create 3 cases | SLT-001, SLT-002, SLT-003 |
| TC-CASE-19 | Inactive client rejected | client with `is_active: false` | 400 Bad Request |

---

### GET /api/cases/:id

**Description:** Returns full case details.  
**Auth required:** Yes — all roles

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-CASE-20 | Valid case ID | Existing case ID | 200 + full case details |
| TC-CASE-21 | Non-existent ID | `SLT-999` | 404 Not Found |
| TC-CASE-22 | No token | Missing header | 401 Unauthorized |

---

### PUT /api/cases/:id

**Description:** Updates case fields. Associates can only update their own assigned cases.  
**Auth required:** Yes — `senior_partner`, `secretary`, assigned `associate`

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-CASE-23 | Senior partner updates any case | Any case ID | 200 + updated case |
| TC-CASE-24 | Associate updates own case | Case assigned to them | 200 + updated case |
| TC-CASE-25 | Associate updates other's case | Case not assigned to them | 403 Forbidden |
| TC-CASE-26 | Non-existent case | `SLT-999` | 404 Not Found |
| TC-CASE-27 | Title too short on update | title < 5 chars | 400 Bad Request |

---

### DELETE /api/cases/:id

**Description:** Soft-deletes a case.  
**Auth required:** Yes — `senior_partner` only

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-CASE-28 | Valid delete | Existing case ID | 200 + success |
| TC-CASE-29 | Associate tries | Associate JWT | 403 Forbidden |
| TC-CASE-30 | Secretary tries | Secretary JWT | 403 Forbidden |
| TC-CASE-31 | Non-existent case | `SLT-999` | 404 Not Found |
| TC-CASE-32 | Deleted case in GET /cases | After delete | Case not returned in list |

---

### PATCH /api/cases/:id/assign

**Description:** Assigns or reassigns a lawyer to a case.  
**Auth required:** Yes — `senior_partner`, `secretary`

**Request body:**
```json
{ "lawyer_id": "uuid" }
```

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-CASE-33 | Valid assignment | Active lawyer ID | 200 + updated case |
| TC-CASE-34 | Associate tries | Associate JWT | 403 Forbidden |
| TC-CASE-35 | Non-existent lawyer_id | Random UUID | 404 Not Found |
| TC-CASE-36 | Inactive lawyer | `is_active: false` lawyer | 400 Bad Request |
| TC-CASE-37 | Reassign to null | `lawyer_id: null` | 200 + `lawyer_id: null` |

---

### PATCH /api/cases/:id/status

**Description:** Updates case status. Enforces lifecycle transition rules.  
**Auth required:** Yes — all roles (with lifecycle restrictions)

**Request body:**
```json
{ "status": "Active" }
```

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-CASE-38 | Valid transition | Pending → Active | 200 + updated status |
| TC-CASE-39 | Invalid status value | `status: "Resolved"` | 400 Bad Request |
| TC-CASE-40 | Invalid lifecycle transition | Closed → Pending (non-partner) | 403 Forbidden |
| TC-CASE-41 | Senior partner reopens closed | Closed → Active | 200 + updated status |
| TC-CASE-42 | closed_date set on close | Status → Closed | 200 + `closed_date` populated |
| TC-CASE-43 | closed_date cleared on reopen | Closed → Active | 200 + `closed_date: null` |

---

### GET /api/cases/:id/hearings

**Description:** Returns all hearings for a specific case.  
**Auth required:** Yes — all roles

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-CASE-44 | Valid case with hearings | Case with scheduled hearings | 200 + hearings array |
| TC-CASE-45 | Case with no hearings | Case never had hearing | 200 + empty array |
| TC-CASE-46 | Non-existent case | `SLT-999` | 404 Not Found |

---

## 5. Hearings Endpoints

---

### GET /api/hearings

**Description:** Returns hearings list with optional filters.  
**Auth required:** Yes — all roles

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-HEAR-01 | Get all hearings | Valid JWT | 200 + hearings array |
| TC-HEAR-02 | Filter upcoming | `?filter=upcoming` | 200 + only future hearings |
| TC-HEAR-03 | Filter this week | `?filter=this_week` | 200 + hearings within 7 days |
| TC-HEAR-04 | Filter by case | `?case_id=SLT-001` | 200 + hearings for that case only |
| TC-HEAR-05 | Urgency flag in response | Hearing ≤3 days away | Response includes `urgency: "red"` |
| TC-HEAR-06 | Urgency orange | Hearing ≤7 days away | Response includes `urgency: "orange"` |
| TC-HEAR-07 | Urgency green | Hearing >7 days away | Response includes `urgency: "green"` |
| TC-HEAR-08 | No token | Missing header | 401 Unauthorized |

---

### POST /api/hearings

**Description:** Schedules a new hearing for a case.  
**Auth required:** Yes — all roles

**Request body:**
```json
{
  "case_id": "SLT-001",
  "hearing_date": "2026-04-15",
  "hearing_time": "09:00",
  "court_name": "High Court Lagos",
  "notes": "Bring certified copies of exhibits"
}
```

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-HEAR-09 | Valid creation | Future date, existing case | 201 + new hearing |
| TC-HEAR-10 | Past hearing date | Date in the past | 400 Bad Request |
| TC-HEAR-11 | Today's date | hearing_date = today | 400 Bad Request |
| TC-HEAR-12 | Missing case_id | No case_id | 400 Bad Request |
| TC-HEAR-13 | Non-existent case_id | `SLT-999` | 404 Not Found |
| TC-HEAR-14 | Closed case | Case status = Closed | 422 Unprocessable Entity |
| TC-HEAR-15 | Invalid time format | `hearing_time: "9am"` | 400 Bad Request |
| TC-HEAR-16 | Valid time format | `hearing_time: "14:30"` | 201 — time stored correctly |
| TC-HEAR-17 | Time field optional | No hearing_time | 201 — `hearing_time: null` |
| TC-HEAR-18 | court_name optional | No court_name | 201 — `court_name: null` |
| TC-HEAR-19 | notes optional | No notes | 201 — `notes: null` |

---

### GET /api/hearings/:id

**Description:** Returns a single hearing's details.  
**Auth required:** Yes — all roles

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-HEAR-20 | Valid ID | Existing hearing UUID | 200 + hearing details |
| TC-HEAR-21 | Non-existent ID | Random UUID | 404 Not Found |
| TC-HEAR-22 | No token | Missing header | 401 Unauthorized |

---

### PUT /api/hearings/:id

**Description:** Updates hearing details (reschedule, add notes, record outcome).  
**Auth required:** Yes — `senior_partner`, `secretary`, assigned `associate`

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-HEAR-23 | Valid update | Future date, valid fields | 200 + updated hearing |
| TC-HEAR-24 | Reschedule to past date | Past date | 400 Bad Request |
| TC-HEAR-25 | Associate updates own case hearing | Hearing on their case | 200 + updated |
| TC-HEAR-26 | Associate updates other case hearing | Not their case | 403 Forbidden |
| TC-HEAR-27 | Non-existent hearing | Random UUID | 404 Not Found |
| TC-HEAR-28 | Add outcome post-hearing | outcome field | 200 + outcome saved |

---

### DELETE /api/hearings/:id

**Description:** Removes a scheduled hearing.  
**Auth required:** Yes — `senior_partner`, `secretary`

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-HEAR-29 | Valid delete | Existing hearing UUID | 200 + success |
| TC-HEAR-30 | Associate tries | Associate JWT | 403 Forbidden |
| TC-HEAR-31 | Non-existent ID | Random UUID | 404 Not Found |

---

## 6. Dashboard Endpoints

---

### GET /api/dashboard/stats

**Description:** Returns aggregate statistics. Associates get personal stats only.  
**Auth required:** Yes — all roles

**Success response — 200:**
```json
{
  "success": true,
  "data": {
    "totalCases": 42,
    "activeCases": 18,
    "pendingCases": 9,
    "urgentCases": 3,
    "inReviewCases": 5,
    "closedCases": 7,
    "hearingsThisWeek": 6
  }
}
```

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-DASH-01 | Senior partner stats | senior_partner JWT | 200 + firm-wide totals |
| TC-DASH-02 | Secretary stats | secretary JWT | 200 + firm-wide totals |
| TC-DASH-03 | Associate stats | associate JWT | 200 + stats scoped to their cases only |
| TC-DASH-04 | hearingsThisWeek accuracy | Seed hearings within 7 days | Count matches seeded hearings |
| TC-DASH-05 | No token | Missing header | 401 Unauthorized |

---

### GET /api/dashboard/upcoming-hearings

**Description:** Returns the next 10 upcoming hearings sorted by date ascending.  
**Auth required:** Yes — all roles

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-DASH-06 | Returns max 10 | DB has 15 upcoming | Only 10 returned |
| TC-DASH-07 | Sorted by date | Mixed dates | Earliest date first |
| TC-DASH-08 | Urgency flags present | Hearings within 3 days | `urgency: "red"` on those hearings |
| TC-DASH-09 | No upcoming hearings | No future hearings in DB | 200 + empty array |
| TC-DASH-10 | Associate sees own only | Associate JWT | Only hearings on their cases |

---

### GET /api/dashboard/recent-cases

**Description:** Returns the last 10 cases ordered by `updated_at` descending.  
**Auth required:** Yes — all roles

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| TC-DASH-11 | Returns max 10 | DB has 20 cases | Only 10 returned |
| TC-DASH-12 | Sorted by updated_at | Mixed update times | Most recently updated first |
| TC-DASH-13 | Associate sees own only | Associate JWT | Only their assigned cases |
| TC-DASH-14 | No cases in DB | Empty cases table | 200 + empty array |

---

## 7. Cross-Cutting Test Cases

### Authentication & Security

| # | Test Case | Expected |
|---|-----------|----------|
| TC-SEC-01 | Every protected route without token | 401 on all |
| TC-SEC-02 | Every protected route with expired token | 401 on all |
| TC-SEC-03 | Every protected route with tampered token | 401 on all |
| TC-SEC-04 | Role-restricted route with wrong role | 403 on all |
| TC-SEC-05 | Password never returned in any response | No `password` field in any response body |
| TC-SEC-06 | SQL injection in query params | No crash, no data leak |
| TC-SEC-07 | XSS in string fields | Stored safely, not executed |

### Validation & Error Handling

| # | Test Case | Expected |
|---|-----------|----------|
| TC-VAL-01 | All required fields missing | 400 with field-level error messages |
| TC-VAL-02 | Extra unknown fields in body | Ignored, no crash |
| TC-VAL-03 | Integer field receives string | 400 Bad Request |
| TC-VAL-04 | UUID field receives invalid format | 400 Bad Request |
| TC-VAL-05 | ENUM field receives invalid value | 400 with valid options listed |
| TC-VAL-06 | Very long string in text field | 400 if over max length |
| TC-VAL-07 | Database constraint violation | 409 or 400 — no 500 error leaked |

### Response Consistency

| # | Test Case | Expected |
|---|-----------|----------|
| TC-RES-01 | All success responses | `{ success: true, data: ... }` |
| TC-RES-02 | All error responses | `{ success: false, message: "...", status: N }` |
| TC-RES-03 | 404 on unknown route | `{ success: false, message: "Route not found", status: 404 }` |
| TC-RES-04 | Content-Type header | All responses return `application/json` |
| TC-RES-05 | Timestamps in responses | `created_at` and `updated_at` present on all models |

---

## Endpoint Summary Table

| Method | Endpoint | Auth | Min Role |
|--------|----------|------|----------|
| POST | /api/auth/login | ❌ | — |
| POST | /api/auth/logout | ✅ | Any |
| GET | /api/auth/me | ✅ | Any |
| GET | /api/lawyers | ✅ | Any |
| POST | /api/lawyers | ✅ | senior_partner |
| GET | /api/lawyers/:id | ✅ | Any |
| PUT | /api/lawyers/:id | ✅ | senior_partner |
| PATCH | /api/lawyers/:id/deactivate | ✅ | senior_partner |
| GET | /api/clients | ✅ | Any |
| POST | /api/clients | ✅ | senior_partner, secretary |
| GET | /api/clients/:id | ✅ | Any |
| PUT | /api/clients/:id | ✅ | senior_partner, secretary |
| DELETE | /api/clients/:id | ✅ | senior_partner |
| GET | /api/cases | ✅ | Any |
| POST | /api/cases | ✅ | senior_partner, secretary |
| GET | /api/cases/:id | ✅ | Any |
| PUT | /api/cases/:id | ✅ | senior_partner, secretary, assigned associate |
| DELETE | /api/cases/:id | ✅ | senior_partner |
| PATCH | /api/cases/:id/assign | ✅ | senior_partner, secretary |
| PATCH | /api/cases/:id/status | ✅ | Any (lifecycle rules apply) |
| GET | /api/cases/:id/hearings | ✅ | Any |
| GET | /api/hearings | ✅ | Any |
| POST | /api/hearings | ✅ | Any |
| GET | /api/hearings/:id | ✅ | Any |
| PUT | /api/hearings/:id | ✅ | senior_partner, secretary, assigned associate |
| DELETE | /api/hearings/:id | ✅ | senior_partner, secretary |
| GET | /api/dashboard/stats | ✅ | Any |
| GET | /api/dashboard/upcoming-hearings | ✅ | Any |
| GET | /api/dashboard/recent-cases | ✅ | Any |

**Total endpoints: 29**  
**Total test cases: 115+**

---

*Docket Backend · Endpoints & Test Cases v1.0 · March 2026*
