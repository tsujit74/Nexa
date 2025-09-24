import { Router } from "express";
import { getOverview } from "../controllers/dashboardController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/overview", authMiddleware, getOverview);

export default router;
