import * as userController from "#controllers/user.controller.js";
import { authenticate } from "#middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/create", authenticate, userController.createUser);
router.get("/", authenticate, userController.getAllUsers);
router.get("/:id", authenticate, userController.getUserById);
router.patch("/:id", authenticate, userController.updateUser);
router.delete("/:id", authenticate, userController.deleteUser);

export default router;
