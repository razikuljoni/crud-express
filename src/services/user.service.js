// userService.js - Business logic and data handling
import * as userModel from "#models/user.model.js";
import { hashPassword } from "#utils/password.util.js";

export const createUser = async (userData) => {
    try {
        const existingUser = await userModel.isUserExists(userData.username, userData.email);
        if (existingUser) {
            throw new Error("Username or email already exists");
        }

        if (!userData.password) {
            throw new Error("Password Is Required.");
        }

        // Hash password before saving (if password is part of userData)
        const hashedPassword = await hashPassword(userData.password);
        console.log("hashed password", hashedPassword);

        // Prepare user data for insertion
        const userToCreate = {
            ...userData,
            password: hashedPassword,
        };

        const result = await userModel.createUser(userToCreate);
        return result;
    } catch (err) {
        throw err;
    }
};

export const getAllUsers = async () => {
    try {
        const users = await userModel.getAllUsers();
        return users;
    } catch (err) {
        console.error("Get all users error:", err.message);
        throw err;
    }
};

export const getUserById = async (userId) => {
    try {
        const user = await userModel.findUserById(userId);
        return user;
    } catch (err) {
        console.error("Get user by ID error:", err.message);
        throw err;
    }
};

export const updateUser = async (userId, updateData) => {
    try {
        const updatedUser = await userModel.updateUser(userId, updateData);
        return updatedUser;
    } catch (err) {
        console.error("Update user error:", err.message);
        throw err;
    }
};

export const deleteUser = async (userId) => {
    try {
        const result = await userModel.deleteUser(userId);
        return result;
    } catch (err) {
        console.error("Delete user error:", err.message);
        throw err;
    }
};
