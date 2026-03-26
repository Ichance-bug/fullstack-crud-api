# TypeScript CRUD API

A fully-typed REST API built with Node.js, Express, TypeScript, MySQL, and Sequelize.

## Features

- Full TypeScript implementation with strict type checking
- MySQL database with Sequelize ORM
- User CRUD operations (Create, Read, Update, Delete)
- Request validation using Joi
- Password hashing with bcrypt
- Role-based user system (Admin/User)
- Global error handling

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn

## Setup Instructions

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Configure MySQL:**
   - Start MySQL service
   - Update `src/config.json` with your MySQL credentials:
```json
{
  "database": {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "your_mysql_password",
    "database": "typescript_crud_api"
  }
}
```

3. **Start the development server:**
```bash
npm run start:dev
```

The API will run on `http://localhost:4000`

## API Endpoints

### Create User
- **POST** `/users`
- **Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "title": "Mr",
  "firstName": "John",
  "lastName": "Doe",
  "role": "User"
}
```

### Get All Users
- **GET** `/users`
- **Response:** Array of users (id and email only)

### Get User by ID
- **GET** `/users/:id`
- **Response:** User object (id and email only)

### Update User
- **PUT** `/users/:id`
- **Body (JSON):** Any user fields to update

### Delete User
- **DELETE** `/users/:id`

## Testing with Postman

1. Start the server: `npm run start:dev`
2. Open Postman
3. Create a new request
4. Test endpoints using the URLs above

## Project Structure

```
typescript-crud-api/
├── src/
│   ├── _helpers/
│   │   ├── db.ts           # Database initialization
│   │   └── role.ts         # Role enum
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── validateRequest.ts
│   ├── users/
│   │   ├── user.controller.ts
│   │   ├── user.model.ts
│   │   └── user.service.ts
│   ├── config.json         # Database config
│   └── server.ts           # Entry point
├── tsconfig.json
└── package.json
```

## Scripts

- `npm run start:dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled JavaScript

## Technologies

- TypeScript
- Express.js
- MySQL
- Sequelize ORM
- Joi (validation)
- bcrypt (password hashing)
