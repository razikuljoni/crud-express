import fs from "fs";
import path from "path";
import winston from "winston";

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const isProd = process.env.NODE_ENV === "production";

// Ensure logs directory exists
const logsDir = path.resolve(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const devFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const logger = winston.createLogger({
    level: isProd ? "info" : "debug",
    format: combine(timestamp(), errors({ stack: true }), isProd ? json() : devFormat),
    transports: [
        new winston.transports.Console({
            format: combine(colorize(), timestamp(), errors({ stack: true }), devFormat),
        }),
        // All logs
        new winston.transports.File({
            filename: path.join(logsDir, "app.log"),
        }),
        // Error logs only
        new winston.transports.File({
            filename: path.join(logsDir, "error.log"),
            level: "error",
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(logsDir, "exceptions.log"),
        }),
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: path.join(logsDir, "rejections.log"),
        }),
    ],
});

export default logger;
