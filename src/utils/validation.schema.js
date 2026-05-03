import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    username: z.string().min(3).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
});

export const createCategorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional(),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
});

export const createProductSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive"),
    stock: z.number().int().nonnegative("Stock must be non-negative"),
    categoryId: z.string().min(1, "Category ID is required"),
});

export const updateProductSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    categoryId: z.string().min(1).optional(),
});

export const createOrderSchema = z.object({
    items: z
        .array(
            z.object({
                productId: z.string().min(1, "Product ID is required"),
                quantity: z.number().int().positive("Quantity must be positive"),
                price: z.number().positive("Price must be positive"),
            }),
        )
        .min(1, "At least one item is required"),
    totalAmount: z.number().positive("Total amount must be positive"),
    shippingAddress: z.object({
        street: z.string().min(1, "Street is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        zipCode: z.string().min(1, "Zip code is required"),
        country: z.string().min(1, "Country is required"),
    }),
});

export const updateOrderSchema = z.object({
    status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).optional(),
    shippingAddress: z
        .object({
            street: z.string().min(1),
            city: z.string().min(1),
            state: z.string().min(1),
            zipCode: z.string().min(1),
            country: z.string().min(1),
        })
        .optional(),
});

export const createReviewSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
    comment: z.string().optional(),
});

export const updateReviewSchema = z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().optional(),
});

export const addToWishlistSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
});
