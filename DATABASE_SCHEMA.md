# Database Schema Design

## 📊 Entity Relationship Diagram

```
┌──────────────────────────────────────┐
│            USERS                     │
├──────────────────────────────────────┤
│ _id (PK)          ObjectId           │
│ roleId            Number             │
│ firstName         String(50)         │
│ middleName        String(50)         │
│ lastName          String(50)         │
│ username          String(50) UNIQUE  │
│ mobile            String(15)         │
│ email             String(50) UNIQUE  │
│ passwordHash      String(255)        │
│ registeredAt      Date               │
│ lastLogin         Date               │
│ intro             Text               │
│ profile           Text               │
└──────────────────────────────────────┘
       │                    │
       │                    │
       │ creates            │ owns
       │                    │
       ▼                    ▼
┌──────────────────────────────────────┐
│            TASKS                     │
├──────────────────────────────────────┤
│ _id (PK)          ObjectId           │
│ userId (FK)       ObjectId           │
│ createdBy (FK)    ObjectId           │
│ updatedBy (FK)    ObjectId           │
│ title             String(512)        │
│ description       String(2048)       │
│ status            Number             │
│ hours             Float              │
│ createdAt         Date               │
│ updatedAt         Date               │
│ plannedStartDate  Date               │
│ plannedEndDate    Date               │
│ actualStartDate   Date               │
│ actualEndDate     Date               │
│ content           Text               │
└──────────────────────────────────────┘
       │              │
       │              │
       │              └─────────────┐
       │                            │
       │ has                        │ links
       │                            │
       ▼                            ▼
┌──────────────────────────────────────┐      ┌────────────────────────┐
│         ACTIVITIES                   │      │      TASK_TAGS         │
├──────────────────────────────────────┤      ├────────────────────────┤
│ _id (PK)          ObjectId           │      │ taskId (FK)  ObjectId  │
│ userId (FK)       ObjectId           │      │ tagId (FK)   ObjectId  │
│ taskId (FK)       ObjectId           │      │ createdAt    Date      │
│ createdBy (FK)    ObjectId           │      └────────────────────────┘
│ updatedBy (FK)    ObjectId           │              │
│ title             String(512)        │              │
│ description       String(2048)       │              │ references
│ status            Number             │              │
│ hours             Float              │              ▼
│ createdAt         Date               │      ┌────────────────────────┐
│ updatedAt         Date               │      │        TAGS            │
│ plannedStartDate  Date               │      ├────────────────────────┤
│ plannedEndDate    Date               │      │ _id (PK)    ObjectId   │
│ actualStartDate   Date               │      │ title       String(75) │
│ actualEndDate     Date               │      │ slug        String(100)│
│ content           Text               │      │             UNIQUE     │
└──────────────────────────────────────┘      └────────────────────────┘
       │
       │
       │ has
       │
       ▼
┌──────────────────────────────────────┐
│          COMMENTS                    │
├──────────────────────────────────────┤
│ _id (PK)          ObjectId           │
│ taskId (FK)       ObjectId           │
│ activityId (FK)   ObjectId           │
│ title             String(100)        │
│ content           Text               │
│ createdAt         Date               │
│ updatedAt         Date               │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│         TASK_META                    │
├──────────────────────────────────────┤
│ _id (PK)          ObjectId           │
│ taskId (FK)       ObjectId           │
│ key               String(50)         │
│ content           Text               │
└──────────────────────────────────────┘
```

## 🔗 Relationships

### One-to-Many Relationships

- **User → Tasks**: A user can create multiple tasks
- **User → Activities**: A user can have multiple activities
- **Task → Activities**: A task can have multiple activities
- **Task → Comments**: A task can have multiple comments
- **Activity → Comments**: An activity can have multiple comments
- **Task → Task_Meta**: A task can have multiple metadata entries

### Many-to-Many Relationships

- **Tasks ↔ Tags**: Tasks can have multiple tags, and tags can be applied to multiple tasks (through task_tags junction table)

## 📋 Collections Overview

### 1. **users**

**Purpose**: Store user information and authentication details
**Unique Constraints**: `username`, `email`
**Indexes**: `roleId`, `mobile`

```javascript
{
  _id: ObjectId("..."),
  roleId: 1,
  firstName: "John",
  middleName: "Michael",
  lastName: "Doe",
  username: "johndoe",
  mobile: "+1234567890",
  email: "john@example.com",
  passwordHash: "$2b$10$...",
  registeredAt: ISODate("2024-02-17T10:00:00Z"),
  lastLogin: ISODate("2024-02-17T10:30:00Z"),
  intro: "Software Developer",
  profile: "Experienced developer..."
}
```

### 2. **tasks**

**Purpose**: Store task information
**Foreign Keys**: `userId`, `createdBy`, `updatedBy`
**Indexes**: `userId`, `createdBy`, `status`, `createdAt`, `updatedAt`

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  createdBy: ObjectId("..."),
  updatedBy: ObjectId("..."),
  title: "Implement user authentication",
  description: "Add JWT-based authentication",
  status: 1,
  hours: 8.5,
  createdAt: ISODate("2024-02-17T10:00:00Z"),
  updatedAt: ISODate("2024-02-17T15:00:00Z"),
  plannedStartDate: ISODate("2024-02-17T09:00:00Z"),
  plannedEndDate: ISODate("2024-02-18T17:00:00Z"),
  actualStartDate: ISODate("2024-02-17T10:00:00Z"),
  actualEndDate: null,
  content: "Detailed task content..."
}
```

### 3. **activities**

**Purpose**: Store activity logs related to tasks
**Foreign Keys**: `userId`, `taskId`, `createdBy`, `updatedBy`
**Indexes**: `userId`, `taskId`, `createdBy`, `status`, `createdAt`

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  taskId: ObjectId("..."),
  createdBy: ObjectId("..."),
  updatedBy: ObjectId("..."),
  title: "Set up authentication middleware",
  description: "Created JWT middleware",
  status: 2,
  hours: 2.5,
  createdAt: ISODate("2024-02-17T11:00:00Z"),
  updatedAt: ISODate("2024-02-17T13:30:00Z"),
  plannedStartDate: ISODate("2024-02-17T11:00:00Z"),
  plannedEndDate: ISODate("2024-02-17T13:00:00Z"),
  actualStartDate: ISODate("2024-02-17T11:00:00Z"),
  actualEndDate: ISODate("2024-02-17T13:30:00Z"),
  content: "Activity details..."
}
```

### 4. **comments**

**Purpose**: Store comments on tasks and activities
**Foreign Keys**: `taskId`, `activityId`
**Indexes**: `taskId`, `activityId`, `createdAt`

```javascript
{
  _id: ObjectId("..."),
  taskId: ObjectId("..."),
  activityId: ObjectId("..."),
  title: "Status Update",
  content: "Authentication is working well...",
  createdAt: ISODate("2024-02-17T14:00:00Z"),
  updatedAt: ISODate("2024-02-17T14:00:00Z")
}
```

### 5. **tags**

**Purpose**: Store tags for categorizing tasks
**Unique Constraints**: `slug`
**Indexes**: `title`

```javascript
{
  _id: ObjectId("..."),
  title: "Backend Development",
  slug: "backend-development"
}
```

### 6. **task_meta**

**Purpose**: Store custom metadata for tasks
**Foreign Keys**: `taskId`
**Indexes**: `taskId`, `taskId + key`

```javascript
{
  _id: ObjectId("..."),
  taskId: ObjectId("..."),
  key: "priority",
  content: "high"
}
```

### 7. **task_tags** (Junction Table)

**Purpose**: Link tasks with tags (many-to-many)
**Foreign Keys**: `taskId`, `tagId`
**Unique Constraints**: `taskId + tagId`
**Indexes**: `taskId`, `tagId`

```javascript
{
  taskId: ObjectId("..."),
  tagId: ObjectId("..."),
  createdAt: ISODate("2024-02-17T10:00:00Z")
}
```

## 🔑 Index Strategy

### Performance Indexes

- **users**: `roleId`, `mobile` (for faster filtering)
- **tasks**: `userId`, `createdBy`, `status`, `createdAt`, `updatedAt` (for queries)
- **activities**: `userId`, `taskId`, `createdBy`, `status`, `createdAt` (for filtering)
- **comments**: `taskId`, `activityId`, `createdAt` (for fetching comments)
- **tags**: `title` (for searching)
- **task_meta**: `taskId`, compound `taskId + key` (for lookups)
- **task_tags**: `taskId`, `tagId` (for relationship queries)

### Uniqueness Constraints

- **users**: `username`, `email` (prevent duplicates)
- **tags**: `slug` (prevent duplicate slugs)
- **task_tags**: compound `taskId + tagId` (prevent duplicate tag assignments)

## 📦 Data Validation

All validation is handled by **Zod schemas** at the application level:

- ✅ Request validation before processing
- ✅ Type checking
- ✅ Format validation (email, mobile, etc.)
- ✅ Required field validation
- ✅ Length constraints
- ✅ Custom validation rules

**No MongoDB JSON schema validation** - keeps database layer simple and flexible.

## 🚀 Benefits of This Design

1. **Clean Separation**: Validation in application layer (Zod), data storage in database
2. **Flexibility**: Easy to modify validation rules without database migrations
3. **Performance**: Optimized indexes for common query patterns
4. **Referential Integrity**: Indexes on foreign keys for fast joins
5. **Uniqueness**: Enforced at database level where needed
6. **Scalability**: Proper indexing strategy for growth

## 💡 Usage Example

```javascript
// Create a task with tags and metadata
const task = await createTask({
    userId: new ObjectId("..."),
    createdBy: new ObjectId("..."),
    title: "Build user dashboard",
    status: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
});

// Add tags
await addMultipleTagsToTask(task.insertedId, [tagId1, tagId2]);

// Add metadata
await createTaskMeta({
    taskId: task.insertedId,
    key: "priority",
    content: "high",
});

// Create activity
await createActivity({
    userId: new ObjectId("..."),
    taskId: task.insertedId,
    createdBy: new ObjectId("..."),
    title: "Initial setup",
    status: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
});
```

---

**All models are created and initialized automatically when the server starts!**
