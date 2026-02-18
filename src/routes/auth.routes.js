// auth routes
import * as userController from "#controllers/user.controller.js";
import { validate } from "#middlewares/validate.middleware.js";
import { loginUserSchema } from "#validations/user.validation.js";
import express from "express";
import { whoAmI } from "../controllers/auth.controller.js";

const router = express.Router();

// ==================== AUTHENTICATION ROUTES ====================
// Public routes - No authentication required
router.post("/register", userController.register);
router.post("/login", validate(loginUserSchema), userController.login);
router.get("/whoami", validate(loginUserSchema), whoAmI);

export default router;
