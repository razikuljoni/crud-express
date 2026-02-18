// User controller - HTTP request/response handling
import * as userService from "#services/user.service.js";
import logger from "#utils/logger.js";

// Register new user
export const register = async (req, res) => {
    try {
        const result = await userService.registerUser(req.body);

        logger.info("User registration successful", {
            statusCode: 201,
            method: req.method,
            url: req.url,
        });

        res.status(201).json({
            statusCode: 201,
            status: "success",
            message: "User registered successfully",
            data: result,
        });
    } catch (error) {
        if (
            error.message === "Username already exists" ||
            error.message === "Email already exists"
        ) {
            logger.warn("Registration failed - duplicate entry", {
                statusCode: 409,
                method: req.method,
                url: req.url,
                error: error.message,
            });

            return res.status(409).json({
                statusCode: 409,
                status: "error",
                message: error.message,
            });
        }

        logger.error("Error during registration", {
            statusCode: 500,
            method: req.method,
            url: req.url,
            error: error.message,
            stack: error.stack,
        });

        res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal server error",
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        const result = await userService.loginUser(usernameOrEmail, password);

        logger.info("User login successful", {
            statusCode: 200,
            method: req.method,
            url: req.url,
        });

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        if (error.message === "Invalid credentials") {
            logger.warn("Login failed - invalid credentials", {
                statusCode: 401,
                method: req.method,
                url: req.url,
            });

            return res.status(401).json({
                statusCode: 401,
                status: "error",
                message: "Invalid credentials",
            });
        }

        logger.error("Error during login", {
            statusCode: 500,
            method: req.method,
            url: req.url,
            error: error.message,
            stack: error.stack,
        });

        res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal server error",
        });
    }
};

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await userService.getUserById(userId);

        logger.info("User profile retrieved", {
            statusCode: 200,
            method: req.method,
            url: req.url,
        });

        res.status(200).json({
            statusCode: 200,
            status: "success",
            data: user,
        });
    } catch (error) {
        if (error.message === "User not found") {
            logger.warn("User not found", {
                statusCode: 404,
                method: req.method,
                url: req.url,
            });

            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "User not found",
            });
        }

        logger.error("Error getting user profile", {
            statusCode: 500,
            method: req.method,
            url: req.url,
            error: error.message,
            stack: error.stack,
        });

        res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal server error",
        });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userService.getUserById(userId);

        logger.info("User retrieved by ID", {
            statusCode: 200,
            method: req.method,
            url: req.url,
        });

        res.status(200).json({
            statusCode: 200,
            status: "success",
            data: user,
        });
    } catch (error) {
        if (error.message === "User not found") {
            logger.warn("User not found", {
                statusCode: 404,
                method: req.method,
                url: req.url,
            });

            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "User not found",
            });
        }

        logger.error("Error getting user by ID", {
            statusCode: 500,
            method: req.method,
            url: req.url,
            error: error.message,
            stack: error.stack,
        });

        res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal server error",
        });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await userService.updateUser(userId, req.body);

        logger.info("User updated successfully", {
            statusCode: 200,
            method: req.method,
            url: req.url,
        });

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "User updated successfully",
            data: result,
        });
    } catch (error) {
        if (error.message === "User not found") {
            logger.warn("User not found", {
                statusCode: 404,
                method: req.method,
                url: req.url,
            });

            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "User not found",
            });
        }

        if (
            error.message === "Username already exists" ||
            error.message === "Email already exists"
        ) {
            logger.warn("Update failed - duplicate entry", {
                statusCode: 409,
                method: req.method,
                url: req.url,
                error: error.message,
            });

            return res.status(409).json({
                statusCode: 409,
                status: "error",
                message: error.message,
            });
        }

        logger.error("Error updating user", {
            statusCode: 500,
            method: req.method,
            url: req.url,
            error: error.message,
            stack: error.stack,
        });

        res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal server error",
        });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const options = {
            page: req.query.page,
            limit: req.query.limit,
            roleId: req.query.roleId,
        };

        const result = await userService.getAllUsers(options);

        logger.info("Users list retrieved", {
            statusCode: 200,
            method: req.method,
            url: req.url,
        });

        res.status(200).json({
            statusCode: 200,
            status: "success",
            data: result.users,
            pagination: result.pagination,
        });
    } catch (error) {
        logger.error("Error getting all users", {
            statusCode: 500,
            method: req.method,
            url: req.url,
            error: error.message,
            stack: error.stack,
        });

        res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal server error",
        });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await userService.deleteUser(userId);

        logger.info("User deleted successfully", {
            statusCode: 200,
            method: req.method,
            url: req.url,
        });

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: result.message,
        });
    } catch (error) {
        if (error.message === "User not found") {
            logger.warn("User not found", {
                statusCode: 404,
                method: req.method,
                url: req.url,
            });

            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "User not found",
            });
        }

        logger.error("Error deleting user", {
            statusCode: 500,
            method: req.method,
            url: req.url,
            error: error.message,
            stack: error.stack,
        });

        res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal server error",
        });
    }
};
