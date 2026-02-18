# 🚀 Complete Route Consolidation Guide

## Quick Overview

**✅ Consolidation Complete:** Auth and User routes are now unified under `/api/users`

When someone **registers** → A **new user is created** in the database with all provided fields.

---

## 🎯 Unified Endpoint Map

```
/api/users
├── POST /register          🔓 PUBLIC - Register new user (creates user in DB)
├── POST /login             🔓 PUBLIC - Login user (returns JWT token)
│
├── GET /profile            🔐 PROTECTED - Get current user's profile
├── GET /                   🔐 PROTECTED - List all users
├── GET /:id                🔐 PROTECTED - Get user by ID
├── PATCH /:id              🔐 PROTECTED - Update user
└── DELETE /:id             🔐 PROTECTED - Delete user
```

Legend:

- 🔓 **PUBLIC** - No authentication required
- 🔐 **PROTECTED** - Requires Bearer JWT token

---

## 📊 Registration Flow Simplified

```
REGISTRATION REQUEST
        ↓
User submits: firstName, lastName, email, username, password, etc.
        ↓
VALIDATION (Zod) ✓
        ↓
CHECK DUPLICATES ✓
  - Username already exists?
  - Email already exists?
        ↓
HASH PASSWORD ✓
  - Bcrypt(password) → passwordHash
        ↓
CREATE USER DOCUMENT ✓
  {
    roleId: 1,
    firstName: "Jane",
    lastName: "Smith",
    username: "janesmith",
    email: "jane@example.com",
    mobile: "+1234567890",
    passwordHash: "$2b$10$...",    ← Hashed, never plain text
    registeredAt: 2026-02-17T...,
    lastLogin: null                 ← Set on first login
  }
        ↓
SAVE TO DATABASE ✓
  - Insert into "users" collection
  - Indexes applied automatically
        ↓
RESPONSE 201 CREATED ✓
  {
    "id": "...",
    "username": "janesmith",
    "email": "jane@example.com",
    ...
  }
```

---

## 🔐 User Creation in MongoDB

### What Gets Stored

```javascript
// Database: crud_express
// Collection: users

{
  "_id": ObjectId("65d1f85e8c9b4a1d2e3f4a01"),

  // Basic Info
  "roleId": 1,                              // 1=dev, 2=designer, 3=manager
  "firstName": "Jane",
  "middleName": null,                       // optional
  "lastName": "Smith",

  // Credentials
  "username": "janesmith",                  // UNIQUE INDEX
  "email": "jane.smith@example.com",        // UNIQUE INDEX
  "mobile": "+1234567890",
  "passwordHash": "$2b$10$KIXz...",         // HASHED - Never plain text

  // Timestamps
  "registeredAt": ISODate("2026-02-17T10:43:30.347Z"),
  "lastLogin": ISODate("2026-02-17T10:43:55.320Z"),  // Updated on each login

  // Optional Fields
  "intro": "Full Stack Developer",          // Bio
  "profile": "10 years experience"          // Detailed profile
}
```

### Index Strategy

```
Index: username (UNIQUE)
  → Prevents duplicate usernames
  → Speeds up username lookups

Index: email (UNIQUE)
  → Prevents duplicate emails
  → Speeds up email lookups
```

---

## 🔄 What Happens in Each Layer

### 1️⃣ Route Layer (`user.routes.js`)

```javascript
router.post(
    "/register", // Path
    validate(registerUserSchema), // Zod validation middleware
    userController.register, // Handler function
);

// When someone does: POST /api/users/register
// → Validation middleware checks data against Zod schema
// → If valid: passes to user.controller.register()
// → If invalid: returns 400 Bad Request
```

### 2️⃣ Controller Layer (`user.controller.js`)

```javascript
export const register = async (req, res) => {
    try {
        const result = await userService.registerUser(req.body);
        // ↓ userService.registerUser() returns:
        // {
        //   id: "...",
        //   username: "janesmith",
        //   email: "jane@example.com",
        //   ...
        // }

        res.status(201).json({
            statusCode: 201,
            status: "success",
            message: "User registered successfully",
            data: result,
        });
    } catch (error) {
        // Handle errors (duplicates, server errors)
    }
};
```

### 3️⃣ Service Layer (`user.service.js`)

```javascript
export const registerUser = async (userData) => {
  // 1. Check if username exists
  const existingUsername = await userModel.findUserByUsername(userData.username);
  if (existingUsername) {
    throw new Error("Username already exists");  // → 409 in controller
  }

  // 2. Check if email exists
  const existingEmail = await userModel.findUserByEmail(userData.email);
  if (existingEmail) {
    throw new Error("Email already exists");      // → 409 in controller
  }

  // 3. Hash password
  const passwordHash = await hashPassword(userData.password);

  // 4. Prepare document
  const userDocument = {
    roleId: userData.roleId,
    firstName: userData.firstName,
    lastName: userData.lastName,
    username: userData.username,
    email: userData.email,
    mobile: userData.mobile,
    passwordHash: passwordHash,              ← Never plain text
    registeredAt: new Date(),
    lastLogin: null,
    intro: userData.intro || null,
    profile: userData.profile || null
  };

  // 5. Create in database
  const result = await userModel.createUser(userDocument);

  // 6. Return user without password
  return {
    id: result.insertedId,
    username: userData.username,
    email: userData.email,
    ...
  };
};
```

### 4️⃣ Model Layer (`user.model.js`)

```javascript
export const createUser = async (userData) => {
    const db = getDb();
    const result = await db.collection("users").insertOne(userData);

    // Returns: { insertedId: ObjectId("...") }
    // MongoDB:
    // - Inserts the document
    // - Automatically applies indexes
    // - Returns the inserted ID
};

export const findUserByUsername = async (username) => {
    const db = getDb();
    return await db.collection("users").findOne({ username });
};

export const findUserByEmail = async (email) => {
    const db = getDb();
    return await db.collection("users").findOne({ email });
};
```

### 5️⃣ Database Layer (MongoDB)

```
Collection: users

Document inserted:
{
  "_id": ObjectId("..."),
  "roleId": 1,
  "firstName": "Jane",
  "lastName": "Smith",
  "username": "janesmith",     ← INDEXED for fast lookup
  "email": "jane@example.com", ← INDEXED for fast lookup
  "mobile": "+1234567890",
  "passwordHash": "$2b$10$...",
  "registeredAt": ISODate("..."),
  "lastLogin": null,
  "intro": null,
  "profile": null
}

Indexes created automatically:
- username (UNIQUE)
- email (UNIQUE)
```

---

## 🧪 Testing All Scenarios

### ✅ Successful Registration

```bash
POST /api/users/register
{
  "roleId": 1,
  "firstName": "Jane",
  "lastName": "Smith",
  "username": "janesmith",
  "email": "jane@example.com",
  "mobile": "+1234567890",
  "password": "SecurePass@123"
}

RESPONSE 201:
{
  "statusCode": 201,
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": "...",
    "roleId": 1,
    "firstName": "Jane",
    ...
  }
}
```

### ❌ Duplicate Username

```bash
POST /api/users/register
{
  "username": "janesmith",     ← Already exists
  ...
}

RESPONSE 409:
{
  "statusCode": 409,
  "status": "error",
  "message": "Username already exists"
}
```

### ❌ Invalid Email Format

```bash
POST /api/users/register
{
  "email": "not-an-email",     ← Invalid format
  ...
}

RESPONSE 400:
{
  "statusCode": 400,
  "status": "error",
  "message": "Validation failed: Invalid email format"
}
```

### ❌ Weak Password

```bash
POST /api/users/register
{
  "password": "weak"           ← Less than 8 chars, no uppercase/number/special
}

RESPONSE 400:
{
  "statusCode": 400,
  "status": "error",
  "message": "Validation failed: Password must be 8+ chars with uppercase, number, special char"
}
```

### ✅ Login After Registration

```bash
POST /api/users/login
{
  "usernameOrEmail": "janesmith",
  "password": "SecurePass@123"
}

RESPONSE 200:
{
  "statusCode": 200,
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "username": "janesmith",
      "email": "jane@example.com",
      "roleId": 1
    }
  }
}
```

### ✅ Access Protected Route with Token

```bash
GET /api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

RESPONSE 200:
{
  "statusCode": 200,
  "status": "success",
  "data": {
    "_id": "...",
    "username": "janesmith",
    "email": "jane@example.com",
    ...
    "lastLogin": "2026-02-17T10:43:55.320Z"  ← Updated on login
  }
}
```

---

## 📝 Dependencies & Stack

### Authentication Stack

```
Zod (Validate input)
  ↓
Controller (HTTP handler)
  ↓
Service (Check duplicates, hash password)
  ↓ imports
  - bcrypt: Hash/compare passwords
  - jsonwebtoken: Create JWT tokens
  ↓
Model (Database insert)
  ↓
MongoDB (Store user document)
```

### Validation Rules (Zod)

```javascript
registerUserSchema = z.object({
    roleId: z.number().min(1).max(100), // User role
    firstName: z.string().min(2), // First name
    lastName: z.string().min(2), // Last name
    username: z.string().regex(/^[a-zA-Z0-9_]+$/), // Alphanumeric + underscore
    email: z.string().email(), // Valid email
    mobile: z.string().regex(/^\+?[1-9]\d{1,14}$/), // E.164 format
    password: z
        .string()
        .min(8) // At least 8 chars
        .regex(/[A-Z]/, "uppercase") // Contains uppercase
        .regex(/[0-9]/, "number") // Contains number
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "special char"), // Contains special char
    middleName: z.string().optional(),
    intro: z.string().max(500).optional(),
    profile: z.string().max(2000).optional(),
});
```

---

## 🎯 Key Concepts

### 1. User Registration Creates Database Entry

```
Registration ≠ Just validation
Registration = Validation + Create in DB + Store all fields
```

### 2. Password Never Stored Plain Text

```
User's password: "SecurePass@123"
  ↓ bcrypt hashing
Stored as: "$2b$10$KIXz5X8W5YqYqYqYqYqYqYu8W5YqYqYqYqYqYqYqYqYqYqYqYqYqYq"

On login:
  bcrypt.compare("SecurePass@123", "$2b$10$...")  → true
```

### 3. All User Fields Stored in DB

```javascript
// 12 fields total, all stored:
1. roleId
2. firstName
3. middleName (optional)
4. lastName
5. username (UNIQUE)
6. email (UNIQUE)
7. mobile
8. passwordHash
9. registeredAt
10. lastLogin
11. intro (optional)
12. profile (optional)
```

### 4. Single Route Handles Auth + User Management

```
Before: 2 separate routes (/api/auth, /api/users)
After: 1 unified route (/api/users)

Same endpoint handles:
- User registration (creating new users)
- User login (authentication)
- User profile management
- User CRUD operations
```

---

## 💾 Database View

```
Database: crud_express

Collections:
├── users          ← Stores user accounts (12 fields)
├── tasks
├── activities
├── comments
├── tags
├── task_meta
└── task_tags

users collection example:
{
  "_id": ObjectId("65d1f85e8c9b4a1d2e3f4a01"),
  "roleId": 1,
  "firstName": "Jane",
  "lastName": "Smith",
  "username": "janesmith",      ← UNIQUE INDEX
  "email": "jane@example.com",  ← UNIQUE INDEX
  "mobile": "+1234567890",
  "passwordHash": "$2b$10$...",
  "registeredAt": ISODate("2026-02-17T10:43:30.347Z"),
  "lastLogin": ISODate("2026-02-17T10:43:55.320Z"),
  "intro": "Full Stack Developer",
  "profile": "10 years experience"
}
```

---

## ✨ Benefits Summary

| Aspect            | Before                                                  | After                 |
| ----------------- | ------------------------------------------------------- | --------------------- |
| Routes            | `/api/auth/register`, `/api/users/register` (duplicate) | `/api/users/register` |
| Files             | auth.routes.js, user.routes.js                          | user.routes.js        |
| Controllers       | 2 files                                                 | 1 file                |
| Logic Duplication | ❌ High                                                 | ✅ None               |
| Logging           | ❌ Missing                                              | ✅ Complete           |
| Error Handling    | ❌ Basic                                                | ✅ Comprehensive      |
| Maintenance       | ❌ Hard                                                 | ✅ Easy               |

---

**Status:** ✅ Ready for Production
**Tested:** ✅ All endpoints working
**Date:** February 17, 2026
**Port:** 3000
