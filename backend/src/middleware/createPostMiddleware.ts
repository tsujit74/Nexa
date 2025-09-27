import { Request, Response, NextFunction } from "express";
import Post from "../models/Post";

// Middleware to create a post and attach it to req
export const createPostMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user;
  const { content, type, scheduledDate, platform } = req.body;

  if (!userId) return res.status(401).json({ message: "User not authenticated" });
  if (!content) return res.status(400).json({ message: "Content is required" });
  if (!platform) return res.status(400).json({ message: "Platform is required" });

  try {
    const post = await Post.create({
      userId,
      content,
      type: type || "static",
      scheduledDate: scheduledDate || new Date(),
      platform,
      status: "pending",
    });

    (req as any).post = post;

    next(); 
  } catch (err) {
    console.error("Error creating post in middleware:", err);
    res.status(500).json({ message: "Error creating post", error: err });
  }
};
