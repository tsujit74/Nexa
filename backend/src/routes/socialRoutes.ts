import { Router } from "express";
import {
  startOAuth,
  handleOAuthCallback,
  getLinkedAccounts,
} from "../controllers/socialController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/start/:platform", authMiddleware, startOAuth);
router.get("/callback/:platform", handleOAuthCallback); // no authMiddleware, because redirect already tied to session
router.get("/accounts", authMiddleware, getLinkedAccounts);

export default router;
