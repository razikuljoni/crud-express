// connect mongodb with native driver connection
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
        console.log("✓ Connected to MongoDB");
        return dbClient;
    } catch (err) {
        console.error("✗ MongoDB connection error:", err.message);
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
        console.log("✓ MongoDB connection closed");
    }
};
