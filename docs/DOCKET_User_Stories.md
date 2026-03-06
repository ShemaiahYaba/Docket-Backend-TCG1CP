# Docket Backend — User Stories
**Legal Case Management Platform · Capstone 2026**  
*Each story maps to a persona's real need and defines what the backend must support to fulfil it. Priority follows MoSCoW: Must / Should / Could.*

---

## Format

> As a **[role]**, I want to **[action]** so that **[outcome]**.

Each story includes the backend endpoint(s) that satisfy it and the acceptance criteria the API must meet.

---

## 1. Authentication Stories

| ID | Story | Priority |
|----|-------|----------|
| US-AUTH-01 | As a **lawyer**, I want to log in with my email and password so that I can access the system securely. | **Must** |
| US-AUTH-02 | As a **logged-in user**, I want my session to persist via a token so that I don't have to log in on every request. | **Must** |
| US-AUTH-03 | As a **logged-in user**, I want to log out so that my session is ended and my account is protected. | **Must** |
| US-AUTH-04 | As a **logged-in user**, I want to retrieve my own profile so that I can confirm who I am authenticated as. | **Must** |

### Acceptance Criteria

**US-AUTH-01**
- `POST /api/auth/login` with valid credentials returns a signed JWT and user profile
- Invalid credentials return 401 with no sensitive information leaked
- Deactivated accounts cannot log in

**US-AUTH-02**
- JWT contains `id`, `email`, and `role` in the payload
- All protected routes accept the token via `Authorization: Bearer <token>` header
- Expired tokens return 401

**US-AUTH-03**
- `POST /api/auth/logout` with a valid token returns 200
- Calling any protected route after logout returns 401

**US-AUTH-04**
- `GET /api/auth/me` returns the authenticated user's profile
- Password is never included in the response

---

## 2. Case Management Stories

| ID | Story | Priority |
|----|-------|----------|
| US-CASE-01 | As a **senior partner**, I want to view all cases in the firm so that I can oversee operations without asking each lawyer. | **Must** |
| US-CASE-02 | As a **legal secretary**, I want to create a new case so that it is tracked from day one. | **Must** |
| US-CASE-03 | As an **associate lawyer**, I want to see only my assigned cases by default so that I can focus on my workload. | **Must** |
| US-CASE-04 | As any **authenticated user**, I want to update the status of a case so that the team has an accurate view at all times. | **Must** |
| US-CASE-05 | As a **senior partner**, I want to mark a case as Urgent so that the team knows it requires immediate attention. | **Must** |
| US-CASE-06 | As a **legal secretary**, I want to search for a case by title, client name, or case ID so that I can find any record in seconds. | **Must** |
| US-CASE-07 | As any **authenticated user**, I want to filter cases by status and case type so that I can focus on a specific segment. | **Must** |
| US-CASE-08 | As an **associate lawyer**, I want to view the full details of a case so that I have all the context I need. | **Must** |
| US-CASE-09 | As a **legal secretary**, I want to edit case details after creation so that mistakes can be corrected. | **Must** |
| US-CASE-10 | As a **senior partner**, I want to delete erroneous cases so that test or duplicate entries don't clutter the system. | **Should** |
| US-CASE-11 | As a **senior partner**, I want to assign or reassign a lawyer to a case so that ownership is always clear. | **Must** |
| US-CASE-12 | As a **senior partner**, I want to reopen a closed case so that cases that resurface can be tracked again. | **Should** |

### Acceptance Criteria

**US-CASE-01**
- `GET /api/cases` with a `senior_partner` JWT returns all cases regardless of assigned lawyer

**US-CASE-02**
- `POST /api/cases` creates a case with auto-generated ID (SLT-XXX format)
- `client_id` must reference an existing active client
- `status` defaults to Pending if not provided
- `filed_date` cannot be a future date

**US-CASE-03**
- `GET /api/cases` with an `associate` JWT returns only cases where `lawyer_id = req.user.id`

**US-CASE-04**
- `PATCH /api/cases/:id/status` enforces the lifecycle transition matrix
- Invalid transitions return 422 with a clear message

**US-CASE-05**
- Status `Urgent` is a valid transition from `Active` and `In Review`
- Urgent cases are included in dashboard stats with their own count

**US-CASE-06 / US-CASE-07**
- `GET /api/cases?search=johnson` returns cases matching title, ID, or client name
- `GET /api/cases?status=Active&case_type=Criminal` returns intersection of both filters

**US-CASE-09**
- `PUT /api/cases/:id` allows updating title, description, case_type, status, lawyer_id
- Associate can only update cases where they are the assigned lawyer

**US-CASE-10**
- `DELETE /api/cases/:id` is soft-delete — record remains in DB with a deleted flag
- Only `senior_partner` JWT can call this endpoint

**US-CASE-11**
- `PATCH /api/cases/:id/assign` updates `lawyer_id`
- Referenced lawyer must be active

**US-CASE-12**
- `PATCH /api/cases/:id/status` with `{ status: "Active" }` on a Closed case only succeeds with a `senior_partner` JWT

---

## 3. Client Management Stories

| ID | Story | Priority |
|----|-------|----------|
| US-CLI-01 | As a **legal secretary**, I want to create a new client profile so that clients are on record before their case is filed. | **Must** |
| US-CLI-02 | As any **authenticated user**, I want to view a client's profile and linked cases so that I have full context before a call. | **Must** |
| US-CLI-03 | As a **legal secretary**, I want to search the client directory so that I can find a client in seconds. | **Must** |
| US-CLI-04 | As a **legal secretary**, I want to edit a client's contact information so that records stay accurate over time. | **Must** |
| US-CLI-05 | As a **senior partner**, I want to delete a client record so that erroneous entries are removed cleanly. | **Should** |

### Acceptance Criteria

**US-CLI-01**
- `POST /api/clients` requires `full_name`, `email`, `phone`, `client_type`
- Email must be unique — duplicate returns 409
- Phone validated for Nigerian or international format

**US-CLI-02**
- `GET /api/clients/:id` returns client profile AND an array of all cases linked to that client

**US-CLI-03**
- `GET /api/clients?search=emeka` matches against `full_name` and `email`

**US-CLI-04**
- `PUT /api/clients/:id` can update any field
- Email uniqueness enforced on update

**US-CLI-05**
- `DELETE /api/clients/:id` is soft-delete
- Deleted client no longer appears in `GET /api/clients`
- Only `senior_partner` JWT permitted

---

## 4. Lawyer Directory Stories

| ID | Story | Priority |
|----|-------|----------|
| US-LAW-01 | As a **senior partner**, I want to create a lawyer account so that new team members can access the system. | **Must** |
| US-LAW-02 | As any **authenticated user**, I want to view the lawyer directory so that I know who is on the team and their specialty. | **Must** |
| US-LAW-03 | As a **senior partner**, I want to view a lawyer's profile and their active cases so that I can assess their workload. | **Must** |
| US-LAW-04 | As a **senior partner**, I want to deactivate a lawyer account when they leave the firm. | **Must** |
| US-LAW-05 | As a **senior partner**, I want to update a lawyer's profile so that their details stay current. | **Should** |

### Acceptance Criteria

**US-LAW-01**
- `POST /api/lawyers` hashes password with bcrypt before storing
- Password never returned in any response
- Only `senior_partner` can create lawyer accounts

**US-LAW-02**
- `GET /api/lawyers` returns only active lawyers (`is_active: true`)

**US-LAW-03**
- `GET /api/lawyers/:id` includes a count or list of active assigned cases

**US-LAW-04**
- `PATCH /api/lawyers/:id/deactivate` sets `is_active = false`
- Deactivated lawyer cannot log in
- Deactivated lawyer not returned in `GET /api/lawyers`

---

## 5. Hearings & Court Date Stories

| ID | Story | Priority |
|----|-------|----------|
| US-HEAR-01 | As an **associate lawyer**, I want to schedule a hearing date for a case so that it is visible to the whole team. | **Must** |
| US-HEAR-02 | As any **authenticated user**, I want to see all upcoming hearings sorted by date so that the most urgent is front and centre. | **Must** |
| US-HEAR-03 | As any **authenticated user**, I want hearings colour-coded by urgency so that I can instantly spot pressing dates. | **Must** |
| US-HEAR-04 | As any **authenticated user**, I want to filter hearings by this week so that I can focus on immediate preparation. | **Should** |
| US-HEAR-05 | As an **associate lawyer**, I want to add pre-hearing notes so that context is preserved for myself and the team. | **Should** |
| US-HEAR-06 | As a **legal secretary**, I want to reschedule a hearing when a court date changes so that records reflect the new date immediately. | **Must** |
| US-HEAR-07 | As an **associate lawyer**, I want to record the outcome of a hearing so that there is a clear post-hearing record. | **Should** |

### Acceptance Criteria

**US-HEAR-01**
- `POST /api/hearings` requires a future `hearing_date`
- Cannot schedule on a Closed case

**US-HEAR-02**
- `GET /api/dashboard/upcoming-hearings` returns next 10 hearings sorted ascending by date

**US-HEAR-03**
- Every hearing response includes `urgency: "red" | "orange" | "green"` based on days until hearing
- Red = ≤3 days, Orange = ≤7 days, Green = >7 days

**US-HEAR-04**
- `GET /api/hearings?filter=this_week` returns only hearings within the next 7 calendar days

**US-HEAR-05 / US-HEAR-07**
- `PUT /api/hearings/:id` accepts `notes` and `outcome` fields

**US-HEAR-06**
- `PUT /api/hearings/:id` with a new `hearing_date` (must be future date) updates successfully

---

## 6. Dashboard Stories

| ID | Story | Priority |
|----|-------|----------|
| US-DASH-01 | As a **senior partner**, I want to see key firm metrics on login so that I get a health snapshot immediately. | **Must** |
| US-DASH-02 | As any **authenticated user**, I want to see recent cases on the dashboard so that I can pick up where I left off. | **Should** |
| US-DASH-03 | As a **senior partner**, I want to see which lawyers have the most active cases so that I can rebalance workload. | **Could** |

### Acceptance Criteria

**US-DASH-01**
- `GET /api/dashboard/stats` returns `totalCases`, `activeCases`, `pendingCases`, `urgentCases`, `inReviewCases`, `closedCases`, `hearingsThisWeek`
- Senior partner and secretary see firm-wide numbers
- Associate sees numbers scoped to their own cases

**US-DASH-02**
- `GET /api/dashboard/recent-cases` returns 10 most recently updated cases

**US-DASH-03**
- `GET /api/lawyers` response includes `activeCaseCount` per lawyer (Could — not a launch blocker)

---

## Story Summary by Priority

| Priority | Count | IDs |
|----------|-------|-----|
| **Must** | 22 | AUTH-01–04, CASE-01–09, CASE-11, CLI-01–04, LAW-01–04, HEAR-01–03, HEAR-06, DASH-01 |
| **Should** | 8 | CASE-10, CASE-12, CLI-05, LAW-05, HEAR-04, HEAR-05, HEAR-07, DASH-02 |
| **Could** | 1 | DASH-03 |

---

*Docket Backend · User Stories v1.0 · March 2026*
