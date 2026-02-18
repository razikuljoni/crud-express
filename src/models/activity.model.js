// Activity model - Database operations only (validation handled by Zod)
import { getDb } from "#config/db.js";
import logger from "#utils/logger.js";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "activities";

// Indexes for performance
export const activityIndexes = [
    { key: { userId: 1 }, name: "userId_index" },
    { key: { taskId: 1 }, name: "taskId_index" },
    { key: { createdBy: 1 }, name: "createdBy_index" },
    { key: { status: 1 }, name: "status_index" },
    { key: { createdAt: -1 }, name: "createdAt_index" },
    { key: { taskId: 1, createdAt: -1 }, name: "taskId_createdAt_index" },
];

// Initialize collection with indexes
export const initializeActivityCollection = async () => {
    const db = getDb();

    try {
        const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray();

        if (collections.length === 0) {
            await db.createCollection(COLLECTION_NAME);
            logger.info(`Collection '${COLLECTION_NAME}' created`);
        }

        await db.collection(COLLECTION_NAME).createIndexes(activityIndexes);
        logger.info(`Indexes created for '${COLLECTION_NAME}'`);
    } catch (error) {
        logger.error(`Error initializing collection '${COLLECTION_NAME}'`, {
            error: error.message,
            stack: error.stack,
        });
        throw error;
    }
};

// Database operations
export const createActivity = async (activityData) => {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne(activityData);
    return result;
};

export const findActivityById = async (activityId) => {
    const db = getDb();
    const objectId = ObjectId.isValid(activityId) ? new ObjectId(activityId) : activityId;
    return await db.collection(COLLECTION_NAME).findOne({ _id: objectId });
};

export const findActivitiesByTaskId = async (taskId, options = {}) => {
    const db = getDb();
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    const taskObjId = ObjectId.isValid(taskId) ? new ObjectId(taskId) : taskId;

    return await db
        .collection(COLLECTION_NAME)
        .find({ taskId: taskObjId })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray();
};

export const findActivitiesByUserId = async (userId, options = {}) => {
    const db = getDb();
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    const userObjId = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;

    return await db
        .collection(COLLECTION_NAME)
        .find({ userId: userObjId })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray();
};

export const findAllActivities = async (filter = {}, options = {}) => {
    const db = getDb();
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;

    return await db
        .collection(COLLECTION_NAME)
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray();
};

export const updateActivityById = async (activityId, updateData) => {
    const db = getDb();
    const objectId = ObjectId.isValid(activityId) ? new ObjectId(activityId) : activityId;
    const result = await db
        .collection(COLLECTION_NAME)
        .updateOne({ _id: objectId }, { $set: updateData });
    return result;
};

export const deleteActivityById = async (activityId) => {
    const db = getDb();
    const objectId = ObjectId.isValid(activityId) ? new ObjectId(activityId) : activityId;
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: objectId });
    return result;
};

export const countActivities = async (filter = {}) => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME).countDocuments(filter);
};

export const findActivitiesByStatus = async (status, options = {}) => {
    const db = getDb();
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;

    return await db
        .collection(COLLECTION_NAME)
        .find({ status })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray();
};
