// User routes - Includes Authentication (Register, Login) and User Management
import * as userController from "#controllers/user.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";
import { validate } from "#middlewares/validate.middleware.js";
import {
    getUserByIdSchema,
    registerUserSchema,
    updateUserSchema,
} from "#validations/user.validation.js";
import express from "express";

const router = express.Router();

// ==================== AUTHENTICATION ROUTES ====================
// Public routes - No authentication required
router.post("/create", validate(registerUserSchema), userController.register);
// router.post("/login", validate(loginUserSchema), userController.login);

// ==================== USER MANAGEMENT ROUTES ====================
// Protected routes - Authentication required
router.get("/profile", authenticate, userController.getProfile);
router.get("/", authenticate, userController.getAllUsers);
router.get("/:id", authenticate, validate(getUserByIdSchema), userController.getUserById);
router.patch("/:id", authenticate, validate(updateUserSchema), userController.updateUser);
router.delete("/:id", authenticate, validate(getUserByIdSchema), userController.deleteUser);

export default router;
