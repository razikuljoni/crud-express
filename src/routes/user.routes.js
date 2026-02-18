// User routes
import * as userController from "#controllers/user.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";
import { validate } from "#middlewares/validate.middleware.js";
import {
    getUserByIdSchema,
    loginUserSchema,
    registerUserSchema,
    updateUserSchema,
} from "#validations/user.validation.js";
import express from "express";

const router = express.Router();

// Public routes
router.post("/register", validate(registerUserSchema), userController.register);
router.post("/login", validate(loginUserSchema), userController.login);

// Protected routes (require authentication)
router.get("/profile", authenticate, userController.getProfile);
router.get("/", authenticate, userController.getAllUsers);
router.get("/:id", authenticate, validate(getUserByIdSchema), userController.getUserById);
router.patch("/:id", authenticate, validate(updateUserSchema), userController.updateUser);
router.delete("/:id", authenticate, validate(getUserByIdSchema), userController.deleteUser);

export default router;
