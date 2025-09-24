import { Request, Response } from "express";
import Post from "../models/Post";

export const getOverview = async (req: Request, res: Response) => {
  const userId = (req as any).user;
  const posts = await Post.find({ userId });
  const pending = posts.filter((p) => p.status === "pending").length;
  const posted = posts.filter((p) => p.status === "posted").length;
  res.json({ total: posts.length, pending, posted });
};
