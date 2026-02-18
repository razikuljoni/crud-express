// User model - Database operations only (validation handled by Zod)
import { getDb } from "#config/db.js";
import logger from "#utils/logger.js";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "users";

// Indexes for performance and uniqueness constraints
export const userIndexes = [
    { key: { username: 1 }, unique: true, name: "username_unique" },
    { key: { email: 1 }, unique: true, name: "email_unique" },
    { key: { mobile: 1 }, name: "mobile_index" },
    { key: { roleId: 1 }, name: "roleId_index" },
];

// Initialize collection with indexes only (validation handled by Zod)
export const initializeUserCollection = async () => {
    const db = getDb();

    try {
        // Create collection if it doesn't exist
        const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray();

        if (collections.length === 0) {
            await db.createCollection(COLLECTION_NAME);
            logger.info(`Collection '${COLLECTION_NAME}' created`);
        }

        // Create indexes for performance and uniqueness
        await db.collection(COLLECTION_NAME).createIndexes(userIndexes);
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
export const createUser = async (userData) => {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne(userData);
    return result;
};

export const findUserByUsername = async (username) => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME).findOne({ username });
};

export const findUserByEmail = async (email) => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME).findOne({ email });
};

export const findUserById = async (userId) => {
    const db = getDb();
    const objectId = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
    return await db.collection(COLLECTION_NAME).findOne({ _id: objectId });
};

export const updateUserById = async (userId, updateData) => {
    const db = getDb();
    const objectId = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
    const result = await db
        .collection(COLLECTION_NAME)
        .updateOne({ _id: objectId }, { $set: updateData });
    return result;
};

export const updateLastLogin = async (userId) => {
    const db = getDb();
    const objectId = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
    await db
        .collection(COLLECTION_NAME)
        .updateOne({ _id: objectId }, { $set: { lastLogin: new Date() } });
};

export const findAllUsers = async (filter = {}, options = {}) => {
    const db = getDb();
    const { skip = 0, limit = 10, sort = { registeredAt: -1 } } = options;

    return await db
        .collection(COLLECTION_NAME)
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray();
};

export const countUsers = async (filter = {}) => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME).countDocuments(filter);
};

export const deleteUserById = async (userId) => {
    const db = getDb();
    const objectId = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: objectId });
    return result;
};
