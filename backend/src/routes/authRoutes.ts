import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);

export default router;
