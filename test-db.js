import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

async function testConnection() {
    try {
        console.log(`Attempting to connect to: ${uri}`);
        const client = new MongoClient(uri);
        await client.connect();

        console.log("✓ Connected successfully");

        // Test database operation
        const db = client.db("crud-express");
        const collections = await db.listCollections().toArray();

        console.log(
            `✓ Database accessible. Collections:`,
            collections.map((c) => c.name),
        );

        await client.close();
        console.log("✓ Connection closed");
    } catch (err) {
        console.error("✗ Connection failed:", err.message);
        console.error("Full error:", err);
    }
}

testConnection();
