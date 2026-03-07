# CLAUDE.md — Docket Backend

> AI assistant guide for the **Docket** legal case management REST API.
> Keep this file updated as the codebase evolves.

---

## Project Overview

**Docket** is a REST API for a legal case management platform built as a TechCrush Backend Engineering Capstone (2026). It manages lawyers, clients, cases, and court hearings with role-based access control.

- **Runtime:** Node.js v20+
- **Framework:** Express.js v5
- **Database:** MySQL 8.x via Sequelize ORM v6
- **Auth:** JWT + bcrypt
- **Docs:** Swagger UI at `/api/docs`

---

## Directory Structure

```
docket-backend/
├── src/
│   ├── app.js                  # Express app entry point
│   ├── config/
│   │   ├── settings.js         # Centralized env vars (import this, NOT process.env)
│   │   ├── database.js         # Sequelize connection config
│   │   ├── cors.js             # CORS middleware config
│   │   ├── logger.js           # Server startup log output
│   │   └── swagger.js          # Swagger/OpenAPI setup
│   ├── constants/
│   │   ├── types.js            # Domain enums: ROLES, CASE_STATUS, CASE_TYPE, etc.
│   │   ├── errorCodes.js       # HTTP status codes (HTTP) and error strings (ERR)
│   │   └── index.js            # Barrel export for all constants
│   ├── middlewares/
│   │   ├── validate.js         # express-validator error handler middleware
│   │   └── errors/
│   │       ├── appError.js     # AppError class for operational errors
│   │       ├── ormError.js     # Sequelize error → HTTP mapper
│   │       ├── serverError.js  # 500 catch-all handler
│   │       └── index.js        # Barrel + notFoundHandler + errorHandler
│   ├── models/                 # Sequelize models (to be created)
│   ├── routes/
│   │   └── index.js            # Main router; uncomment modules as built
│   ├── controllers/            # Route controllers (to be created)
│   ├── services/               # Business logic (to be created)
│   └── utils/                  # Shared helpers (to be created)
├── migrations/                 # Sequelize migration files
├── seeders/                    # Sequelize seed files
├── templates/
│   └── response.ejs            # HTML template for browser responses
├── docs/                       # Project documentation (API specs, ERD, etc.)
├── .env.example                # Required environment variable template
├── .sequelizerc                # Sequelize CLI path config
└── package.json
```

---

## Development Setup

### Prerequisites
- Node.js v20+
- MySQL 8.x running locally

### First-Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Then edit .env with your MySQL credentials

# 3. Create MySQL database
mysql -u root -p -e "CREATE DATABASE docket_db;"

# 4. Run migrations to create tables
npm run migrate

# 5. Seed test data
npm run seed

# 6. Start development server
npm run dev
```

### NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (auto-restart) |
| `npm start` | Production start |
| `npm run migrate` | Run pending Sequelize migrations |
| `npm run migrate:undo` | Rollback last migration |
| `npm run migrate:undo:all` | Drop all tables |
| `npm run seed` | Populate test data |
| `npm run seed:undo` | Remove all seeded data |

---

## Environment Variables

Copy `.env.example` to `.env`. Never commit `.env`.

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=docket_db
DB_USER=root
DB_PASSWORD=

JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRES_IN=7d

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM="Docket <no-reply@docket.com>"
```

**Critical rule:** All code must import config from `src/config/settings.js`. Never call `process.env` directly anywhere else.

---

## Architecture Conventions

### 1. Configuration via `settings.js`

```js
// CORRECT
const settings = require('./config/settings');
const port = settings.port;
const secret = settings.jwt.secret;

// WRONG — never do this
const secret = process.env.JWT_SECRET;
```

### 2. Constants — Never Use Magic Strings

Always import from `src/constants/`:

```js
const { HTTP, ERR } = require('../constants');
const { ROLES, CASE_STATUS } = require('../constants');

// Use HTTP codes
res.status(HTTP.CREATED).json({ ... });

// Use error messages
throw new AppError(ERR.NOT_FOUND, HTTP.NOT_FOUND);

// Use domain enums in models and validation
role: { type: DataTypes.ENUM(...Object.values(ROLES)) }
```

### 3. Error Handling — Always Use `AppError`

Throw `AppError` for all expected (operational) errors in controllers and services. The global `errorHandler` catches it and responds correctly.

```js
const AppError = require('../middlewares/errors/appError');
const { HTTP, ERR } = require('../constants');

// In a controller or service:
if (!user) throw new AppError(ERR.NOT_FOUND, HTTP.NOT_FOUND);
if (user.role !== ROLES.SENIOR_PARTNER) throw new AppError(ERR.FORBIDDEN, HTTP.FORBIDDEN);
```

Never catch errors in controllers just to send a response — let them bubble to `errorHandler`.

### 4. Standard API Response Shape

Every JSON response must use this shape:

**Success:**
```json
{
  "success": true,
  "message": "Human-readable description",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Human-readable error message",
  "data": null,
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

### 5. Content Negotiation

All routes support both JSON and HTML responses. Browsers receive an EJS-rendered HTML page; API clients receive JSON. This is handled automatically by the global `renderOrJson` helper in `middlewares/errors/index.js`. The health check in `routes/index.js` is the reference implementation.

```js
// Pattern used throughout
if (req.accepts(['json', 'html']) === 'html') {
  res.set('Cache-Control', 'no-store');
  return res.render('response', { title, method, route, statusCode, timestamp, data });
}
res.status(statusCode).json(responsePayload);
```

### 6. Middleware Order in Routes

For protected routes, middleware must be applied in this order:

```
validationRules → validate → authMiddleware → requireRole(...) → controller
```

- `validate` — defined in `src/middlewares/validate.js`, processes express-validator errors
- `authMiddleware` — verifies JWT, attaches `req.user`
- `requireRole(...roles)` — checks `req.user.role` is in the allowed list

### 7. Route Module Registration

Routes are registered in `src/routes/index.js`. Add a new route module by uncommenting the relevant line:

```js
// Uncomment as each module is built and merged
router.use('/auth',      require('./authRoutes'));
router.use('/lawyers',   require('./lawyerRoutes'));
router.use('/clients',   require('./clientRoutes'));
router.use('/cases',     require('./caseRoutes'));
router.use('/hearings',  require('./hearingRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));
```

---

## Database Design

### Tables and Primary Keys

| Table | PK Type | PK Format |
|-------|---------|-----------|
| `lawyers` | UUID | e.g., `a1b2c3d4-...` |
| `clients` | UUID | e.g., `a1b2c3d4-...` |
| `cases` | VARCHAR(20) | e.g., `SLT-001` |
| `hearings` | UUID | e.g., `a1b2c3d4-...` |

### Key Relationships

- `lawyers` 1:M `cases` (nullable FK — case may be unassigned)
- `clients` 1:M `cases` (non-nullable FK)
- `cases` 1:M `hearings`
- `lawyers` 1:M `hearings` (as `created_by`)

### Domain Enums (from `src/constants/types.js`)

```js
ROLES          = { SENIOR_PARTNER, ASSOCIATE, SECRETARY }
CASE_STATUS    = { ACTIVE, PENDING, IN_REVIEW, URGENT, CLOSED }
CASE_TYPE      = { CIVIL, CRIMINAL, CORPORATE, FAMILY, PROPERTY }
CLIENT_TYPE    = { INDIVIDUAL, CORPORATE }
URGENCY        = { RED, ORANGE, GREEN }
```

### Sequelize Model Conventions

- Use `underscored: true` and `timestamps: true` in model options
- UUID fields: use `DataTypes.UUID` with `defaultValue: DataTypes.UUIDV4`
- Enum fields: `DataTypes.ENUM(...Object.values(ROLES))` — always spread from constants
- Define associations in a static `associate(models)` method on the model class

---

## Authentication & Authorization

### JWT Flow

1. Client POSTs credentials to `POST /api/auth/login`
2. Server validates, returns `{ token, user }` on success
3. Client sends `Authorization: Bearer <token>` on all subsequent requests
4. `authMiddleware` verifies the token and sets `req.user`

### Role Permissions Matrix

| Action | senior_partner | associate | secretary |
|--------|:-:|:-:|:-:|
| Create lawyer | ✅ | ❌ | ❌ |
| Deactivate lawyer | ✅ | ❌ | ❌ |
| View all cases | ✅ | own only | ✅ |
| Create/edit case | ✅ | ❌ | ✅ |
| Delete case | ✅ | ❌ | ❌ |
| Assign lawyer to case | ✅ | ❌ | ✅ |
| Create/edit client | ✅ | ❌ | ✅ |
| Delete client | ✅ | ❌ | ❌ |
| Schedule hearings | ✅ | ✅ | ✅ |
| Dashboard stats | ✅ | ✅ | ✅ |

### `requireRole` Usage Pattern

```js
const { requireRole } = require('../middlewares/auth');
const { ROLES } = require('../constants');

router.post('/', authMiddleware, requireRole(ROLES.SENIOR_PARTNER, ROLES.SECRETARY), createCase);
router.delete('/:id', authMiddleware, requireRole(ROLES.SENIOR_PARTNER), deleteCase);
```

---

## API Endpoints Reference

All routes are prefixed with `/api`.

### Auth
| Method | Path | Access |
|--------|------|--------|
| POST | `/auth/login` | Public |
| POST | `/auth/logout` | Authenticated |
| GET | `/auth/me` | Authenticated |

### Lawyers
| Method | Path | Access |
|--------|------|--------|
| GET | `/lawyers` | Authenticated |
| POST | `/lawyers` | senior_partner |
| GET | `/lawyers/:id` | Authenticated |
| PUT | `/lawyers/:id` | senior_partner |
| PATCH | `/lawyers/:id/deactivate` | senior_partner |

### Clients
| Method | Path | Access |
|--------|------|--------|
| GET | `/clients` | Authenticated |
| POST | `/clients` | senior_partner, secretary |
| GET | `/clients/:id` | Authenticated |
| PUT | `/clients/:id` | senior_partner, secretary |
| DELETE | `/clients/:id` | senior_partner |

### Cases
| Method | Path | Access |
|--------|------|--------|
| GET | `/cases` | Authenticated (role-filtered) |
| POST | `/cases` | senior_partner, secretary |
| GET | `/cases/:id` | Authenticated |
| PUT | `/cases/:id` | senior_partner, secretary |
| DELETE | `/cases/:id` | senior_partner |
| PATCH | `/cases/:id/assign` | senior_partner, secretary |
| PATCH | `/cases/:id/status` | Authenticated |
| GET | `/cases/:id/hearings` | Authenticated |

### Hearings
| Method | Path | Access |
|--------|------|--------|
| GET | `/hearings` | Authenticated |
| POST | `/hearings` | Authenticated |
| GET | `/hearings/:id` | Authenticated |
| PUT | `/hearings/:id` | Authenticated |
| DELETE | `/hearings/:id` | Authenticated |

### Dashboard
| Method | Path | Access |
|--------|------|--------|
| GET | `/dashboard/stats` | Authenticated |
| GET | `/dashboard/upcoming-hearings` | Authenticated |
| GET | `/dashboard/recent-cases` | Authenticated |

---

## Swagger Documentation

Swagger UI is served at **`/api/docs`**. Add JSDoc `@swagger` annotations to route files. The scanner reads all files matching `src/routes/*.js`.

```js
/**
 * @swagger
 * /cases:
 *   get:
 *     summary: List all cases
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cases
 */
router.get('/', authMiddleware, listCases);
```

The `bearerAuth` security scheme is already configured in `src/config/swagger.js`.

---

## Seeded Test Accounts

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| senior_partner | senior@docket.com | Password123! |
| associate | associate@docket.com | Password123! |
| secretary | secretary@docket.com | Password123! |

---

## Key Files Quick Reference

| What | Where |
|------|-------|
| App entry point | `src/app.js` |
| Env config object | `src/config/settings.js` |
| All constants | `src/constants/index.js` |
| AppError class | `src/middlewares/errors/appError.js` |
| Global error handler | `src/middlewares/errors/index.js` |
| Validation middleware | `src/middlewares/validate.js` |
| Main router | `src/routes/index.js` |
| HTML response template | `templates/response.ejs` |
| Sequelize CLI config | `.sequelizerc` |
| Full API spec docs | `docs/` |
| Postman collection | `docs/DOCKET_Postman_Collection.json` |

---

## Common Pitfalls to Avoid

1. **Reading `process.env` directly** — always use `settings.js`.
2. **Using raw strings for roles/status** — always use constants from `src/constants/types.js`.
3. **Using magic numbers for HTTP codes** — always use `HTTP.NOT_FOUND` etc.
4. **Catching errors in controllers to send a response** — throw `AppError` and let the global handler respond.
5. **Adding a route module without uncommenting it** in `src/routes/index.js`.
6. **Forgetting content negotiation** — new routes that return data should follow the `req.accepts(['json', 'html'])` pattern.
7. **Not using `validate` middleware after express-validator rules** — validation rules alone do nothing without the `validate` handler after them.
8. **Hardcoding ENUM values in models** — always spread from constants: `DataTypes.ENUM(...Object.values(ROLES))`.

---

## Team Module Ownership

| Module | Owner |
|--------|-------|
| Project setup, DB models, seeders | Shemaiah (Team Lead) |
| Auth system, Cases module | Kuol |
| Lawyers module, Swagger docs | Ola |
| Clients module, filters & search | Omotayo |
| Hearings module | Sonia |
| Dashboard endpoints | Oluwaseyi |
