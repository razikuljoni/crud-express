// auth routes
import express from "express";
import { login, register, whoAmI } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/whoami", whoAmI);

export default router;
