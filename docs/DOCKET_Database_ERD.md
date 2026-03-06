# Docket Backend — Database ERD
**Legal Case Management Platform · Capstone 2026**  
*This document defines the complete database schema, all field constraints, and the relationships between tables. Use this as the reference when writing Sequelize migrations and models.*

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                         │
│   ┌───────────────────────────┐              ┌───────────────────────────────────────┐  │
│   │         LAWYERS           │              │               CLIENTS                 │  │
│   ├───────────────────────────┤              ├───────────────────────────────────────┤  │
│   │ 🔑 id          UUID PK    │              │ 🔑 id           UUID PK               │  │
│   │    full_name   VARCHAR    │              │    full_name    VARCHAR(255) NOT NULL  │  │
│   │    email       VARCHAR UQ │              │    email        VARCHAR(255) UQ NN     │  │
│   │    password    VARCHAR    │              │    phone        VARCHAR(20) NOT NULL   │  │
│   │    phone       VARCHAR    │              │    address      TEXT NULL              │  │
│   │    specialty   VARCHAR    │              │    client_type  ENUM NN                │  │
│   │    role        ENUM NN    │              │                 individual             │  │
│   │                senior_    │              │                 corporate              │  │
│   │                partner    │              │    created_at   TIMESTAMP              │  │
│   │                associate  │              │    updated_at   TIMESTAMP              │  │
│   │                secretary  │              └──────────────────┬────────────────────┘  │
│   │    is_active   BOOL       │                                 │                       │
│   │    created_at  TIMESTAMP  │                                 │ 1                     │
│   │    updated_at  TIMESTAMP  │                                 │                       │
│   └─────────────┬─────────────┘                                 │                       │
│                 │                                               │                       │
│                 │ 1                                             │                       │
│                 │                                               │                       │
│                 │              ┌────────────────────────────────▼──────────────────┐   │
│                 │              │                    CASES                           │   │
│                 │              ├───────────────────────────────────────────────────┤   │
│                 │              │ 🔑 id           VARCHAR(20) PK  e.g. SLT-001      │   │
│                 │              │    title        VARCHAR(300) NOT NULL              │   │
│                 │              │    description  TEXT NULL                          │   │
│                 │              │    case_type    ENUM NOT NULL                      │   │
│                 │              │                 Civil                              │   │
│                 │              │                 Criminal                           │   │
│                 │              │                 Corporate                          │   │
│                 │              │                 Family                             │   │
│                 │              │                 Property                           │   │
│                 │              │    status       ENUM NOT NULL DEFAULT Pending      │   │
│                 │              │                 Active                             │   │
│                 │              │                 Pending                            │   │
│                 │              │                 In Review                          │   │
│                 │              │                 Urgent                             │   │
│                 │              │                 Closed                             │   │
│                 └──────────────► lawyer_id      UUID FK → lawyers.id NULL          │   │
│                                │ 🔗 client_id   UUID FK → clients.id NOT NULL      │   │
│                                │    filed_date   DATE DEFAULT TODAY                 │   │
│                                │    closed_date  DATE NULL                          │   │
│                                │    created_at   TIMESTAMP                          │   │
│                                │    updated_at   TIMESTAMP                          │   │
│                                └──────────────────────┬────────────────────────────┘   │
│                                                       │                                │
│                 ┌─────────────────────────────────────┘                                │
│                 │ 1                                                                     │
│                 │                                                                       │
│                 ▼ M                                                                     │
│   ┌─────────────────────────────────────────────────────────┐                          │
│   │                       HEARINGS                          │                          │
│   ├─────────────────────────────────────────────────────────┤                          │
│   │ 🔑 id            UUID PK                                │                          │
│   │ 🔗 case_id        VARCHAR(20) FK → cases.id NOT NULL    │                          │
│   │    hearing_date   DATE NOT NULL                         │                          │
│   │    hearing_time   TIME NULL                             │                          │
│   │    court_name     VARCHAR(255) NULL                     │                          │
│   │    notes          TEXT NULL                             │                          │
│   │    outcome        TEXT NULL                             │                          │
│   │ 🔗 created_by     UUID FK → lawyers.id NOT NULL         │◄── lawyers (1 → M)       │
│   │    created_at     TIMESTAMP                             │                          │
│   └─────────────────────────────────────────────────────────┘                          │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Relationships

```
LAWYERS   ──────────────────── CASES
           1 lawyer : M cases
           (lawyer_id FK on cases — nullable, case can be unassigned)

CLIENTS   ──────────────────── CASES
           1 client : M cases
           (client_id FK on cases — NOT NULL, every case must have a client)

CASES     ──────────────────── HEARINGS
           1 case : M hearings
           (case_id FK on hearings — NOT NULL)

LAWYERS   ──────────────────── HEARINGS
           1 lawyer : M hearings (as creator)
           (created_by FK on hearings — NOT NULL)
```

---

## Table Definitions

---

### Table: `lawyers`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PRIMARY KEY | Auto-generated via `uuid` package |
| `full_name` | VARCHAR(255) | NOT NULL | Full legal name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Used as login credential |
| `password` | VARCHAR(255) | NOT NULL | bcrypt hash — never plain text |
| `phone` | VARCHAR(20) | NULLABLE | Optional contact number |
| `specialty` | VARCHAR(100) | NOT NULL | e.g. Criminal Law, Civil Litigation |
| `role` | ENUM | NOT NULL | `senior_partner`, `associate`, `secretary` |
| `is_active` | BOOLEAN | DEFAULT true | Soft-delete flag — false = deactivated |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Auto-managed by Sequelize |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Auto-updated by Sequelize |

**Sequelize Associations:**
```js
Lawyer.hasMany(Case, { foreignKey: 'lawyer_id', as: 'cases' });
Lawyer.hasMany(Hearing, { foreignKey: 'created_by', as: 'scheduledHearings' });
```

---

### Table: `clients`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PRIMARY KEY | Auto-generated |
| `full_name` | VARCHAR(255) | NOT NULL | Full name or company name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Primary contact email |
| `phone` | VARCHAR(20) | NOT NULL | Nigerian or international format |
| `address` | TEXT | NULLABLE | Physical or mailing address |
| `client_type` | ENUM | NOT NULL | `individual`, `corporate` |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Auto-managed |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Auto-updated |

**Sequelize Associations:**
```js
Client.hasMany(Case, { foreignKey: 'client_id', as: 'cases' });
```

---

### Table: `cases`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | VARCHAR(20) | PRIMARY KEY | Auto-generated: `SLT-001`, `SLT-002`... |
| `title` | VARCHAR(300) | NOT NULL | Full case name (min 5, max 300 chars) |
| `description` | TEXT | NULLABLE | Case summary |
| `case_type` | ENUM | NOT NULL | `Civil`, `Criminal`, `Corporate`, `Family`, `Property` |
| `status` | ENUM | NOT NULL, DEFAULT `Pending` | `Active`, `Pending`, `In Review`, `Urgent`, `Closed` |
| `client_id` | UUID | FK → clients.id, NOT NULL | Must reference active client |
| `lawyer_id` | UUID | FK → lawyers.id, NULLABLE | Can be unassigned initially |
| `filed_date` | DATE | DEFAULT TODAY | Cannot be a future date |
| `closed_date` | DATE | NULLABLE | Auto-set when status → Closed |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Auto-managed |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Auto-updated |

**Case ID Generation Logic:**
```js
// Query the highest existing numeric suffix, increment by 1
const lastCase = await Case.findOne({ order: [['created_at', 'DESC']] });
const lastNumber = lastCase ? parseInt(lastCase.id.split('-')[1]) : 0;
const newId = `SLT-${String(lastNumber + 1).padStart(3, '0')}`;
```

**Sequelize Associations:**
```js
Case.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
Case.belongsTo(Lawyer, { foreignKey: 'lawyer_id', as: 'lawyer' });
Case.hasMany(Hearing, { foreignKey: 'case_id', as: 'hearings' });
```

---

### Table: `hearings`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PRIMARY KEY | Auto-generated |
| `case_id` | VARCHAR(20) | FK → cases.id, NOT NULL | Must reference existing non-closed case |
| `hearing_date` | DATE | NOT NULL | Must be a future date |
| `hearing_time` | TIME | NULLABLE | Optional — format: `HH:MM` 24hr |
| `court_name` | VARCHAR(255) | NULLABLE | e.g. High Court Lagos |
| `notes` | TEXT | NULLABLE | Pre-hearing preparation notes |
| `outcome` | TEXT | NULLABLE | Post-hearing result notes |
| `created_by` | UUID | FK → lawyers.id, NOT NULL | Lawyer who scheduled the hearing |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Auto-managed |

**Sequelize Associations:**
```js
Hearing.belongsTo(Case, { foreignKey: 'case_id', as: 'case' });
Hearing.belongsTo(Lawyer, { foreignKey: 'created_by', as: 'scheduledBy' });
```

---

## Migration Order

> ⚠️ This order is mandatory. Foreign key constraints will cause migrations to fail if run out of order.

```
Step 1 → create-lawyers-table
Step 2 → create-clients-table
Step 3 → create-cases-table       (references lawyers + clients)
Step 4 → create-hearings-table    (references cases + lawyers)
```

**Undo order (reverse):**
```
Step 1 → undo hearings
Step 2 → undo cases
Step 3 → undo clients + lawyers (either order)
```

---

## ENUM Values Reference

| Table | Column | Allowed Values |
|-------|--------|---------------|
| `lawyers` | `role` | `senior_partner`, `associate`, `secretary` |
| `clients` | `client_type` | `individual`, `corporate` |
| `cases` | `case_type` | `Civil`, `Criminal`, `Corporate`, `Family`, `Property` |
| `cases` | `status` | `Active`, `Pending`, `In Review`, `Urgent`, `Closed` |

---

## Indexes

| Table | Column | Type | Reason |
|-------|--------|------|--------|
| `lawyers` | `email` | UNIQUE | Login lookup |
| `clients` | `email` | UNIQUE | Duplicate prevention |
| `cases` | `status` | INDEX | Filter queries |
| `cases` | `lawyer_id` | INDEX | Associate case scoping |
| `cases` | `client_id` | INDEX | Client case lookup |
| `hearings` | `hearing_date` | INDEX | Date range queries (dashboard, urgency) |
| `hearings` | `case_id` | INDEX | Case hearing lookup |

---

## Seed Data Order

> Same constraint — must seed in FK-dependency order.

```
Step 1 → lawyers     (no dependencies)
Step 2 → clients     (no dependencies)
Step 3 → cases       (depends on lawyers + clients)
Step 4 → hearings    (depends on cases + lawyers)
```

---

*Docket Backend · Database ERD v1.0 · March 2026*
