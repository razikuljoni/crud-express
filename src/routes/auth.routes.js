// auth routes
import { login, register, whoAmI } from "#controllers/auth.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";
import { validate } from "#middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "#utils/validation.schema.js";
import express from "express";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/whoami", authenticate, whoAmI);

export default router;
