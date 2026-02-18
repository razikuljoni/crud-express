// Task Meta model - Database operations only (validation handled by Zod)
import { getDb } from "#config/db.js";
import logger from "#utils/logger.js";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "task_meta";

// Indexes for performance
export const taskMetaIndexes = [
    { key: { taskId: 1 }, name: "taskId_index" },
    { key: { taskId: 1, key: 1 }, name: "taskId_key_index" },
];

// Initialize collection with indexes
export const initializeTaskMetaCollection = async () => {
    const db = getDb();

    try {
        const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray();

        if (collections.length === 0) {
            await db.createCollection(COLLECTION_NAME);
            logger.info(`Collection '${COLLECTION_NAME}' created`);
        }

        await db.collection(COLLECTION_NAME).createIndexes(taskMetaIndexes);
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
export const createTaskMeta = async (metaData) => {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne(metaData);
    return result;
};

export const findTaskMetaById = async (metaId) => {
    const db = getDb();
    const objectId = ObjectId.isValid(metaId) ? new ObjectId(metaId) : metaId;
    return await db.collection(COLLECTION_NAME).findOne({ _id: objectId });
};

export const findTaskMetaByTaskId = async (taskId) => {
    const db = getDb();
    const taskObjId = ObjectId.isValid(taskId) ? new ObjectId(taskId) : taskId;
    return await db.collection(COLLECTION_NAME).find({ taskId: taskObjId }).toArray();
};

export const findTaskMetaByTaskIdAndKey = async (taskId, key) => {
    const db = getDb();
    const taskObjId = ObjectId.isValid(taskId) ? new ObjectId(taskId) : taskId;
    return await db.collection(COLLECTION_NAME).findOne({ taskId: taskObjId, key });
};

export const updateTaskMetaById = async (metaId, updateData) => {
    const db = getDb();
    const objectId = ObjectId.isValid(metaId) ? new ObjectId(metaId) : metaId;
    const result = await db
        .collection(COLLECTION_NAME)
        .updateOne({ _id: objectId }, { $set: updateData });
    return result;
};

export const deleteTaskMetaById = async (metaId) => {
    const db = getDb();
    const objectId = ObjectId.isValid(metaId) ? new ObjectId(metaId) : metaId;
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: objectId });
    return result;
};

export const deleteTaskMetaByTaskId = async (taskId) => {
    const db = getDb();
    const taskObjId = ObjectId.isValid(taskId) ? new ObjectId(taskId) : taskId;
    const result = await db.collection(COLLECTION_NAME).deleteMany({ taskId: taskObjId });
    return result;
};

export const upsertTaskMeta = async (taskId, key, content) => {
    const db = getDb();
    const taskObjId = ObjectId.isValid(taskId) ? new ObjectId(taskId) : taskId;
    const result = await db
        .collection(COLLECTION_NAME)
        .updateOne(
            { taskId: taskObjId, key },
            { $set: { content, updatedAt: new Date() } },
            { upsert: true },
        );
    return result;
};
