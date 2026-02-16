import logger from "#utils/logger.js";
import app from "./app.js";
import { closeDbConnection, connectDb } from "./config/db.js";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://admin:changeme123@localhost:27017/";

let server;

const bootstrap = async () => {
    try {
        await connectDb(MONGODB_URI);

        server = app.listen(PORT, () => {
            logger.info(`✓ Server running on port ${PORT}`);
        });

        server.on("error", (error) => {
            if (error.code === "EADDRINUSE") {
                logger.error(`✗ Port ${PORT} is already in use`);
                process.exit(1);
            }
            throw error;
        });
    } catch (err) {
        logger.error(`✗ Startup failed: ${err.message}`);
        process.exit(1);
    }
};

// Handle graceful shutdown
const shutdown = async () => {
    logger.info("\n⏹ Shutting down...");

    if (server) {
        server.close(async () => {
            await closeDbConnection();
            logger.info("✓ Shutdown complete");
            process.exit(0);
        });

        setTimeout(() => {
            logger.warn("⚠ Force exiting...");
            process.exit(0);
        }, 3000);
    }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception", err);
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Rejection", reason);
    process.exit(1);
});

bootstrap();
