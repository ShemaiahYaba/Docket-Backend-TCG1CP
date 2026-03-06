# Docket — Backend Tech Stack
**Legal Case Management Platform · Capstone 2026**

---

## Runtime & Framework

| Package | Version | Purpose |
|---------|---------|---------|
| Node.js | LTS (v20+) | Runtime environment |
| Express.js | ^4.x | Web framework and routing |

---

## Database

| Package | Version | Purpose |
|---------|---------|---------|
| MySQL | 8.x | Primary relational database |
| Sequelize | ^6.x | ORM — models, migrations, associations |
| sequelize-cli | ^6.x | Database migration and seeding via CLI |
| mysql2 | ^3.x | MySQL driver (required by Sequelize) |

---

## Authentication & Security

| Package | Version | Purpose |
|---------|---------|---------|
| jsonwebtoken | ^9.x | JWT generation and verification |
| bcrypt | ^5.x | Password hashing |
| helmet | ^7.x | Secure HTTP headers |
| cors | ^2.x | Cross-Origin Resource Sharing (for frontend + mobile) |

---

## Validation

| Package | Version | Purpose |
|---------|---------|---------|
| express-validator | ^7.x | Input validation and sanitization on all routes |

---

## Email

| Package | Version | Purpose |
|---------|---------|---------|
| Nodemailer | ^6.x | Transactional email sending |

---

## Scheduling *(owned by [Your Name])*

| Package | Version | Purpose |
|---------|---------|---------|
| node-cron | ^3.x | Scheduled jobs — 3-day and 1-day hearing alert emails |

---

## Documentation

| Package | Version | Purpose |
|---------|---------|---------|
| swagger-ui-express | ^5.x | Serves the Swagger UI at `/api/docs` |
| swagger-jsdoc | ^6.x | Generates Swagger spec from JSDoc comments in route files |

---

## Logging & Dev Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| morgan | ^1.x | HTTP request logger (dev + production) |
| dotenv | ^16.x | Environment variable management via `.env` |
| uuid | ^9.x | UUID generation for primary keys |

---

## Install Command

```bash
npm install express sequelize sequelize-cli mysql2 jsonwebtoken bcrypt helmet cors express-validator nodemailer node-cron swagger-ui-express swagger-jsdoc morgan dotenv uuid
```

```bash
npm install --save-dev nodemon
```

---

## Project Structure

```
docket-backend/
├── src/
│   ├── config/           # DB config, environment setup
│   ├── controllers/      # Route handler logic
│   ├── middlewares/      # Auth, role checks, validation
│   ├── models/           # Sequelize models
│   ├── routes/           # Express route definitions
│   ├── services/         # Business logic, email, cron jobs
│   ├── utils/            # Helper functions
│   └── app.js            # Express app setup
├── migrations/           # Sequelize migration files
├── seeders/              # Sample data seeders
├── .env                  # Environment variables (gitignored)
├── .gitignore
├── package.json
└── README.md
```

---

## Environment Variables (`.env`)

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=docket_db
DB_USER=root
DB_PASSWORD=

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM="Docket <no-reply@docket.com>"
```

---

## Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| SQL vs NoSQL | MySQL | Schema is clearly relational — cases, clients, lawyers, hearings all have defined foreign key relationships |
| ORM | Sequelize | Covered in class; handles migrations cleanly; strong association support |
| Auth | JWT (stateless) | Required by PRD; consumed identically by web frontend and React Native mobile app |
| Docs | Swagger | Explicitly required in PRD; accessible at `/api/docs` |
| Scheduling | node-cron | Lightweight, no queue infrastructure needed for V1 hearing alerts |

---

*Docket Backend · Stack v1.0 · March 2026*
