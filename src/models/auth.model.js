// User model - Database operations only
import { getDb } from "../config/db.js";

const COLLECTION_NAME = "users";

export const createUser = async (userData) => {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne(userData);
    return result;
};

export const findUserByUsername = async (username) => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME).findOne({ username });
};

export const findUserById = async (userId) => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME).findOne({ _id: userId });
};
