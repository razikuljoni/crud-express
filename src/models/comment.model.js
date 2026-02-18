// Comment model - Database operations only (validation handled by Zod)
import { getDb } from "#config/db.js";
import logger from "#utils/logger.js";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "comments";

// Indexes for performance
export const commentIndexes = [
    { key: { taskId: 1 }, name: "taskId_index" },
    { key: { activityId: 1 }, name: "activityId_index" },
    { key: { createdAt: -1 }, name: "createdAt_index" },
    { key: { taskId: 1, createdAt: -1 }, name: "taskId_createdAt_index" },
    { key: { activityId: 1, createdAt: -1 }, name: "activityId_createdAt_index" },
];

// Initialize collection with indexes
export const initializeCommentCollection = async () => {
    const db = getDb();

    try {
        const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray();

        if (collections.length === 0) {
            await db.createCollection(COLLECTION_NAME);
            logger.info(`Collection '${COLLECTION_NAME}' created`);
        }

        await db.collection(COLLECTION_NAME).createIndexes(commentIndexes);
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
export const createComment = async (commentData) => {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne(commentData);
    return result;
};

export const findCommentById = async (commentId) => {
    const db = getDb();
    const objectId = ObjectId.isValid(commentId) ? new ObjectId(commentId) : commentId;
    return await db.collection(COLLECTION_NAME).findOne({ _id: objectId });
};

export const findCommentsByTaskId = async (taskId, options = {}) => {
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

export const findCommentsByActivityId = async (activityId, options = {}) => {
    const db = getDb();
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    const activityObjId = ObjectId.isValid(activityId) ? new ObjectId(activityId) : activityId;

    return await db
        .collection(COLLECTION_NAME)
        .find({ activityId: activityObjId })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray();
};

export const findAllComments = async (filter = {}, options = {}) => {
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

export const updateCommentById = async (commentId, updateData) => {
    const db = getDb();
    const objectId = ObjectId.isValid(commentId) ? new ObjectId(commentId) : commentId;
    const result = await db
        .collection(COLLECTION_NAME)
        .updateOne({ _id: objectId }, { $set: updateData });
    return result;
};

export const deleteCommentById = async (commentId) => {
    const db = getDb();
    const objectId = ObjectId.isValid(commentId) ? new ObjectId(commentId) : commentId;
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: objectId });
    return result;
};

export const countComments = async (filter = {}) => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME).countDocuments(filter);
};
