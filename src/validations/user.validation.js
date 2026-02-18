// Zod validation schemas for user operations
import { z } from "zod";

// Register/Create User Schema
export const registerUserSchema = z.object({
    body: z.object({
        roleId: z.number().int().positive({ message: "Role ID must be a positive integer" }),
        firstName: z
            .string()
            .min(1, { message: "First name is required" })
            .max(50, { message: "First name must be max 50 characters" })
            .trim(),
        middleName: z
            .string()
            .max(50, { message: "Middle name must be max 50 characters" })
            .trim()
            .optional(),
        lastName: z
            .string()
            .min(1, { message: "Last name is required" })
            .max(50, { message: "Last name must be max 50 characters" })
            .trim(),
        username: z
            .string()
            .min(3, { message: "Username must be at least 3 characters" })
            .max(50, { message: "Username must be max 50 characters" })
            .regex(/^[a-zA-Z0-9_]+$/, {
                message: "Username can only contain letters, numbers, and underscores",
            })
            .trim(),
        mobile: z
            .string()
            .min(10, { message: "Mobile number must be at least 10 digits" })
            .max(15, { message: "Mobile number must be max 15 digits" })
            .regex(/^\+?[0-9]{10,15}$/, { message: "Invalid mobile number format" })
            .trim(),
        email: z
            .string()
            .email({ message: "Invalid email format" })
            .max(50, { message: "Email must be max 50 characters" })
            .toLowerCase()
            .trim(),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters" })
            .max(255, { message: "Password must be max 255 characters" })
            .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
            .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
            .regex(/[0-9]/, { message: "Password must contain at least one number" })
            .regex(/[^A-Za-z0-9]/, {
                message: "Password must contain at least one special character",
            }),
        intro: z
            .string()
            .max(500, { message: "Intro must be max 500 characters" })
            .trim()
            .optional(),
        profile: z
            .string()
            .max(2000, { message: "Profile must be max 2000 characters" })
            .trim()
            .optional(),
    }),
});

// Login Schema
export const loginUserSchema = z.object({
    body: z.object({
        usernameOrEmail: z.string().min(3, { message: "Username or email is required" }).trim(),
        password: z.string().min(1, { message: "Password is required" }),
    }),
});

// Update User Schema
export const updateUserSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid user ID format" }),
    }),
    body: z.object({
        roleId: z.number().int().positive().optional(),
        firstName: z.string().min(1).max(50).trim().optional(),
        middleName: z.string().max(50).trim().optional(),
        lastName: z.string().min(1).max(50).trim().optional(),
        username: z
            .string()
            .min(3)
            .max(50)
            .regex(/^[a-zA-Z0-9_]+$/)
            .trim()
            .optional(),
        mobile: z
            .string()
            .min(10)
            .max(15)
            .regex(/^\+?[0-9]{10,15}$/)
            .trim()
            .optional(),
        email: z.string().email().max(50).toLowerCase().trim().optional(),
        intro: z.string().max(500).trim().optional(),
        profile: z.string().max(2000).trim().optional(),
    }),
});

// Get User by ID Schema
export const getUserByIdSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid user ID format" }),
    }),
});
