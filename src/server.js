import app from "./app.js";
import { closeDbConnection, connectDb } from "./config/db.js";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://admin:changeme123@localhost:27017/";

let server;

const bootstrap = async () => {
    try {
        await connectDb(MONGODB_URI);

        server = app.listen(PORT, () => {
            console.log(`✓ Server running on port ${PORT}`);
        });

        server.on("error", (error) => {
            if (error.code === "EADDRINUSE") {
                console.error(`✗ Port ${PORT} is already in use`);
                process.exit(1);
            }
            throw error;
        });
    } catch (err) {
        console.error("✗ Startup failed:", err.message);
        process.exit(1);
    }
};

// Handle graceful shutdown
const shutdown = async () => {
    console.log("\n⏹ Shutting down...");

    if (server) {
        server.close(async () => {
            await closeDbConnection();
            console.log("✓ Shutdown complete");
            process.exit(0);
        });

        // Force exit after 3 seconds
        setTimeout(() => {
            console.warn("⚠ Force exiting...");
            process.exit(0);
        }, 3000);
    }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

bootstrap();
