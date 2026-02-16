// Auth service - Business logic layer
import { generateToken } from "#utils/jwt.util.js";
import { comparePassword, hashPassword } from "#utils/password.util.js";
import * as authModel from "../models/auth.model.js";

// Register a new user
export const registerUser = async (name, username, password) => {
    // Check if user already exists
    const existingUser = await authModel.findUserByUsername(username);
    if (existingUser) {
        throw new Error("Username already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userData = {
        name,
        username,
        password: hashedPassword,
        createdAt: new Date(),
    };

    const result = await authModel.createUser(userData);
    return { userId: result.insertedId, username, name };
};

// Login user
export const loginUser = async (username, password) => {
    // Find user
    const user = await authModel.findUserByUsername(username);
    if (!user) {
        throw new Error("Invalid credentials");
    }

    // Verify password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    // Generate token
    const token = generateToken({ userId: user._id.toString(), username: user.username });

    return { token, user: { id: user._id, username: user.username } };
};
