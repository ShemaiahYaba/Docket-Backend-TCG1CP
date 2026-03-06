# Docket Backend — API Response Standards
**Legal Case Management Platform · Capstone 2026**  
*Every single API response in this project must follow this document. Consistency in response shape is what allows the frontend and mobile teams to integrate without surprises. There are no exceptions.*

---

## The Golden Rule

> Every response — success or error — returns JSON with a consistent top-level structure. The frontend and mobile app should never have to guess what shape a response will be in.

---

## 1. Base Response Shape

All responses share three top-level fields:

```json
{
  "success": true | false,
  "message": "Human-readable description of what happened",
  "data": { } | [ ] | null
}
```

| Field | Type | Always Present | Description |
|-------|------|---------------|-------------|
| `success` | Boolean | ✅ Yes | `true` on success, `false` on any error |
| `message` | String | ✅ Yes | Short, human-readable summary |
| `data` | Object / Array / null | ✅ Yes | Payload on success, `null` on error |

---

## 2. Success Responses

---

### 2.1 Single Resource — 200 OK

Used when returning a single record (GET by ID, GET /me, PATCH, PUT).

```json
{
  "success": true,
  "message": "Case retrieved successfully",
  "data": {
    "id": "SLT-001",
    "title": "Johnson v. Federal Republic of Nigeria",
    "case_type": "Criminal",
    "status": "Active",
    "client": {
      "id": "uuid",
      "full_name": "Emeka Johnson"
    },
    "lawyer": {
      "id": "uuid",
      "full_name": "Adaeze Nwosu"
    },
    "filed_date": "2026-03-06",
    "closed_date": null,
    "created_at": "2026-03-06T08:00:00.000Z",
    "updated_at": "2026-03-06T08:00:00.000Z"
  }
}
```

---

### 2.2 Collection — 200 OK

Used when returning a list of records (GET /cases, GET /clients, etc.).

```json
{
  "success": true,
  "message": "Cases retrieved successfully",
  "data": [
    {
      "id": "SLT-001",
      "title": "Johnson v. Federal Republic",
      "status": "Active",
      "case_type": "Criminal"
    },
    {
      "id": "SLT-002",
      "title": "Obi Estate Dispute",
      "status": "Pending",
      "case_type": "Property"
    }
  ]
}
```

> **Empty list rule:** An empty array is a success — return `200` with `"data": []`. Never return `404` for an empty list.

---

### 2.3 Paginated Collection — 200 OK

Used on any list endpoint that supports `?page=` and `?limit=`.

```json
{
  "success": true,
  "message": "Cases retrieved successfully",
  "data": {
    "records": [
      { "id": "SLT-001", "title": "Johnson v. Federal Republic" },
      { "id": "SLT-002", "title": "Obi Estate Dispute" }
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 20,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### 2.4 Created Resource — 201 Created

Used on all POST endpoints that create a new record.

```json
{
  "success": true,
  "message": "Case created successfully",
  "data": {
    "id": "SLT-003",
    "title": "Eze v. Lagos State Government",
    "status": "Pending",
    "case_type": "Civil",
    "client_id": "uuid",
    "lawyer_id": null,
    "filed_date": "2026-03-06",
    "created_at": "2026-03-06T09:00:00.000Z",
    "updated_at": "2026-03-06T09:00:00.000Z"
  }
}
```

---

### 2.5 Updated Resource — 200 OK

Used on PUT and PATCH endpoints.

```json
{
  "success": true,
  "message": "Case status updated to Active",
  "data": {
    "id": "SLT-001",
    "status": "Active",
    "updated_at": "2026-03-06T10:00:00.000Z"
  }
}
```

---

### 2.6 Deleted Resource — 200 OK

Used on DELETE endpoints (soft-delete).

```json
{
  "success": true,
  "message": "Case deleted successfully",
  "data": null
}
```

---

### 2.7 No Content Actions — 200 OK

Used for actions like logout where there is no data to return.

```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

---

## 3. Error Responses

All error responses set `"success": false` and `"data": null`. The `message` field is always human-readable.

---

### 3.1 Validation Error — 400 Bad Request

Used when input fails express-validator checks. Returns field-level errors so the frontend can highlight specific fields.

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

> **Rule:** Validation errors always return `400`. The `errors` array is only present on validation failures — not on other error types.

---

### 3.2 Unauthenticated — 401 Unauthorized

Used when no token is provided, the token is invalid, or the token is expired.

```json
{
  "success": false,
  "message": "Authentication required. Please log in.",
  "data": null
}
```

```json
{
  "success": false,
  "message": "Your session has expired. Please log in again.",
  "data": null
}
```

```json
{
  "success": false,
  "message": "Invalid authentication token.",
  "data": null
}
```

---

### 3.3 Forbidden — 403 Forbidden

Used when a valid authenticated user attempts an action their role does not permit, or attempts to modify a resource they do not own.

```json
{
  "success": false,
  "message": "You do not have permission to perform this action.",
  "data": null
}
```

```json
{
  "success": false,
  "message": "You can only perform this action on your own assigned cases.",
  "data": null
}
```

---

### 3.4 Not Found — 404 Not Found

Used when a specific resource cannot be found by the provided ID.

```json
{
  "success": false,
  "message": "Case not found.",
  "data": null
}
```

```json
{
  "success": false,
  "message": "Client not found.",
  "data": null
}
```

> **Rule:** `404` is for a specific resource not found by ID. An empty list result is `200` with `"data": []`.

---

### 3.5 Conflict — 409 Conflict

Used when a unique constraint is violated (duplicate email, etc.).

```json
{
  "success": false,
  "message": "A client with this email address already exists.",
  "data": null
}
```

---

### 3.6 Unprocessable Entity — 422

Used when the request is well-formed but violates a business rule (scheduling a hearing on a closed case, invalid status transition, etc.).

```json
{
  "success": false,
  "message": "Cannot schedule a hearing on a closed case.",
  "data": null
}
```

```json
{
  "success": false,
  "message": "Invalid status transition. Cannot move from Closed to Pending.",
  "data": null
}
```

---

### 3.7 Internal Server Error — 500

Used as a catch-all for unexpected server errors. **Never expose raw error details or stack traces to the client.**

```json
{
  "success": false,
  "message": "An unexpected error occurred. Please try again.",
  "data": null
}
```

> **Rule:** The actual error must be logged server-side (morgan / console.error) but never sent to the client.

---

### 3.8 Route Not Found — 404

Used by the global 404 catch-all middleware for requests to unknown routes.

```json
{
  "success": false,
  "message": "Route not found.",
  "data": null
}
```

---

## 4. HTTP Status Code Reference

| Code | Name | When to Use |
|------|------|-------------|
| `200` | OK | Successful GET, PUT, PATCH, DELETE |
| `201` | Created | Successful POST (new resource created) |
| `400` | Bad Request | Validation failure, malformed input |
| `401` | Unauthorized | Missing, expired, or invalid token |
| `403` | Forbidden | Valid token but insufficient permissions |
| `404` | Not Found | Specific resource not found by ID |
| `409` | Conflict | Unique constraint violation (duplicate email etc.) |
| `422` | Unprocessable Entity | Business rule violation |
| `500` | Internal Server Error | Unhandled server exception |

---

## 5. Field Conventions

| Convention | Rule | Example |
|------------|------|---------|
| Field naming | `snake_case` on all fields | `full_name`, `case_type`, `created_at` |
| Timestamps | ISO 8601 format | `"2026-03-06T08:00:00.000Z"` |
| Dates | `YYYY-MM-DD` string | `"2026-03-06"` |
| Time | `HH:MM` 24-hour string | `"14:30"` |
| UUIDs | Lowercase hyphenated | `"a1b2c3d4-e5f6-..."` |
| Null fields | Explicitly `null` | `"lawyer_id": null` — never omit the field |
| Boolean fields | Lowercase `true` / `false` | `"is_active": true` |
| Empty collections | Empty array | `"data": []` — never `null` for a list |
| Passwords | Never returned | Not present in any response, ever |

---

## 6. Sensitive Fields — Never Return These

The following fields must **never** appear in any API response under any circumstances:

| Field | Table | Reason |
|-------|-------|--------|
| `password` | `lawyers` | Security — bcrypt hash still must not be exposed |

---

## 7. Global Error Handler Implementation

```js
// src/middlewares/errorHandler.js

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            data: null,
            errors: err.errors.map(e => ({ field: e.path, message: e.message }))
        });
    }

    // Sequelize unique constraint
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            success: false,
            message: 'A record with this value already exists.',
            data: null
        });
    }

    // Default 500
    return res.status(500).json({
        success: false,
        message: 'An unexpected error occurred. Please try again.',
        data: null
    });
};

// 404 catch-all — register AFTER all routes in app.js
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found.',
        data: null
    });
};
```

---

## 8. Validation Error Handler Implementation

```js
// src/middlewares/validate.js
import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            data: null,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};
```

**Usage in routes:**
```js
import { body } from 'express-validator';
import { validate } from '../middlewares/validate.js';

router.post('/clients',
    authMiddleware,
    requireRole('senior_partner', 'secretary'),
    [
        body('full_name').notEmpty().withMessage('Full name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('phone').notEmpty().withMessage('Phone number is required'),
        body('client_type').isIn(['individual', 'corporate']).withMessage('client_type must be individual or corporate'),
    ],
    validate,          // <-- always place validate after the rules, before the controller
    clientController.create
);
```

---

## 9. Quick Reference Card

```
POST   → 201 Created       (new resource)
GET    → 200 OK            (single or list)
PUT    → 200 OK            (full update)
PATCH  → 200 OK            (partial update)
DELETE → 200 OK            (soft delete, data: null)

Validation fail    → 400  (errors array present)
No token           → 401
Wrong role         → 403
Not found          → 404
Duplicate          → 409
Business rule fail → 422
Server crash       → 500
```

---

*Docket Backend · API Response Standards v1.0 · March 2026*  
*Every team member must read this document before writing their first route.*
