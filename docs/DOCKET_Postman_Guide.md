# Docket Backend — Postman Collection Guide
**Legal Case Management Platform · Capstone 2026**  
*How to import and use the Postman collection to test all 29 API endpoints.*

---

## Setup

### Step 1 — Import the Collection
1. Open Postman
2. Click **Import** (top left)
3. Select `DOCKET_Postman_Collection.json`
4. The **Docket API** collection will appear in your sidebar

---

### Step 2 — Set the Base URL
The collection uses a variable `{{base_url}}` already set to:
```
http://localhost:5000/api
```
If your server runs on a different port, update it:
1. Click the **Docket API** collection name
2. Go to the **Variables** tab
3. Update `base_url` current value

---

### Step 3 — Login and Get Your Token
1. Open **Auth → Login — Senior Partner**
2. Click **Send**
3. The test script automatically saves the token to `{{token}}`
4. Every subsequent request uses `{{token}}` in the Bearer header automatically

> You only need to login once per session. The token is saved at the collection level.

---

### Step 4 — Set Resource IDs
After creating or fetching records, update these collection variables so other requests work:

| Variable | How to set |
|----------|-----------|
| `{{lawyer_id}}` | Copy an `id` from GET /lawyers response |
| `{{client_id}}` | Copy an `id` from GET /clients response |
| `{{case_id}}` | Copy an `id` from GET /cases response e.g. `SLT-001` |
| `{{hearing_id}}` | Copy an `id` from GET /hearings response |

To update a variable: Click **Docket API** → **Variables** tab → paste into **Current Value**.

---

## Collection Structure

```
Docket API
├── Health Check
│   └── GET /health
│
├── Auth
│   ├── Login — Senior Partner       ← Start here
│   ├── Login — Associate
│   ├── Login — Secretary
│   ├── Login — Invalid Credentials
│   ├── GET /auth/me
│   └── POST /auth/logout
│
├── Lawyers
│   ├── GET /lawyers — All
│   ├── POST /lawyers — Create
│   ├── POST /lawyers — Missing Fields (400)
│   ├── GET /lawyers/:id
│   ├── PUT /lawyers/:id — Update
│   └── PATCH /lawyers/:id/deactivate
│
├── Clients
│   ├── GET /clients — All
│   ├── GET /clients — Search
│   ├── POST /clients — Create
│   ├── POST /clients — Corporate
│   ├── GET /clients/:id
│   ├── PUT /clients/:id — Update
│   └── DELETE /clients/:id — Soft Delete
│
├── Cases
│   ├── GET /cases — All
│   ├── GET /cases — Filter by Status
│   ├── GET /cases — Filter by Type
│   ├── GET /cases — Search
│   ├── GET /cases — Combined Filters + Pagination
│   ├── POST /cases — Create
│   ├── POST /cases — No Lawyer (Unassigned)
│   ├── GET /cases/:id
│   ├── PUT /cases/:id — Update
│   ├── DELETE /cases/:id — Soft Delete
│   ├── PATCH /cases/:id/assign
│   ├── PATCH /cases/:id/status — Set Active
│   ├── PATCH /cases/:id/status — Set Urgent
│   ├── PATCH /cases/:id/status — Set Closed
│   └── GET /cases/:id/hearings
│
├── Hearings
│   ├── GET /hearings — All
│   ├── GET /hearings — Upcoming
│   ├── GET /hearings — This Week
│   ├── GET /hearings — By Case
│   ├── POST /hearings — Schedule
│   ├── POST /hearings — Past Date (400)
│   ├── GET /hearings/:id
│   ├── PUT /hearings/:id — Reschedule
│   ├── PUT /hearings/:id — Add Outcome
│   └── DELETE /hearings/:id
│
├── Dashboard
│   ├── GET /dashboard/stats
│   ├── GET /dashboard/upcoming-hearings
│   └── GET /dashboard/recent-cases
│
└── Error Test Cases
    ├── No Token — 401
    ├── Wrong Role — 403
    ├── Not Found — 404
    └── Unknown Route — 404
```

---

## Test Credentials

These are seeded by `npm run seed`.

| Role | Email | Password |
|------|-------|----------|
| Senior Partner | `senior@docket.com` | `Password123!` |
| Associate | `associate@docket.com` | `Password123!` |
| Secretary | `secretary@docket.com` | `Password123!` |

---

## Testing Role Restrictions

1. Login as **Associate** using Login — Associate
2. Copy the token from the response
3. Manually paste it into `{{token}}` in collection variables
4. Try **POST /lawyers** → should return `403 Forbidden`
5. Try **DELETE /cases/:id** → should return `403 Forbidden`
6. Try **GET /cases** → should return only cases assigned to that associate

Repeat with Secretary token to verify secretary-level access.

---

## Request Body Reference

### POST /auth/login
```json
{
  "email": "senior@docket.com",
  "password": "Password123!"
}
```

### POST /lawyers
```json
{
  "full_name": "Ngozi Eze",
  "email": "ngozi@docket.com",
  "password": "Password123!",
  "specialty": "Family Law",
  "role": "associate",
  "phone": "+2348031234567"
}
```

### POST /clients
```json
{
  "full_name": "Emeka Johnson",
  "email": "emeka@johnson.com",
  "phone": "+2348023456789",
  "client_type": "individual",
  "address": "14 Broad Street, Lagos"
}
```

### POST /cases
```json
{
  "title": "Johnson v. Federal Republic of Nigeria",
  "description": "Criminal appeal against unlawful detention",
  "case_type": "Criminal",
  "client_id": "{{client_id}}",
  "lawyer_id": "{{lawyer_id}}",
  "filed_date": "2026-03-06"
}
```

### POST /hearings
```json
{
  "case_id": "{{case_id}}",
  "hearing_date": "2026-04-15",
  "hearing_time": "09:00",
  "court_name": "High Court Lagos",
  "notes": "Bring certified copies of all exhibits"
}
```

### PATCH /cases/:id/status
```json
{ "status": "Active" }
```
Valid values: `Active`, `Pending`, `In Review`, `Urgent`, `Closed`

---

## Common Issues

| Issue | Fix |
|-------|-----|
| Every request returns 401 | Token expired — re-run Login |
| 404 on a specific resource | Update the ID variable in collection variables |
| Server not responding | Run `npm run dev` in the project root |
| Data looks empty | Run `npm run seed` to populate the database |

---

*Docket Backend · Postman Collection Guide v1.0 · March 2026*
