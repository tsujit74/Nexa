import {  Response, NextFunction } from "express";
import Post from "../models/Post";
import { AuthRequest } from "./authMiddleware";

export const dailyPostLimitMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const { scheduledDate } = req.body;

    const targetDate = scheduledDate ? new Date(scheduledDate) : new Date();

    const dayStart = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );

    const dayEnd = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    const postCount = await Post.countDocuments({
      userId,
      scheduledDate: { $gte: dayStart, $lte: dayEnd },
      status: { $in: ["pending", "posted"] },
    });

    if (postCount >= 3) {
      return res.status(400).json({
        message:
          "Daily post limit reached. You can only schedule up to 3 posts per day.",
      });
    }

    next();
  } catch (err) {
    console.error("Daily post limit middleware error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
