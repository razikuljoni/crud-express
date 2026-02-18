import authRoutes from "#routes/auth.routes.js";
import userRoutes from "#routes/user.routes.js";
import logger from "#utils/logger.js";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

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
app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Error Handler
app.use((err, _req, res, _next) => {
    logger.error(err);
    res.status(err.status || 500).json({ error: err.message });
});

export default app;
