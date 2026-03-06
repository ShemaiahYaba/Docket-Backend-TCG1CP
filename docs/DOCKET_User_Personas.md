# Docket Backend — User Personas
**Legal Case Management Platform · Capstone 2026**  
*Personas define who the system is built for. Every backend decision — from role enforcement to data scoping — should trace back to a persona's real need.*

---

## Persona 1 — The Senior Partner

| Attribute | Detail |
|-----------|--------|
| **Name** | Chukwuemeka Obi |
| **Role** | Senior Partner, Firm Owner |
| **Age** | 47 years old |
| **Experience** | 20+ years in legal practice |
| **Firm Size** | 8–15 lawyers, 60–100 active cases at any time |
| **Tech Comfort** | Moderate — uses WhatsApp and email daily, minimal SaaS experience |
| **System Role** | `senior_partner` |

### Goals
- Oversee the firm's entire caseload without chasing individual lawyers for updates
- Ensure no hearing is ever missed by any team member
- Rebalance workload when a lawyer is overloaded
- Maintain full accountability — know who actioned what and when

### Pain Points
- Has no real-time visibility into team activity — learns about problems only after they happen
- Cannot tell at a glance which cases are urgent vs routine
- Lawyer departures cause critical case context to be lost

### How Docket Serves This Persona
- Dashboard with firm-wide stats: total cases, active, urgent, hearings this week
- Full access to all cases, clients, and lawyers across the system
- Sole authority to delete cases, deactivate lawyers, and reopen closed cases
- Role permission: highest access level — no restrictions

### Backend Implications
- `GET /api/cases` returns all cases (no scoping)
- `GET /api/dashboard/stats` returns firm-wide aggregations
- Only JWT with `role: "senior_partner"` can call destructive endpoints
- Must be the first seeded account so testing can begin immediately

---

## Persona 2 — The Associate Lawyer

| Attribute | Detail |
|-----------|--------|
| **Name** | Adaeze Nwosu |
| **Role** | Associate Lawyer, Civil Litigation |
| **Age** | 31 years old |
| **Experience** | 5 years post-call to bar |
| **Caseload** | 10–20 active cases simultaneously |
| **Tech Comfort** | High — smartphone-heavy, comfortable with web apps |
| **System Role** | `associate` |

### Goals
- See all assigned cases and never miss a hearing date
- Quickly update case status after a court appearance
- Access full case details from any device, including mobile

### Pain Points
- Manually tracking 15+ cases across WhatsApp messages and a notebook
- No structured way to see their full caseload at a glance
- Must wait until back at the office to update case status

### How Docket Serves This Persona
- Cases page defaults to their assigned cases only
- Colour-coded urgency indicators for upcoming hearings
- Can update status on their own cases with one action
- Mobile app gives full access while in court

### Backend Implications
- `GET /api/cases` scopes results to `lawyer_id = req.user.id`
- `PUT /api/cases/:id` returns 403 if case is not assigned to requesting user
- `GET /api/dashboard/stats` returns personal stats — not firm-wide
- Cannot create cases, delete cases, or manage other lawyers' work
- Can schedule and edit hearings on their own cases

---

## Persona 3 — The Legal Secretary

| Attribute | Detail |
|-----------|--------|
| **Name** | Tunde Bello |
| **Role** | Legal Secretary / Office Administrator |
| **Age** | 26 years old |
| **Experience** | 2 years at the firm |
| **Responsibilities** | Onboarding clients, creating cases, scheduling hearings, updating records |
| **Tech Comfort** | High — manages firm calendar and communications tools |
| **System Role** | `secretary` |

### Goals
- Create and update client and case records quickly and accurately
- Schedule hearings on behalf of lawyers
- Ensure all records are complete before a case goes to court

### Pain Points
- Re-entering the same client data across multiple files and spreadsheets
- Cross-referencing paper records with digital calendars daily
- No single tool that connects clients, cases, and hearing dates

### How Docket Serves This Persona
- Single case creation form linking client, lawyer, case type, and status
- Client directory with search — no need to re-enter existing clients
- Hearing scheduler accessible from the case detail view
- Full read access to all cases and clients across the firm

### Backend Implications
- Can create cases and clients — same access as `senior_partner` for creation
- Cannot delete cases or clients — those are `senior_partner` only
- Cannot deactivate or create lawyer accounts
- `GET /api/dashboard/stats` returns firm-wide stats (same as senior partner)
- Can assign and reassign lawyers to cases

---

## Persona 4 — The On-The-Go Lawyer (Mobile Primary)

| Attribute | Detail |
|-----------|--------|
| **Name** | Ngozi Eze |
| **Role** | Associate Lawyer, frequently in court |
| **Age** | 29 years old |
| **Experience** | 4 years post-call |
| **Device Usage** | Primarily smartphone — travels between courts, rarely at a desk |
| **Tech Comfort** | Very high — early adopter, comfortable with mobile apps |
| **System Role** | `associate` |

### Goals
- Check upcoming hearings before walking into a courtroom
- Update a case status from her phone immediately after a hearing
- Pull up client or case details quickly in a courtroom setting

### Pain Points
- Must wait until back at the office to update anything — risks forgetting key details
- Phone is her primary work device but the existing tools are desktop-only
- Poor network in some courthouses makes real-time updates unreliable

### How Docket Serves This Persona
- Same REST API consumed by both the web app and the React Native mobile app
- JWT stored securely on device — session persists between app opens
- All case and hearing endpoints work identically on mobile
- Offline cache allows viewing last-fetched data without connectivity

### Backend Implications
- No mobile-specific endpoints needed — API is consumed identically
- JWT must be stateless and device-agnostic
- All responses must be lean enough for mobile data consumption
- Same role rules as Persona 2 (`associate`) — data scoping applies equally

---

## Persona Summary Table

| Persona | System Role | Creates Cases | Deletes Cases | Sees All Cases | Dashboard Scope |
|---------|------------|--------------|--------------|---------------|----------------|
| Chukwuemeka (Senior Partner) | `senior_partner` | ✅ Yes | ✅ Yes | ✅ Yes | Firm-wide |
| Adaeze (Associate) | `associate` | ❌ No | ❌ No | Own only | Personal |
| Tunde (Secretary) | `secretary` | ✅ Yes | ❌ No | ✅ Yes | Firm-wide |
| Ngozi (On-the-go Associate) | `associate` | ❌ No | ❌ No | Own only | Personal |

---

*Docket Backend · User Personas v1.0 · March 2026*
