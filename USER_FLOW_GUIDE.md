# User Schema & Flow - Complete Guide

This document explains the complete user registration system flow with MongoDB validation and Zod schemas.

## 📁 File Structure

```
src/
├── models/
│   └── user.model.js          # MongoDB schema validation & database operations
├── validations/
│   └── user.validation.js     # Zod request validation schemas
├── middlewares/
│   └── validate.middleware.js # Zod validation middleware
├── services/
│   └── user.service.js        # Business logic layer
├── controllers/
│   └── user.controller.js     # HTTP request/response handlers
├── routes/
│   └── user.routes.js         # API routes with validation
└── config/
    └── db.js                  # MongoDB connection & schema initialization
```

## 🔄 Complete Flow

### 1. **MongoDB Schema Validation** (Database Level)

Location: `src/models/user.model.js`

```javascript
export const userSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "roleId",
                "firstName",
                "lastName",
                "username",
                "mobile",
                "email",
                "passwordHash",
            ],
            properties: {
                roleId: { bsonType: "int", minimum: 1 },
                firstName: { bsonType: "string", maxLength: 50 },
                middleName: { bsonType: ["string", "null"], maxLength: 50 },
                lastName: { bsonType: "string", maxLength: 50 },
                username: { bsonType: "string", maxLength: 50 },
                mobile: { bsonType: "string", maxLength: 15 },
                email: { bsonType: "string", maxLength: 50 },
                passwordHash: { bsonType: "string", maxLength: 255 },
                registeredAt: { bsonType: "date" },
                lastLogin: { bsonType: ["date", "null"] },
                intro: { bsonType: ["string", "null"] },
                profile: { bsonType: ["string", "null"] },
            },
        },
    },
};
```

**Features:**

- ✅ Database-level validation
- ✅ Unique indexes on username and email
- ✅ Auto-initialized on server start

### 2. **Zod Validation** (Request Level)

Location: `src/validations/user.validation.js`

```javascript
export const registerUserSchema = z.object({
    body: z.object({
        roleId: z.number().int().positive(),
        firstName: z.string().min(1).max(50).trim(),
        middleName: z.string().max(50).trim().optional(),
        lastName: z.string().min(1).max(50).trim(),
        username: z
            .string()
            .min(3)
            .max(50)
            .regex(/^[a-zA-Z0-9_]+$/)
            .trim(),
        mobile: z
            .string()
            .min(10)
            .max(15)
            .regex(/^\+?[0-9]{10,15}$/)
            .trim(),
        email: z.string().email().max(50).toLowerCase().trim(),
        password: z
            .string()
            .min(8)
            .max(255)
            .regex(/[A-Z]/)
            .regex(/[a-z]/)
            .regex(/[0-9]/)
            .regex(/[^A-Za-z0-9]/),
        intro: z.string().max(500).trim().optional(),
        profile: z.string().max(2000).trim().optional(),
    }),
});
```

**Features:**

- ✅ Request validation before processing
- ✅ Custom error messages
- ✅ Data sanitization (trim, lowercase)
- ✅ Strong password validation

### 3. **Validation Middleware**

Location: `src/middlewares/validate.middleware.js`

Automatically validates requests using Zod schemas:

```javascript
export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            // Returns formatted validation errors
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Validation failed",
                errors: [...],
            });
        }
    };
};
```

### 4. **Service Layer** (Business Logic)

Location: `src/services/user.service.js`

```javascript
export const registerUser = async (userData) => {
    // 1. Check username existence
    // 2. Check email existence
    // 3. Hash password
    // 4. Prepare user document
    // 5. Save to database
    // 6. Return user (without password)
};
```

### 5. **Controller Layer** (HTTP Handlers)

Location: `src/controllers/user.controller.js`

```javascript
export const register = async (req, res) => {
    try {
        const result = await userService.registerUser(req.body);
        res.status(201).json({
            statusCode: 201,
            status: "success",
            message: "User registered successfully",
            data: result,
        });
    } catch (error) {
        // Handle different error types
    }
};
```

### 6. **Routes with Validation**

Location: `src/routes/user.routes.js`

```javascript
// Public routes
router.post("/register", validate(registerUserSchema), userController.register);
router.post("/login", validate(loginUserSchema), userController.login);

// Protected routes (require authentication)
router.get("/profile", authenticate, userController.getProfile);
router.get("/:id", authenticate, validate(getUserByIdSchema), userController.getUserById);
router.put("/:id", authenticate, validate(updateUserSchema), userController.updateUser);
router.delete("/:id", authenticate, validate(getUserByIdSchema), userController.deleteUser);
```

## 📝 API Endpoints

### Register User

```http
POST /api/users/register
Content-Type: application/json

{
    "roleId": 1,
    "firstName": "John",
    "middleName": "Michael",
    "lastName": "Doe",
    "username": "johndoe",
    "mobile": "+1234567890",
    "email": "john@example.com",
    "password": "Pass@1234",
    "intro": "Software Developer",
    "profile": "Experienced full-stack developer"
}
```

**Response:**

```json
{
    "statusCode": 201,
    "status": "success",
    "message": "User registered successfully",
    "data": {
        "id": "507f1f77bcf86cd799439011",
        "roleId": 1,
        "firstName": "John",
        "middleName": "Michael",
        "lastName": "Doe",
        "username": "johndoe",
        "mobile": "+1234567890",
        "email": "john@example.com",
        "registeredAt": "2024-02-17T10:30:00.000Z"
    }
}
```

### Login User

```http
POST /api/users/login
Content-Type: application/json

{
    "usernameOrEmail": "johndoe",
    "password": "Pass@1234"
}
```

**Response:**

```json
{
    "statusCode": 200,
    "status": "success",
    "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "id": "507f1f77bcf86cd799439011",
            "roleId": 1,
            "firstName": "John",
            "lastName": "Doe",
            "username": "johndoe",
            "email": "john@example.com"
        }
    }
}
```

### Get User Profile (Protected)

```http
GET /api/users/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get All Users (Protected)

```http
GET /api/users?page=1&limit=10&roleId=1
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update User (Protected)

```http
PUT /api/users/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
    "firstName": "Jane",
    "intro": "Updated intro"
}
```

### Delete User (Protected)

```http
DELETE /api/users/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🎨 Logging with Colors

The logger now properly shows colors based on log level:

- 🔴 **ERROR** - Red (5xx responses, errors)
- 🟡 **WARN** - Yellow (4xx responses, warnings)
- 🟢 **INFO** - Green (general info)
- 🟣 **HTTP** - Magenta (HTTP requests)
- 🔵 **DEBUG** - Blue (debug info)

## 🔐 Security Features

1. **Password Security**
    - Minimum 8 characters
    - Must contain uppercase, lowercase, number, and special character
    - Hashed with bcrypt before storage

2. **Unique Constraints**
    - Username must be unique
    - Email must be unique
    - Enforced at both application and database level

3. **Data Validation**
    - Request validation with Zod
    - Database validation with MongoDB schema
    - Sanitization (trim, lowercase)

4. **JWT Authentication**
    - Protected routes require valid JWT token
    - Token contains user info payload

## 🚀 How to Replicate for Other Entities

To create a similar flow for tasks, activities, comments, or tags:

### Step 1: Create Model File

`src/models/task.model.js`

```javascript
export const taskCollection = "tasks";

export const taskSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["userId", "title"],
            properties: {
                userId: { bsonType: "objectId" },
                title: { bsonType: "string", maxLength: 512 },
                // ... other fields
            },
        },
    },
};

export const taskIndexes = [{ key: { userId: 1 } }, { key: { createdAt: -1 } }];

// Database operations
export const createTask = async (taskData) => {
    /* ... */
};
export const findTaskById = async (taskId) => {
    /* ... */
};
// ... other operations
```

### Step 2: Create Validation Schema

`src/validations/task.validation.js`

```javascript
export const createTaskSchema = z.object({
    body: z.object({
        userId: z.string().regex(/^[0-9a-fA-F]{24}$/),
        title: z.string().min(1).max(512),
        // ... other fields
    }),
});
```

### Step 3: Create Service

`src/services/task.service.js`

```javascript
export const createTask = async (taskData) => {
    // Business logic
    // Validation
    // Database operations
};
```

### Step 4: Create Controller

`src/controllers/task.controller.js`

```javascript
export const createTask = async (req, res) => {
    try {
        const result = await taskService.createTask(req.body);
        res.status(201).json({ ... });
    } catch (error) {
        // Error handling
    }
};
```

### Step 5: Create Routes

`src/routes/task.routes.js`

```javascript
router.post("/", authenticate, validate(createTaskSchema), taskController.createTask);
```

### Step 6: Initialize in db.js

```javascript
import { initializeTaskCollection } from "#models/task.model.js";

export const connectDb = async (uri) => {
    // ... connection code
    await initializeTaskCollection();
};
```

## 📦 Dependencies

- `mongodb` - Native MongoDB driver
- `zod` - Schema validation
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `winston` - Logging with colors
- `express` - Web framework
- `cors` - CORS middleware
- `morgan` - HTTP request logger

## 🔧 Environment Variables

Create a `.env` file:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017
DB_NAME=crud_express

# JWT
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

## ✅ Testing the Flow

1. **Start MongoDB**

    ```bash
    mongosh
    ```

2. **Start the server**

    ```bash
    pnpm dev
    ```

3. **Register a user**

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

4. **Login**

    ```bash
    curl -X POST http://localhost:3000/api/users/login \
      -H "Content-Type: application/json" \
      -d '{
        "usernameOrEmail": "johndoe",
        "password": "Pass@1234"
      }'
    ```

5. **Get profile (use token from login)**
    ```bash
    curl -X GET http://localhost:3000/api/users/profile \
      -H "Authorization: Bearer YOUR_TOKEN_HERE"
    ```

## 📊 Database Schema Diagram

```
┌─────────────────────────────────────────┐
│              users                      │
├─────────────────────────────────────────┤
│ _id          : ObjectId (PK)            │
│ roleId       : Int (Indexed)            │
│ firstName    : String(50)               │
│ middleName   : String(50) (Optional)    │
│ lastName     : String(50)               │
│ username     : String(50) (Unique)      │
│ mobile       : String(15) (Indexed)     │
│ email        : String(50) (Unique)      │
│ passwordHash : String(255)              │
│ registeredAt : Date                     │
│ lastLogin    : Date (Nullable)          │
│ intro        : Text (Optional)          │
│ profile      : Text (Optional)          │
└─────────────────────────────────────────┘
```

---

**You now have a complete, production-ready user management system with:**

- ✅ MongoDB schema validation
- ✅ Zod request validation
- ✅ Proper error handling
- ✅ Colorful logging
- ✅ JWT authentication
- ✅ Clean architecture (MVC pattern)
- ✅ Password security
- ✅ Unique constraints
- ✅ Full CRUD operations

Use this pattern for all other entities (tasks, activities, comments, tags) in your application!
