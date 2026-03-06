# Docket Backend — Permission Matrix
**Legal Case Management Platform · Capstone 2026**  
*This document is the single source of truth for role-based access control. Every route must enforce these rules at the API level — the frontend cannot be the only line of defence.*

---

## Roles

| Role | Code | Description |
|------|------|-------------|
| **Senior Partner** | `senior_partner` | Firm owner or lead lawyer. Full system access. Only role that can delete and deactivate. |
| **Associate Lawyer** | `associate` | Case handler. Limited to their own assigned cases. Cannot create or delete. |
| **Legal Secretary** | `secretary` | Admin staff. Can create and manage cases and clients but cannot delete. |

---

## How Permissions Are Enforced

Every protected route passes through two middleware layers:

1. **`authMiddleware`** — Verifies the JWT is present, valid, and not expired. Attaches `req.user` to the request. Returns `401` if check fails.

2. **`requireRole(...roles)`** — Checks that `req.user.role` is in the allowed list. Returns `403` if the role is not permitted.

Additionally, some routes apply **ownership checks** in the controller — for example, an associate can call `PUT /api/cases/:id` but the controller verifies `case.lawyer_id === req.user.id` before allowing the update.

---

## 1. Authentication Permissions

| Endpoint | Method | senior_partner | associate | secretary | No Auth |
|----------|--------|:--------------:|:---------:|:---------:|:-------:|
| /api/auth/login | POST | ✅ | ✅ | ✅ | ✅ Open |
| /api/auth/logout | POST | ✅ | ✅ | ✅ | ❌ 401 |
| /api/auth/me | GET | ✅ | ✅ | ✅ | ❌ 401 |

---

## 2. Lawyers Permissions

| Endpoint | Method | senior_partner | associate | secretary | Notes |
|----------|--------|:--------------:|:---------:|:---------:|-------|
| /api/lawyers | GET | ✅ | ✅ | ✅ | Returns active lawyers only |
| /api/lawyers | POST | ✅ | ❌ 403 | ❌ 403 | Only senior_partner creates accounts |
| /api/lawyers/:id | GET | ✅ | ✅ | ✅ | Any authenticated user |
| /api/lawyers/:id | PUT | ✅ | ❌ 403 | ❌ 403 | Only senior_partner updates profiles |
| /api/lawyers/:id/deactivate | PATCH | ✅ | ❌ 403 | ❌ 403 | Only senior_partner deactivates |

---

## 3. Clients Permissions

| Endpoint | Method | senior_partner | associate | secretary | Notes |
|----------|--------|:--------------:|:---------:|:---------:|-------|
| /api/clients | GET | ✅ | ✅ | ✅ | All roles can view clients |
| /api/clients | POST | ✅ | ❌ 403 | ✅ | Associate cannot create clients |
| /api/clients/:id | GET | ✅ | ✅ | ✅ | All roles can view client detail |
| /api/clients/:id | PUT | ✅ | ❌ 403 | ✅ | Associate cannot edit clients |
| /api/clients/:id | DELETE | ✅ | ❌ 403 | ❌ 403 | Soft-delete — senior_partner only |

---

## 4. Cases Permissions

| Endpoint | Method | senior_partner | associate | secretary | Notes |
|----------|--------|:--------------:|:---------:|:---------:|-------|
| /api/cases | GET | ✅ All | ✅ Own only | ✅ All | Associate scoped to `lawyer_id = req.user.id` |
| /api/cases | POST | ✅ | ❌ 403 | ✅ | Associate cannot create cases |
| /api/cases/:id | GET | ✅ | ✅ | ✅ | All roles can view case detail |
| /api/cases/:id | PUT | ✅ Any | ✅ Own only | ✅ Any | Associate gets 403 on cases not assigned to them |
| /api/cases/:id | DELETE | ✅ | ❌ 403 | ❌ 403 | Soft-delete — senior_partner only |
| /api/cases/:id/assign | PATCH | ✅ | ❌ 403 | ✅ | Associate cannot reassign lawyers |
| /api/cases/:id/status | PATCH | ✅ Full | ✅ Own cases | ✅ Full | Lifecycle rules apply to all roles |
| /api/cases/:id/hearings | GET | ✅ | ✅ | ✅ | All roles can view case hearings |

### Case Status — Who Can Transition What

| From Status | To Status | senior_partner | associate | secretary |
|-------------|-----------|:--------------:|:---------:|:---------:|
| (New) | Pending | ✅ | ❌ | ✅ |
| (New) | Active | ✅ | ❌ | ✅ |
| Pending | Active | ✅ | ✅ Own | ✅ |
| Pending | In Review | ✅ | ✅ Own | ✅ |
| Pending | Closed | ✅ | ✅ Own | ✅ |
| Active | Pending | ✅ | ✅ Own | ✅ |
| Active | In Review | ✅ | ✅ Own | ✅ |
| Active | Urgent | ✅ | ✅ Own | ✅ |
| Active | Closed | ✅ | ✅ Own | ✅ |
| In Review | Active | ✅ | ✅ Own | ✅ |
| In Review | Pending | ✅ | ✅ Own | ✅ |
| In Review | Closed | ✅ | ✅ Own | ✅ |
| Urgent | Active | ✅ | ✅ Own | ✅ |
| Urgent | In Review | ✅ | ✅ Own | ✅ |
| Urgent | Closed | ✅ | ✅ Own | ✅ |
| **Closed** | **Active (reopen)** | ✅ | ❌ 403 | ❌ 403 |

> **"Own"** means the associate is the `lawyer_id` on that specific case. Any other case returns 403.

---

## 5. Hearings Permissions

| Endpoint | Method | senior_partner | associate | secretary | Notes |
|----------|--------|:--------------:|:---------:|:---------:|-------|
| /api/hearings | GET | ✅ | ✅ | ✅ | All roles |
| /api/hearings | POST | ✅ | ✅ | ✅ | Any authenticated user can schedule |
| /api/hearings/:id | GET | ✅ | ✅ | ✅ | All roles |
| /api/hearings/:id | PUT | ✅ Any | ✅ Own cases | ✅ Any | Associate gets 403 if hearing is not on their case |
| /api/hearings/:id | DELETE | ✅ | ❌ 403 | ✅ | Associate cannot delete hearings |

---

## 6. Dashboard Permissions

| Endpoint | Method | senior_partner | associate | secretary | Notes |
|----------|--------|:--------------:|:---------:|:---------:|-------|
| /api/dashboard/stats | GET | ✅ Firm-wide | ✅ Own only | ✅ Firm-wide | Associate stats scoped |
| /api/dashboard/upcoming-hearings | GET | ✅ All | ✅ Own cases | ✅ All | Associate sees hearings on their cases only |
| /api/dashboard/recent-cases | GET | ✅ All | ✅ Own cases | ✅ All | Associate sees their cases only |

---

## 7. Full Permission Summary Matrix

| Action | senior_partner | associate | secretary |
|--------|:--------------:|:---------:|:---------:|
| Login | ✅ | ✅ | ✅ |
| View own profile | ✅ | ✅ | ✅ |
| View all lawyers | ✅ | ✅ | ✅ |
| Create lawyer account | ✅ | ❌ | ❌ |
| Update lawyer profile | ✅ | ❌ | ❌ |
| Deactivate lawyer | ✅ | ❌ | ❌ |
| View all clients | ✅ | ✅ | ✅ |
| Create client | ✅ | ❌ | ✅ |
| Edit client | ✅ | ❌ | ✅ |
| Delete client | ✅ | ❌ | ❌ |
| View all cases | ✅ | ❌ (own only) | ✅ |
| Create case | ✅ | ❌ | ✅ |
| Edit any case | ✅ | ❌ (own only) | ✅ |
| Delete case | ✅ | ❌ | ❌ |
| Assign lawyer to case | ✅ | ❌ | ✅ |
| Update case status | ✅ | ✅ (own only) | ✅ |
| Reopen closed case | ✅ | ❌ | ❌ |
| View all hearings | ✅ | ✅ | ✅ |
| Schedule hearing | ✅ | ✅ | ✅ |
| Edit hearing | ✅ | ✅ (own cases) | ✅ |
| Delete hearing | ✅ | ❌ | ✅ |
| View firm-wide dashboard | ✅ | ❌ (personal) | ✅ |

---

## 8. HTTP Status Codes for Permission Failures

| Scenario | Status Code | Message |
|----------|-------------|---------|
| No token provided | `401 Unauthorized` | `"Authentication required. Please log in."` |
| Token expired | `401 Unauthorized` | `"Your session has expired. Please log in again."` |
| Token invalid or tampered | `401 Unauthorized` | `"Invalid authentication token."` |
| Valid token but wrong role | `403 Forbidden` | `"You do not have permission to perform this action."` |
| Valid token, correct role, wrong ownership | `403 Forbidden` | `"You can only perform this action on your own assigned cases."` |
| Deactivated account logs in | `401 Unauthorized` | `"This account has been deactivated. Contact your administrator."` |

---

## 9. Implementation Reference

### Auth Middleware

```js
// Applied to all protected routes
export const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required.' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};
```

### Role Middleware

```js
// Applied per-route as needed
// Usage: requireRole('senior_partner') or requireRole('senior_partner', 'secretary')
export const requireRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: 'You do not have permission to perform this action.'
        });
    }
    next();
};
```

### Ownership Check (in controller)

```js
// Used in cases and hearings controllers for associate ownership
if (req.user.role === 'associate' && caseRecord.lawyer_id !== req.user.id) {
    return res.status(403).json({
        success: false,
        message: 'You can only perform this action on your own assigned cases.'
    });
}
```

---

*Docket Backend · Permission Matrix v1.0 · March 2026*
*All role checks must be enforced server-side. The frontend hiding a button is not a security control.*
