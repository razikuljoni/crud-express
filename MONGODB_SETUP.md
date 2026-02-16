# MongoDB Setup Guide

## Issue: Authentication Required

Your MongoDB instance requires authentication. You have two options:

## Option 1: MongoDB WITHOUT Authentication (Development Only)

### For macOS (brew):

```bash
# Stop MongoDB
brew services stop mongodb-community

# Edit MongoDB config
nano /usr/local/etc/mongod.conf

# Comment out or remove these lines:
# security:
#   authorization: enabled

# Start MongoDB
brew services start mongodb-community
```

### For MongoDB installed manually:

```bash
# Find and edit mongod.conf
# Usually located at: /etc/mongod.conf or /usr/local/etc/mongod.conf

# Comment out security section:
# security:
#   authorization: "enabled"

# Restart MongoDB
sudo systemctl restart mongod  # Linux
brew services restart mongodb-community  # macOS
```

Then update `.env`:

```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=crud-express
PORT=3000
JWT_SECRET=your_secret_key_here
```

## Option 2: MongoDB WITH Authentication (Recommended for Production)

### 1. Create MongoDB user:

```javascript
// Connect to MongoDB (if you have access)
use admin
db.createUser({
  user: "admin",
  pwd: "your_password",
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
})

use crud-express
db.createUser({
  user: "crud_user",
  pwd: "secure_password",
  roles: [{ role: "readWrite", db: "crud-express" }]
})
```

### 2. Update `.env`:

```env
MONGODB_URI=mongodb://crud_user:secure_password@localhost:27017/crud-express?authSource=crud-express
DB_NAME=crud-express
PORT=3000
JWT_SECRET=your_secret_jwt_secret_key
```

## Quick Test Commands

### Test MongoDB connection:

```bash
node test-db.js
```

### Check if MongoDB is running:

```bash
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod

# Check port
lsof -i :27017
```

### Start MongoDB:

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Using MongoDB with Docker (Easiest for Development)

```bash
# Run MongoDB without authentication
docker run -d \
  -p 27017:27017 \
  --name mongodb \
  -v mongodb_data:/data/db \
  mongo:latest

# Or with authentication
docker run -d \
  -p 27017:27017 \
  --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -v mongodb_data:/data/db \
  mongo:latest
```

Then update `.env` accordingly.

## Verify Setup

After configuring MongoDB, test the API:

```bash
# Start the server
pnpm dev

# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

## Troubleshooting

### "Command requires authentication"

- MongoDB has auth enabled but you're not providing credentials
- Follow Option 1 to disable auth OR Option 2 to add credentials

### "Connection refused"

- MongoDB is not running
- Start MongoDB service

### "Network timeout"

- Check if MongoDB is listening on correct port: `lsof -i :27017`
- Check firewall settings
