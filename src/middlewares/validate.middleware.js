// Zod validation middleware
import logger from "#utils/logger.js";

export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            // Validate request against schema
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            next();
        } catch (error) {
            // Handle Zod validation errors
            if (error.errors) {
                const errors = error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));

                logger.warn("Validation failed", {
                    method: req.method,
                    url: req.url,
                    errors,
                });

                return res.status(400).json({
                    statusCode: 400,
                    status: "error",
                    message: "Validation failed",
                    errors,
                });
            }

            logger.error("Validation error", { error: error.message });
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Invalid request data",
            });
        }
    };
};
