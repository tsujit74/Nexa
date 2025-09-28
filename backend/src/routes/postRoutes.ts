import { Router } from "express";
import {
  createPost,
  getPosts,
  editPost,
  immediatePostMiddleware,
} from "../controllers/postController";
import { authMiddleware } from "../middleware/authMiddleware";
import Post from "../models/Post";
import { dailyPostLimitMiddleware } from "../middleware/dailyPostLimitMiddleware"; 
import { createPostMiddleware } from "../middleware/createPostMiddleware";

const router = Router();

// Create post with daily limit check
router.post(
  "/",
  authMiddleware,
  dailyPostLimitMiddleware,
  createPost
);

// Get all posts
router.get("/", authMiddleware, getPosts);

// Edit post
router.put("/:id", authMiddleware,dailyPostLimitMiddleware, editPost);

// Delete post
router.delete("/:id", authMiddleware, async (req, res) => {
  const userId = (req as any).user._id;
  try {
    const deleted = await Post.findOneAndDelete({ _id: req.params.id, userId });
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

router.post(
  "/post-immediate",
  authMiddleware,
 dailyPostLimitMiddleware,
  createPostMiddleware,
  immediatePostMiddleware
);


export default router;
