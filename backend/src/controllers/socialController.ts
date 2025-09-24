// src/controllers/socialController.ts
import { Request, Response } from "express";
import User from "../models/User";

type Platform = "twitter" | "linkedin" | "instagram";

export const linkAccount = async (req: Request, res: Response) => {
  const user = (req as any).user; // full user from authMiddleware

  if (!user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const { platform, accessToken, accessSecret } = req.body;

  if (!platform || !["twitter", "linkedin", "instagram"].includes(platform)) {
    return res.status(400).json({ message: "Invalid platform" });
  }

  try {
    if (!user.socialAccounts) user.socialAccounts = {};

    if (platform === "twitter") {
      if (!accessToken || !accessSecret) {
        return res
          .status(400)
          .json({ message: "Twitter requires accessToken and accessSecret" });
      }
      user.socialAccounts.twitter = { accessToken, accessSecret };
    } else {
      user.socialAccounts[platform] = accessToken; // for LinkedIn/Instagram, just token
    }

    await user.save();

    res.json({ message: `${platform} linked successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
