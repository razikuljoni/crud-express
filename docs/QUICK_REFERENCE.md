# Quick Reference - User Schema & Flow

## 🎯 What Was Created

### 1. **MongoDB Schema** (`src/models/user.model.js`)

- Database-level validation
- Unique indexes on username & email
- All CRUD operations
- Auto-initialized on server start

### 2. **Zod Validation** (`src/validations/user.validation.js`)

- Request-level validation
- Strong password rules
- Email & mobile format validation
- Custom error messages

### 3. **Validation Middleware** (`src/middlewares/validate.middleware.js`)

- Validates requests before processing
- Returns formatted error messages
- Works with any Zod schema

### 4. **Service Layer** (`src/services/user.service.js`)

- Business logic
- Password hashing
- JWT token generation
- Error handling

### 5. **Controller Layer** (`src/controllers/user.controller.js`)

- HTTP request/response handling
- Proper status codes
- Consistent response format

### 6. **Routes** (`src/routes/user.routes.js`)

- Public routes (register, login)
- Protected routes (profile, CRUD operations)
- Validation middleware integration

## 🚀 Quick Start

### Start Server

```bash
pnpm dev
```

### Run Tests

```bash
./test-user-flow.sh
```

## 📝 API Endpoints

| Method | Endpoint              | Auth | Description               |
| ------ | --------------------- | ---- | ------------------------- |
| POST   | `/api/users/register` | No   | Register new user         |
| POST   | `/api/users/login`    | No   | Login user                |
| GET    | `/api/users/profile`  | Yes  | Get current user profile  |
| GET    | `/api/users`          | Yes  | Get all users (paginated) |
| GET    | `/api/users/:id`      | Yes  | Get user by ID            |
| PUT    | `/api/users/:id`      | Yes  | Update user               |
| DELETE | `/api/users/:id`      | Yes  | Delete user               |

## 📦 User Schema Fields

### Required Fields

- `roleId` (integer) - User role identifier
- `firstName` (string, max 50) - First name
- `lastName` (string, max 50) - Last name
- `username` (string, 3-50, unique) - Username
- `mobile` (string, 10-15) - Phone number
- `email` (string, max 50, unique) - Email address
- `password` (string, 8-255) - Password (hashed)

### Optional Fields

- `middleName` (string, max 50) - Middle name
- `intro` (string, max 500) - Short introduction
- `profile` (text, max 2000) - Full profile description

### Auto-Generated Fields

- `_id` (ObjectId) - MongoDB ID
- `registeredAt` (date) - Registration timestamp
- `lastLogin` (date) - Last login timestamp

## 🔐 Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

## 🎨 Logger Levels & Colors

- 🔴 **ERROR** - Errors & 5xx responses
- 🟡 **WARN** - Warnings & 4xx responses
- 🟢 **INFO** - General information
- 🟣 **HTTP** - HTTP requests
- 🔵 **DEBUG** - Debug information

## 📊 Response Format

### Success Response

```json
{
    "statusCode": 200,
    "status": "success",
    "message": "Operation successful",
    "data": {
        /* result */
    }
}
```

### Error Response

```json
{
    "statusCode": 400,
    "status": "error",
    "message": "Error description",
    "errors": [
        /* validation errors */
    ]
}
```

## 🔄 How to Replicate for Other Entities

Follow this pattern for tasks, activities, comments, tags:

1. **Create model** (`src/models/task.model.js`)
    - Define schema with validator
    - Create indexes
    - Add CRUD operations

2. **Create validation** (`src/validations/task.validation.js`)
    - Define Zod schemas for create/update

3. **Create service** (`src/services/task.service.js`)
    - Add business logic

4. **Create controller** (`src/controllers/task.controller.js`)
    - Handle HTTP requests/responses

5. **Create routes** (`src/routes/task.routes.js`)
    - Define endpoints with validation

6. **Initialize in db.js**
    - Add initialization call in `connectDb()`

7. **Add routes to app.js**
    - `app.use("/api/tasks", taskRoutes)`

## 🧪 Test Registration

```bash
curl -X POST http://localhost:3000/api/users/register \
-H "Content-Type: application/json" \
-d '{
  "roleId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "mobile": "+1234567890",
  "email": "john@example.com",
  "password": "Pass@1234"
}'
```

## 🔑 Test Login

```bash
curl -X POST http://localhost:3000/api/users/login \
-H "Content-Type: application/json" \
-d '{
  "usernameOrEmail": "johndoe",
  "password": "Pass@1234"
}'
```

## 👤 Test Protected Route

```bash
curl -X GET http://localhost:3000/api/users/profile \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📚 Dependencies Used

- `mongodb` - Native MongoDB driver
- `zod` - Schema validation
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `winston` - Colorful logging
- `express` - Web framework

## ✅ Features Implemented

✓ MongoDB schema validation
✓ Zod request validation
✓ Password hashing with bcrypt
✓ JWT authentication
✓ Protected routes
✓ Unique constraints
✓ Pagination support
✓ Colorful logging
✓ Proper error handling
✓ Clean architecture (MVC)
✓ Full CRUD operations

---

**For detailed explanation, see:** [USER_FLOW_GUIDE.md](./USER_FLOW_GUIDE.md)
