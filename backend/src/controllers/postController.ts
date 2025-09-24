import { Request, Response } from "express";
import Post from "../models/Post";

export const createPost = async (req: Request, res: Response) => {
  const userId = (req as any).user;
  const { content, type, scheduledDate, platform } = req.body;

  if (!userId) return res.status(401).json({ message: "User not authenticated" });

  try {
    const post = await Post.create({
      userId,
      content,
      type,
      scheduledDate,
      platform,
    });
    res.status(201).json(post);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Error creating post" });
  }
};


export const getPosts = async (req: Request, res: Response) => {
  const userId = (req as any).user;
  const posts = await Post.find({ userId });
  res.json(posts);
};

export const editPost = async (req: Request, res: Response) => {
  const userId = (req as any).user;
  const { postId, content, type, scheduledDate, platform } = req.body;

  try {
    const post = await Post.findOneAndUpdate(
      { _id: postId, userId },
      { content, type, scheduledDate, platform },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error updating post" });
  }
};
