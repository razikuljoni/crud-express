import authRoutes from "#routes/auth.routes.js";
import userRoutes from "#routes/user.routes.js";
import logger from "#utils/logger.js";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// HTTP request logging with proper log levels
app.use(
    morgan("combined", {
        stream: {
            write: (message) => {
                const msg = message.trim();
                // Log based on HTTP status code
                if (msg.includes(" 5")) {
                    logger.error(msg);
                } else if (msg.includes(" 4")) {
                    logger.warn(msg);
                } else {
                    logger.http(msg);
                }
            },
        },
    }),
);

// Routes
app.get("/", (_req, res) => {
    res.json({
        statusCode: 200,
        status: "ok",
        message: "Server is Running 🆗",
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// 404 Handler
app.use((req, res) => {
    logger.warn("Route not found", {
        statusCode: 404,
        method: req.method,
        url: req.url,
    });
    res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Route not found",
    });
});

// Error Handler
app.use((err, req, res, _next) => {
    logger.error("Unhandled error", {
        statusCode: err.status || 500,
        method: req.method,
        url: req.url,
        error: err.message,
        stack: err.stack,
    });

    res.status(err.status || 500).json({
        statusCode: err.status || 500,
        status: "error",
        message: err.message || "Internal server error",
    });
});

export default app;
