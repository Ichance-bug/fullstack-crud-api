# Full-Stack CRUD API

A role-based REST API built with Node.js, Express, TypeScript, MySQL, and Sequelize — with a vanilla JS frontend served as static files.

## Project Structure

```
fullstack-crud-api/
├── src/
│   ├── server.ts                    ← Entry point, Express app setup, route registration
│   │
│   ├── _helpers/
│   │   ├── db.ts                    ← Sequelize init and DB sync
│   │   ├── role.ts                  ← Role enum (admin | user)
│   │   └── seed.ts                  ← Seeds default admin and departments on startup
│   │
│   ├── _middleware/
│   │   ├── errorHandler.ts          ← Global error handler
│   │   └── validateRequest.ts       ← Joi schema validation middleware
│   │
│   ├── auth/
│   │   ├── auth.controller.ts       ← POST /api/login, /api/register, GET /api/profile
│   │   ├── auth.service.ts          ← login, register, verify, getProfile logic
│   │   └── auth.middleware.ts       ← JWT authMiddleware, adminMiddleware
│   │
│   ├── users/
│   │   ├── user.model.ts            ← User (id, email, password, role, isVerified...)
│   │   ├── user.controller.ts       ← CRUD /api/users
│   │   └── user.service.ts          ← getAll, getById, create, update, delete
│   │
│   ├── admin/
│   │   ├── admin.controller.ts      ← /api/admin/accounts, /api/admin/requests
│   │   └── admin.service.ts         ← manage accounts + request status
│   │
│   ├── department/
│   │   ├── department.model.ts      ← Department (id, name, description)
│   │   ├── department.controller.ts ← GET /api/departments
│   │   └── department.service.ts
│   │
│   ├── employees/
│   │   ├── employees.model.ts       ← Employee (employeeId, email, position, deptId, hireDate)
│   │   ├── employees.controller.ts  ← CRUD /api/employees
│   │   └── employees.service.ts
│   │
│   ├── requests/
│   │   ├── requests.model.ts        ← Request (id, userId, type, items, status, date)
│   │   ├── requests.controller.ts   ← CRUD /api/requests
│   │   └── requests.service.ts
│   │
│   └── public/                      ← Static HTML frontend pages
│       ├── home.html
│       ├── login.html
│       ├── register.html
│       ├── userDashboard.html
│       ├── adminDashboard.html
│       ├── accounts.html
│       ├── employees.html
│       ├── departments.html
│       ├── request.html
│       └── AllRequestAdmin.html
│
├── config.json                      ← DB connection config (gitignored)
├── package.json
└── tsconfig.json
```

## Prerequisites

- Node.js v14+
- MySQL v8.0+
- A browser (for the frontend)

## Setup

### 1. Clone and install dependencies

```bash
npm install
```

### 2. Create the MySQL database

```sql
CREATE DATABASE fullstack_crud_api;
```

### 3. Configure database credentials

Edit `config.json`:

```json
{
  "database": {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "your_mysql_password",
    "database": "fullstack_crud_api"
  }
}
```

### 4. Start the server

```bash
npm run start:dev
```

You should see:
```
MySQL connected.
Database synced.
Server running on http://localhost:3000
Admin seeded.
Departments seeded.
```

### 5. Open the frontend

Visit `http://localhost:3000/home.html` in your browser.

## Default Admin Account

```
Email:    admin@example.com
Password: admin123
```

## API Endpoints

Base URL: `http://localhost:3000/api`

### Auth
| Method | Endpoint    | Description               | Auth |
|--------|-------------|---------------------------|------|
| POST   | /register   | Register new user         | No   |
| POST   | /verify     | Verify email              | No   |
| POST   | /login      | Login                     | No   |
| GET    | /profile    | Get own profile           | Yes  |

### Users (Admin only)
| Method | Endpoint                      | Description        |
|--------|-------------------------------|--------------------|
| GET    | /users                        | List all users     |
| POST   | /users                        | Create user        |
| PUT    | /users/:id                    | Update user        |
| DELETE | /users/:id                    | Delete user        |
| POST   | /users/:id/reset-password     | Reset password     |

### Admin
| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| GET    | /admin/accounts                   | List all accounts        |
| POST   | /admin/accounts                   | Create account           |
| PUT    | /admin/accounts/:id               | Update account           |
| DELETE | /admin/accounts/:id               | Delete account           |
| POST   | /admin/accounts/:id/reset-password| Reset password           |
| GET    | /admin/requests                   | List all requests        |
| PUT    | /admin/requests/:id/status        | Approve / Reject request |

### Departments (Authenticated)
| Method | Endpoint      | Description          |
|--------|---------------|----------------------|
| GET    | /departments  | List all departments |

### Employees (Admin only)
| Method | Endpoint                  | Description       |
|--------|---------------------------|-------------------|
| GET    | /employees                | List employees    |
| POST   | /employees                | Add employee      |
| PUT    | /employees/:employeeId    | Update employee   |
| DELETE | /employees/:employeeId    | Delete employee   |

### Requests (Authenticated)
| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | /requests           | Get my requests          |
| POST   | /requests           | Submit new request       |
| GET    | /requests/all       | All requests (admin)     |
| PUT    | /requests/:id/status| Update status (admin)    |

## Testing with Postman

1. `POST http://localhost:3000/api/login`
```json
{ "email": "admin@example.com", "password": "admin123" }
```
2. Copy the `token` from the response
3. On protected requests: `Authorization` tab → `Bearer Token` → paste token

## Scripts

```bash
npm run start:dev   # Run with ts-node + nodemon (no build needed)
npm run build       # Compile TypeScript to dist/
npm start           # Run compiled dist/ (production)
```

## Step-by-Step Implementation History

### Step 1 — Initial Project

Started with a plain Node.js/Express backend (`server.js`) using in-memory arrays for data storage, and a single-page frontend (`index.html`, `style.css`, `script.js`).

### Step 2 — Frontend Reorganized

Merged `index.html`, `style.css`, and `script.js` into one self-contained `index.html`. Later split into separate pages per feature (`login.html`, `register.html`, `adminDashboard.html`, etc.) and moved into `src/public/`.

### Step 3 — TypeScript Migration

Migrated the backend to TypeScript. Installed dependencies:

```bash
npm init -y
npm install express mysql2 sequelize bcryptjs jsonwebtoken cors joi
npm install --save-dev typescript ts-node @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken nodemon
npx tsc --init
```

Restructured into modules: `auth/`, `users/`, `admin/`, `department/`, `employees/`, `requests/`.

### Step 4 — MySQL with Sequelize

Replaced in-memory arrays with a real MySQL database. Sequelize auto-creates and syncs tables on startup using `sync({ alter: true })`.

### Step 5 — Final Restructure

Removed the `backend/` subfolder. Project now lives at the root — no more `cd backend`. Run `npm run start:dev` directly from the project root.

## Notes

- `dist/` is gitignored — regenerate with `npm run build`
- `config.json` is gitignored — never commit credentials
- Tables are auto-created on first run
- Default admin and departments are seeded automatically
