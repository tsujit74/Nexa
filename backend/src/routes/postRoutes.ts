import { Router } from "express";
import {
  createPost,
  getPosts,
  editPost,
} from "../controllers/postController";
import { authMiddleware } from "../middleware/authMiddleware";
import Post from "../models/Post";

const router = Router();


router.post("/", authMiddleware, createPost);        
router.get("/", authMiddleware, getPosts);        
router.put("/:id", authMiddleware, editPost);        
router.delete("/:id", authMiddleware, async (req, res) => {
  const userId = (req as any).user;
  try {
    const deleted = await Post.findOneAndDelete({ _id: req.params.id, userId });
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

export default router;
