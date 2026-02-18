# CRUD Express API - Project Architecture

## 📁 Project Structure

```
crud-express/
├── src/
│   ├── config/          # Configuration files
│   │   └── db.js       # Database connection & helper functions
│   ├── controllers/     # HTTP request/response handlers
│   │   └── auth.controller.js
│   ├── middlewares/     # Express middlewares
│   │   └── auth.middleware.js
│   ├── models/          # Database operations (Data Access Layer)
│   │   └── auth.model.js
│   ├── routes/          # API route definitions
│   │   └── auth.routes.js
│   ├── services/        # Business logic layer
│   │   └── auth.service.js
│   ├── app.js          # Express app configuration
│   └── server.js       # Server initialization & startup
├── .env                # Environment variables
├── package.json
└── nodemon.json        # Nodemon configuration
```

## 🏗️ Architecture Layers

### 1. **Routes** (`src/routes/`)

- **Purpose**: Define API endpoints and attach controllers
- **Responsibility**: URL path definitions and HTTP method mapping
- **Example**: `POST /api/auth/register` → `authController.register`

### 2. **Controllers** (`src/controllers/`)

- **Purpose**: Handle HTTP requests and responses
- **Responsibility**:
    - Validate request data (basic validation)
    - Call appropriate service methods
    - Format and send HTTP responses
    - Handle HTTP-specific errors (400, 401, 404, etc.)
- **Should NOT**: Contain business logic or database queries

### 3. **Services** (`src/services/`)

- **Purpose**: Business logic layer
- **Responsibility**:
    - Implement core business rules
    - Orchestrate multiple model operations
    - Handle data transformation
    - Validate business rules
    - Error handling for business logic
- **Should NOT**: Handle HTTP requests/responses directly

### 4. **Models** (`src/models/`)

- **Purpose**: Data Access Layer (DAL)
- **Responsibility**:
    - Direct database operations (CRUD)
    - Query construction
    - Data retrieval and persistence
- **Should NOT**: Contain business logic or validation

### 5. **Middlewares** (`src/middlewares/`)

- **Purpose**: Request preprocessing
- **Responsibility**:
    - Authentication/Authorization
    - Request validation
    - Logging
    - Error handling

### 6. **Config** (`src/config/`)

- **Purpose**: Configuration and utilities
- **Responsibility**:
    - Database connection
    - Environment configuration
    - Constants and settings

## 📊 Data Flow

```
Request → Routes → Controllers → Services → Models → Database
                      ↓              ↓         ↓
Response ← ──────────────────────────────────┘
```

### Example: User Registration Flow

1. **Route** (`auth.routes.js`): `POST /api/auth/register` → `authController.register`
2. **Controller** (`auth.controller.js`):
    - Validates request body
    - Calls `authService.registerUser(username, password)`
    - Returns HTTP response
3. **Service** (`auth.service.js`):
    - Checks if user exists (via model)
    - Hashes password
    - Creates user (via model)
    - Returns result
4. **Model** (`auth.model.js`):
    - Executes MongoDB insert operation
    - Returns database result

## 🔐 Authentication Flow

1. **Register**: `POST /api/auth/register`

    ```json
    {
        "username": "john",
        "password": "password123"
    }
    ```

2. **Login**: `POST /api/auth/login`

    ```json
    {
        "username": "john",
        "password": "password123"
    }
    ```

    Returns JWT token

3. **Protected Routes**: Add `authenticate` middleware
    ```javascript
    router.get("/profile", authenticate, profileController);
    ```

## 🚀 Running the Project

```bash
# Install dependencies
pnpm install

# Development mode (with auto-restart)
pnpm dev

# Production mode
pnpm start
```

## 🔧 Environment Variables

Create a `.env` file:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/crud-express
JWT_SECRET=your_secret_key_here
```

## ✅ Best Practices Used

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Dependency Direction**: Controllers → Services → Models
3. **Error Handling**: Centralized error handling in controllers
4. **Security**: JWT authentication, password hashing with bcrypt
5. **Clean Code**: Descriptive names, consistent structure
6. **Environment Config**: Sensitive data in environment variables

## 📝 Adding New Features

### To add a new resource (e.g., "posts"):

1. **Model** (`src/models/post.model.js`):

    ```javascript
    export const createPost = async (postData) => { ... }
    export const findPostById = async (id) => { ... }
    ```

2. **Service** (`src/services/post.service.js`):

    ```javascript
    export const createNewPost = async (title, content, userId) => { ... }
    ```

3. **Controller** (`src/controllers/post.controller.js`):

    ```javascript
    export const createPost = async (req, res) => { ... }
    ```

4. **Routes** (`src/routes/post.routes.js`):

    ```javascript
    router.post("/", authenticate, createPost);
    ```

5. **Register routes** in `app.js`:
    ```javascript
    import postRoutes from "./routes/post.routes.js";
    app.use("/api/posts", postRoutes);
    ```
