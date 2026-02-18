# Dummy Data for MongoDB Collections

This folder contains realistic dummy data for all 7 collections in JSON format, ready to import into MongoDB.

## 📦 Collections

1. **users.json** - 5 users with different roles
2. **tags.json** - 12 common tags for categorization
3. **tasks.json** - 8 tasks with various statuses
4. **activities.json** - 10 activities linked to tasks
5. **comments.json** - 12 comments on tasks and activities
6. **task_meta.json** - 25 metadata entries for tasks
7. **task_tags.json** - 21 task-tag relationships

## 🔗 Relationships

All data is linked with proper ObjectIds:

- **Tasks** reference users (userId, createdBy, updatedBy)
- **Activities** reference users and tasks
- **Comments** reference tasks and activities
- **Task Meta** references tasks
- **Task Tags** creates many-to-many relationship between tasks and tags

## 📊 Data Overview

### Users (5 records)

- John Doe - Full Stack Developer (roleId: 1)
- Sarah Johnson - UI/UX Designer (roleId: 2)
- Michael Chen - Backend Developer (roleId: 1)
- Emily Martinez - Project Manager (roleId: 3)
- David Wilson - DevOps Engineer (roleId: 2)

### Tasks (8 records)

- Status 0 (Not Started): 3 tasks
- Status 1 (In Progress): 3 tasks
- Status 2 (Completed): 2 tasks

### Tags (12 records)

Backend Development, Frontend Development, UI/UX Design, Database, API Development, Authentication, DevOps, Testing, Documentation, Bug Fix, Feature, Performance

### Activities (10 records)

Linked to tasks showing progress and work done

### Comments (12 records)

Team discussions on tasks and activities

### Task Meta (25 records)

Custom metadata like priority, complexity, sprint assignments

### Task Tags (21 records)

Many-to-many relationships between tasks and tags

## 🚀 How to Import

### Method 1: Using mongoimport (Recommended)

```bash
# Import all collections at once
mongoimport --db crud_express --collection users --file dummy-data/users.json --jsonArray
mongoimport --db crud_express --collection tags --file dummy-data/tags.json --jsonArray
mongoimport --db crud_express --collection tasks --file dummy-data/tasks.json --jsonArray
mongoimport --db crud_express --collection activities --file dummy-data/activities.json --jsonArray
mongoimport --db crud_express --collection comments --file dummy-data/comments.json --jsonArray
mongoimport --db crud_express --collection task_meta --file dummy-data/task_meta.json --jsonArray
mongoimport --db crud_express --collection task_tags --file dummy-data/task_tags.json --jsonArray
```

### Method 2: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database
3. Select the `crud_express` database
4. For each collection:
    - Click "Add Data" → "Import JSON or CSV file"
    - Select the corresponding JSON file
    - Click "Import"

### Method 3: Using MongoDB Shell

```bash
# Connect to MongoDB
mongosh

# Switch to database
use crud_express

# Import users
db.users.insertMany(<paste users.json content>)

# Import tags
db.tags.insertMany(<paste tags.json content>)

# Import tasks
db.tasks.insertMany(<paste tasks.json content>)

# Import activities
db.activities.insertMany(<paste activities.json content>)

# Import comments
db.comments.insertMany(<paste comments.json content>)

# Import task_meta
db.task_meta.insertMany(<paste task_meta.json content>)

# Import task_tags
db.task_tags.insertMany(<paste task_tags.json content>)
```

### Method 4: Using Node.js Script

Create a file `import-dummy-data.js`:

```javascript
import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

const MONGODB_URI = "mongodb://localhost:27017";
const DB_NAME = "crud_express";

const collections = ["users", "tags", "tasks", "activities", "comments", "task_meta", "task_tags"];

async function importData() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);

        for (const collection of collections) {
            const filePath = path.join("dummy-data", `${collection}.json`);
            const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

            // Convert string dates to Date objects
            const processedData = JSON.parse(
                JSON.stringify(data, (key, value) => {
                    if (value && typeof value === "object" && value.$date) {
                        return new Date(value.$date);
                    }
                    if (value && typeof value === "object" && value.$oid) {
                        return { $oid: value.$oid };
                    }
                    return value;
                }),
            );

            await db.collection(collection).insertMany(processedData);
            console.log(`✓ Imported ${data.length} records into ${collection}`);
        }

        console.log("✓ All data imported successfully!");
    } catch (error) {
        console.error("Error importing data:", error);
    } finally {
        await client.close();
    }
}

importData();
```

Run it:

```bash
node import-dummy-data.js
```

## 🔍 Verify Import

After importing, verify the data:

```javascript
// In mongosh
use crud_express

// Check counts
db.users.countDocuments()        // Should be 5
db.tags.countDocuments()          // Should be 12
db.tasks.countDocuments()         // Should be 8
db.activities.countDocuments()    // Should be 10
db.comments.countDocuments()      // Should be 12
db.task_meta.countDocuments()     // Should be 25
db.task_tags.countDocuments()     // Should be 21

// Check a sample record
db.users.findOne()
db.tasks.findOne()
```

## 📝 Notes

- All passwords are hashed with bcrypt (though these are dummy hashes)
- ObjectIds are consistent across files to maintain relationships
- Dates are in ISO format for easy import
- All data follows the schema defined in the models

## 🎯 Use Cases

This dummy data is perfect for:

- Development and testing
- Demo presentations
- UI/UX testing with realistic data
- Performance testing with meaningful relationships
- Learning the database structure

## 🧹 Clear Data

To remove all dummy data and start fresh:

```javascript
// In mongosh
use crud_express

db.users.deleteMany({})
db.tags.deleteMany({})
db.tasks.deleteMany({})
db.activities.deleteMany({})
db.comments.deleteMany({})
db.task_meta.deleteMany({})
db.task_tags.deleteMany({})
```

---

**All data is ready to import! No modifications needed.** 🎉
