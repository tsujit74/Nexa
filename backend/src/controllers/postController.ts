import { Request, Response } from "express";
import Post from "../models/Post";
import { postToTwitter } from "../utils/platformTwittter";
import { postToLinkedIn } from "../utils/platformLinkedIn";
import User from "../models/User";
// import { postToInstagram } from "../utils/platformInstagram";

export const createPost = async (req: Request, res: Response) => {
  const userId = (req as any).user;
  const { content, type, scheduledDate, platform } = req.body;

  if (!userId)
    return res.status(401).json({ message: "User not authenticated" });

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
  const { id } = req.params;
  const { content, type, scheduledDate, platform } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Validate input
  if (!content && !type && !scheduledDate && !platform) {
    return res
      .status(400)
      .json({
        message:
          "At least one field (content, type, scheduledDate, platform) must be provided to update",
      });
  }

  const allowedTypes = ["dynamic", "static"];
  const allowedPlatforms = ["twitter", "linkedin", "instagram", "all"];
  if (type && !allowedTypes.includes(type)) {
    return res
      .status(400)
      .json({ message: `Invalid type. Allowed: ${allowedTypes.join(", ")}` });
  }
  if (platform && !allowedPlatforms.includes(platform)) {
    return res
      .status(400)
      .json({
        message: `Invalid platform. Allowed: ${allowedPlatforms.join(", ")}`,
      });
  }

  try {
    // Find the post
    const post = await Post.findOne({ _id: id, userId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only allow editing pending posts
    if (post.status !== "pending") {
      return res
        .status(403)
        .json({ message: "Only pending posts can be edited" });
    }

    // Update fields dynamically
    if (content) post.content = content;
    if (type) post.type = type;
    if (scheduledDate) {
      const dateObj = new Date(scheduledDate);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ message: "Invalid scheduledDate" });
      }
      post.scheduledDate = dateObj;
    }
    if (platform) post.platform = platform;

    await post.save();

    return res.status(200).json({ message: "Post updated successfully", post });
  } catch (err) {
    console.error("Error updating post:", err);
    return res.status(500).json({ message: "Error updating post", error: err });
  }
};

export const immediatePostMiddleware = async (req: Request, res: Response) => {
  const post = (req as any).post;
  const userId = (req as any).user;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const platform = post.platform;

    try {
      // Post to Twitter
      if (
        ["twitter", "all"].includes(platform) &&
        user.socialAccounts.twitter
      ) {
        await postToTwitter(post, user.socialAccounts.twitter);
      }

      // Post to LinkedIn
      if (
        ["linkedin", "all"].includes(platform) &&
        user.socialAccounts.linkedin
      ) {
        await postToLinkedIn(post, user.socialAccounts.linkedin);
      }

      // Instagram (optional)
      // if (["instagram", "all"].includes(platform) && user.socialAccounts.instagram) {
      //   await postToInstagram(post, user.socialAccounts.instagram, user.socialAccounts.instagramId);
      // }

      post.status = "posted";
      await post.save();

      res.status(200).json({ message: "Post published successfully", post });
    } catch (err) {
      post.status = "failed";
      await post.save();
      res
        .status(500)
        .json({ message: "Failed to post immediately", error: err });
    }
  } catch (err) {
    res.status(500).json({ message: "Error in immediate posting", error: err });
  }
};
