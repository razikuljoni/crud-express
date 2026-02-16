import authRoutes from "#routes/auth.routes.js";
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

// HTTP request logging
app.use(
    morgan("combined", {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
    }),
);

// Routes
app.get("/", (req, res) => {
    res.json({
        statusCode: 200,
        status: "ok",
        message: "Server is Running 🆗",
    });
});

// API Routes
app.use("/api/auth", authRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Error Handler
app.use((err, req, res, next) => {
    logger.error(err);
    res.status(err.status || 500).json({ error: err.message });
});

export default app;
