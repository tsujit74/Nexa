import { Router } from "express";
import { createPost, getPosts, editPost } from "../controllers/postController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/create", authMiddleware, createPost);
router.get("/", authMiddleware, getPosts);
router.put("/edit", authMiddleware, editPost);

export default router;
