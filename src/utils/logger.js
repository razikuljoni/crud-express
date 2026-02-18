import fs from "fs";
import path from "path";
import winston from "winston";

const { combine, timestamp, errors, json, colorize, printf, splat, metadata } = winston.format;

const isProd = process.env.NODE_ENV === "production";

// Ensure logs directory exists
const logsDir = path.resolve(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

winston.addColors({
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
});

const devFormat = printf(
    ({ level, message, timestamp, stack, statusCode, method, url, metadata }) => {
        const meta = metadata && Object.keys(metadata).length ? ` ${JSON.stringify(metadata)}` : "";
        const status = statusCode ? ` ${statusCode}` : "";
        const req = method && url ? ` ${method} ${url}` : "";
        return `${timestamp} ${level}:${status}${req} ${stack || message}${meta}`;
    },
);

const fileFormat = combine(
    timestamp(),
    errors({ stack: true }),
    splat(),
    metadata({
        fillExcept: [
            "message",
            "level",
            "timestamp",
            "label",
            "stack",
            "statusCode",
            "method",
            "url",
        ],
    }),
    json(),
);

const logger = winston.createLogger({
    levels,
    level: isProd ? "info" : "debug",
    format: fileFormat,
    transports: [
        new winston.transports.Console({
            format: combine(
                timestamp(),
                errors({ stack: true }),
                splat(),
                metadata({
                    fillExcept: [
                        "message",
                        "level",
                        "timestamp",
                        "label",
                        "stack",
                        "statusCode",
                        "method",
                        "url",
                    ],
                }),
                colorize({ level: true }), // Only colorize the level
                devFormat,
            ),
        }),
        // All logs (no colors)
        new winston.transports.File({
            filename: path.join(logsDir, "app.log"),
            format: fileFormat,
        }),
        // Error logs only (no colors)
        new winston.transports.File({
            filename: path.join(logsDir, "error.log"),
            level: "error",
            format: fileFormat,
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(logsDir, "exceptions.log"),
            format: fileFormat,
        }),
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: path.join(logsDir, "rejections.log"),
            format: fileFormat,
        }),
    ],
});

export default logger;
