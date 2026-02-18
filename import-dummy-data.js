import fs from "fs";
import { MongoClient } from "mongodb";
import path from "path";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
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
                JSON.stringify(data, (_key, value) => {
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
