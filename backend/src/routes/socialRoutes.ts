import { Router } from "express";
import { linkAccount } from "../controllers/socialController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/link", authMiddleware, linkAccount);

export default router;
