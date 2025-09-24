import { Router } from "express";
import { sendMessage } from "../controllers/chatbotController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// POST /chatbot/message
router.post("/message", authMiddleware, sendMessage);

export default router;
