import { Router } from "express";

const router = Router();
import { UserController } from "../controllers/UserController";

const userController = new UserController();
router.post("/register", userController.register);
router.post("/login", userController.login);

export default router;