// connect mongodb with native driver connection
import { initializeActivityCollection } from "#models/activity.model.js";
import { initializeCommentCollection } from "#models/comment.model.js";
import { initializeTagCollection } from "#models/tag.model.js";
import { initializeTaskMetaCollection } from "#models/task-meta.model.js";
import { initializeTaskTagsCollection } from "#models/task-tags.model.js";
import { initializeTaskCollection } from "#models/task.model.js";
import { initializeUserCollection } from "#models/user.model.js";
import logger from "#utils/logger.js";
import { MongoClient } from "mongodb";

let dbClient;
const DB_NAME = process.env.DB_NAME || "crud-express";

export const connectDb = async (uri) => {
    if (dbClient) {
        return dbClient;
    }
    try {
        dbClient = new MongoClient(uri);
        await dbClient.connect();
        logger.info("✓ Connected to MongoDB", {
            database: DB_NAME,
        });

        // Initialize all collections with indexes (validation handled by Zod)
        await initializeUserCollection();
        await initializeTaskCollection();
        await initializeActivityCollection();
        await initializeCommentCollection();
        await initializeTagCollection();
        await initializeTaskMetaCollection();
        await initializeTaskTagsCollection();

        logger.info("✓ All collections initialized");

        return dbClient;
    } catch (err) {
        logger.error("✗ MongoDB connection error", {
            error: err.message,
            stack: err.stack,
        });
        throw err;
    }
};

export const getDb = () => {
    if (!dbClient) {
        throw new Error("Database client not initialized. Call connectDb first.");
    }
    return dbClient.db(DB_NAME);
};

export const closeDbConnection = async () => {
    if (dbClient) {
        await dbClient.close();
        dbClient = null;
        logger.info("✓ MongoDB connection closed");
    }
};
