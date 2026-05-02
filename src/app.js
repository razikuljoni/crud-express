import { requestId } from "#middlewares/requestId.middleware.js";
import authRoutes from "#routes/auth.routes.js";
import categoryRoutes from "#routes/category.routes.js";
import orderRoutes from "#routes/order.routes.js";
import productRoutes from "#routes/product.routes.js";
import userRoutes from "#routes/user.routes.js";
import logger, { httpLogger } from "#utils/logger.js";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Assign unique ID to every request (for log correlation)
app.use(requestId);

// HTTP request logging (includes requestId automatically)
app.use(httpLogger);

// Routes
app.get("/", (_req, res) => {
    res.json({
        statusCode: 200,
        status: "ok",
        message: "Server is Running",
    });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);

// 404 Handler
app.use((req, res) => {
    logger.warn(`Route not found: ${req.method} ${req.originalUrl}`, {
        requestId: req.id,
    });
    res.status(404).json({ error: "Not found" });
});

// Global Error Handler
app.use((err, req, res, _next) => {
    logger.error(`Unhandled error: ${err.message}`, {
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        requestId: req.id,
        body: redactForLog(req.body),
        query: req.query,
    });
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    });
});

function redactForLog(obj) {
    if (!obj || typeof obj !== "object") return obj;
    const sensitive = ["password", "token", "secret", "key", "authorization", "auth"];
    const redacted = {};
    for (const [k, v] of Object.entries(obj)) {
        if (sensitive.some((s) => k.toLowerCase().includes(s))) {
            redacted[k] = "[REDACTED]";
        } else {
            redacted[k] = v;
        }
    }
    return redacted;
}

export default app;
