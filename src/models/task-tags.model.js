// Task Tags (Junction Table) model - Database operations only (validation handled by Zod)
import { getDb } from "#config/db.js";
import logger from "#utils/logger.js";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "task_tags";

// Indexes for performance and uniqueness
export const taskTagsIndexes = [
    { key: { taskId: 1, tagId: 1 }, unique: true, name: "taskId_tagId_unique" },
    { key: { taskId: 1 }, name: "taskId_index" },
    { key: { tagId: 1 }, name: "tagId_index" },
];

// Initialize collection with indexes
export const initializeTaskTagsCollection = async () => {
    const db = getDb();

    try {
        const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray();

        if (collections.length === 0) {
            await db.createCollection(COLLECTION_NAME);
            logger.info(`Collection '${COLLECTION_NAME}' created`);
        }

        await db.collection(COLLECTION_NAME).createIndexes(taskTagsIndexes);
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
export const addTagToTask = async (taskId, tagId) => {
    const db = getDb();
    const taskObjId = ObjectId.isValid(taskId) ? new ObjectId(taskId) : taskId;
    const tagObjId = ObjectId.isValid(tagId) ? new ObjectId(tagId) : tagId;

    const result = await db.collection(COLLECTION_NAME).insertOne({
        taskId: taskObjId,
        tagId: tagObjId,
        createdAt: new Date(),
    });
    return result;
};

export const addMultipleTagsToTask = async (taskId, tagIds) => {
    const db = getDb();
    const taskObjId = ObjectId.isValid(taskId) ? new ObjectId(taskId) : taskId;

    const documents = tagIds.map((tagId) => ({
        taskId: taskObjId,
        tagId: ObjectId.isValid(tagId) ? new ObjectId(tagId) : tagId,
        createdAt: new Date(),
    }));

    const result = await db.collection(COLLECTION_NAME).insertMany(documents, { ordered: false });
    return result;
};

export const removeTagFromTask = async (taskId, tagId) => {
    const db = getDb();
    const taskObjId = ObjectId.isValid(taskId) ? new ObjectId(taskId) : taskId;
    const tagObjId = ObjectId.isValid(tagId) ? new ObjectId(tagId) : tagId;

    const result = await db.collection(COLLECTION_NAME).deleteOne({
        taskId: taskObjId,
        tagId: tagObjId,
    });
    return result;
};

export const removeAllTagsFromTask = async (taskId) => {
    const db = getDb();
    const taskObjId = ObjectId.isValid(taskId) ? new ObjectId(taskId) : taskId;

    const result = await db.collection(COLLECTION_NAME).deleteMany({ taskId: taskObjId });
    return result;
};

export const findTagsByTaskId = async (taskId) => {
    const db = getDb();
    const taskObjId = ObjectId.isValid(taskId) ? new ObjectId(taskId) : taskId;

    return await db.collection(COLLECTION_NAME).find({ taskId: taskObjId }).toArray();
};

export const findTasksByTagId = async (tagId, options = {}) => {
    const db = getDb();
    const { skip = 0, limit = 10 } = options;
    const tagObjId = ObjectId.isValid(tagId) ? new ObjectId(tagId) : tagId;

    return await db
        .collection(COLLECTION_NAME)
        .find({ tagId: tagObjId })
        .skip(skip)
        .limit(limit)
        .toArray();
};

export const updateTaskTags = async (taskId, tagIds) => {
    // Remove all existing tags
    await removeAllTagsFromTask(taskId);

    // Add new tags
    if (tagIds && tagIds.length > 0) {
        await addMultipleTagsToTask(taskId, tagIds);
    }
};

export const countTasksByTagId = async (tagId) => {
    const db = getDb();
    const tagObjId = ObjectId.isValid(tagId) ? new ObjectId(tagId) : tagId;
    return await db.collection(COLLECTION_NAME).countDocuments({ tagId: tagObjId });
};

export const checkTagExistsForTask = async (taskId, tagId) => {
    const db = getDb();
    const taskObjId = ObjectId.isValid(taskId) ? new ObjectId(taskId) : taskId;
    const tagObjId = ObjectId.isValid(tagId) ? new ObjectId(tagId) : tagId;

    const result = await db.collection(COLLECTION_NAME).findOne({
        taskId: taskObjId,
        tagId: tagObjId,
    });

    return result !== null;
};
