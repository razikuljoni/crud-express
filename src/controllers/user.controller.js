// user controller.js - HTTP request/response handling only
import * as userService from "#services/user.service.js";

// Create User handler
export const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const result = await userService.createUser(userData);
        res.status(201).json({
            message: "User created successfully",
            user: result,
        });
    } catch (err) {
        res.status(500).json({ error: err.message || "Internal server error" });
    }
};

export const getAllUsers = async (_req, res) => {
    try {
        const users = await userService.getAllUsers();

        res.status(200).json({
            message: "Users retrieved successfully",
            status: "ok",
            data: users,
            meta: {
                total: users.length,
                page: 1,
                limit: users.length,
            },
        });
    } catch (err) {
        console.error("Get all users error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userService.getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            message: "User retrieved successfully",
            status: "ok",
            data: user,
            meta: {
                page: 1,
                limit: 1,
                total: 1,
            },
        });
    } catch (err) {
        console.error("Get user by ID error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        const updatedUser = await userService.updateUser(userId, updateData);
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            message: "User updated successfully",
            status: "ok",
            data: updatedUser,
        });
    } catch (err) {
        console.error("Update user error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deleted = await userService.deleteUser(userId);
        if (!deleted) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully", status: "ok", data: deleted });
    } catch (err) {
        console.error("Delete user error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
