// User service - Business logic layer
import * as userModel from "#models/user.model.js";
import { generateToken } from "#utils/jwt.util.js";
import logger from "#utils/logger.js";
import { comparePassword, hashPassword } from "#utils/password.util.js";

// Register a new user
export const registerUser = async (userData) => {
    try {
        console.log("user service", userData);

        // Check if username already exists
        const existingUsername = await userModel.findUserByUsername(userData.username);
        if (existingUsername) {
            throw new Error("Username already exists");
        }

        // Check if email already exists
        const existingEmail = await userModel.findUserByEmail(userData.email);
        if (existingEmail) {
            throw new Error("Email already exists");
        }

        // Hash password
        const passwordHash = await hashPassword(userData.password);

        // Prepare user document for MongoDB
        const userDocument = {
            roleId: userData.roleId,
            firstName: userData.firstName,
            middleName: userData.middleName || null,
            lastName: userData.lastName,
            username: userData.username,
            mobile: userData.mobile,
            email: userData.email,
            passwordHash: passwordHash,
            registeredAt: new Date(),
            lastLogin: null,
            intro: userData.intro || null,
            profile: userData.profile || null,
        };

        // Create user in database
        const result = await userModel.createUser(userDocument);

        logger.info("User registered successfully", {
            userId: result.insertedId,
            username: userData.username,
            email: userData.email,
        });

        // Return user without password
        return {
            id: result.insertedId,
            roleId: userData.roleId,
            firstName: userData.firstName,
            middleName: userData.middleName,
            lastName: userData.lastName,
            username: userData.username,
            mobile: userData.mobile,
            email: userData.email,
            registeredAt: userDocument.registeredAt,
        };
    } catch (error) {
        logger.error("Error registering user", { error: error.message });
        throw error;
    }
};

// Login user
export const loginUser = async (usernameOrEmail, password) => {
    try {
        // Find user by username or email
        let user = await userModel.findUserByUsername(usernameOrEmail);
        if (!user) {
            user = await userModel.findUserByEmail(usernameOrEmail);
        }

        if (!user) {
            throw new Error("Invalid credentials");
        }

        // Verify password
        const isMatch = await comparePassword(password, user.passwordHash);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        // Update last login
        await userModel.updateLastLogin(user._id);

        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
            roleId: user.roleId,
        });

        logger.info("User logged in successfully", {
            userId: user._id,
            username: user.username,
        });

        // Return token and user info (without password)
        return {
            token,
            user: {
                id: user._id,
                roleId: user.roleId,
                firstName: user.firstName,
                middleName: user.middleName,
                lastName: user.lastName,
                username: user.username,
                mobile: user.mobile,
                email: user.email,
                registeredAt: user.registeredAt,
                lastLogin: new Date(),
            },
        };
    } catch (error) {
        logger.error("Error logging in user", { error: error.message });
        throw error;
    }
};

// Get user by ID
export const getUserById = async (userId) => {
    try {
        const user = await userModel.findUserById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Return user without password
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        logger.error("Error getting user by ID", { error: error.message, userId });
        throw error;
    }
};

// Update user
export const updateUser = async (userId, updateData) => {
    try {
        // Check if user exists
        const user = await userModel.findUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // If username is being updated, check if it's already taken
        if (updateData.username && updateData.username !== user.username) {
            const existingUsername = await userModel.findUserByUsername(updateData.username);
            if (existingUsername) {
                throw new Error("Username already exists");
            }
        }

        // If email is being updated, check if it's already taken
        if (updateData.email && updateData.email !== user.email) {
            const existingEmail = await userModel.findUserByEmail(updateData.email);
            if (existingEmail) {
                throw new Error("Email already exists");
            }
        }

        // Update user
        const result = await userModel.updateUserById(userId, updateData);

        if (result.modifiedCount === 0) {
            throw new Error("User update failed");
        }

        logger.info("User updated successfully", {
            userId,
            updatedFields: Object.keys(updateData),
        });

        // Get updated user
        return await getUserById(userId);
    } catch (error) {
        logger.error("Error updating user", { error: error.message, userId });
        throw error;
    }
};

// Get all users with pagination
export const getAllUsers = async (options = {}) => {
    try {
        const { page = 1, limit = 10, roleId } = options;
        const skip = (page - 1) * limit;

        const filter = {};
        if (roleId) {
            filter.roleId = parseInt(roleId);
        }

        const users = await userModel.findAllUsers(filter, {
            skip,
            limit: parseInt(limit),
            sort: { registeredAt: -1 },
        });

        const total = await userModel.countUsers(filter);

        // Remove passwords from all users
        const usersWithoutPasswords = users.map(({ passwordHash, ...user }) => user);

        return {
            users: usersWithoutPasswords,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        logger.error("Error getting all users", { error: error.message });
        throw error;
    }
};

// Delete user
export const deleteUser = async (userId) => {
    try {
        const user = await userModel.findUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const result = await userModel.deleteUserById(userId);

        if (result.deletedCount === 0) {
            throw new Error("User deletion failed");
        }

        logger.info("User deleted successfully", { userId });

        return { message: "User deleted successfully" };
    } catch (error) {
        logger.error("Error deleting user", { error: error.message, userId });
        throw error;
    }
};
