// auth routes
import express from "express";
import { login, register, whoAmI } from "../controllers/auth.controller.js";
import { validate } from "#middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "#utils/validation.schema.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/whoami", whoAmI);

export default router;
