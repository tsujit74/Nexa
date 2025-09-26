// routes/authRoutes.ts
import { Router } from "express";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/me",authMiddleware, getMe);

export default router;
