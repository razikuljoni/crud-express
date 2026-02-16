// Auth service - Business logic layer
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authModel from "../models/auth.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const SALT_ROUNDS = 10;

// Register a new user
export const registerUser = async (name, username, password) => {
    // Check if user already exists
    const existingUser = await authModel.findUserByUsername(username);
    if (existingUser) {
        throw new Error("Username already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    // Generate token
    const token = jwt.sign({ userId: user._id.toString(), username: user.username }, JWT_SECRET, {
        expiresIn: "24h",
    });

    return { token, user: { id: user._id, username: user.username } };
};

// Verify JWT token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        throw new Error("Invalid token");
    }
};
