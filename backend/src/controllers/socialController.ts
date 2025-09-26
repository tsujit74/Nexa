// controllers/socialController.ts
import { Request, Response } from "express";
import User from "../models/User";
import TwitterApi from "twitter-api-v2";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/authMiddleware";

type Platform = "twitter";

interface TokenPayload {
  userId: string;
}

// ------------------ START OAUTH ------------------
export const startOAuth = async (req: AuthRequest, res: Response) => {
  console.log("🚀 startOAuth called for platform:", req.params.platform);

  const { platform } = req.params;
  if (platform !== "twitter") {
    return res.status(400).json({ message: "Unsupported platform" });
  }

  try {
    if (!req.user || !req.token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
    });

    // Callback must include our JWT so we know the user later
    const callbackUrl = `${process.env.TWITTER_CALLBACK_URL}?token=${req.token}`;
    console.log("📡 Callback URL:", callbackUrl);

    const { url, oauth_token, oauth_token_secret } =
      await client.generateAuthLink(callbackUrl);

    console.log("✅ Twitter auth URL generated:", url);

    // Store temp tokens in DB under twitterTemp
    await User.findByIdAndUpdate(req.user._id, {
      "socialAccounts.twitterTemp": {
        oauthToken: oauth_token,
        oauthTokenSecret: oauth_token_secret,
      },
    });

    return res.json({ url });
  } catch (error) {
    console.error("🔥 startOAuth error:", error);
    return res.status(500).json({ message: "Failed to start OAuth" });
  }
};

// ------------------ HANDLE CALLBACK ------------------
export const handleOAuthCallback = async (req: Request, res: Response) => {
  console.log("🔔 OAuth callback called for Twitter");

  const { oauth_token, oauth_verifier, token } = req.query;

  if (!oauth_token || !oauth_verifier || !token) {
    console.log("❌ Missing parameters:", req.query);
    return res.status(400).json({
      message: "Missing oauth_token, oauth_verifier, or token",
    });
  }

  try {
    // Verify JWT (to identify user)
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET!
    ) as TokenPayload;

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const tempTokens = user.socialAccounts?.twitterTemp;
    if (!tempTokens || tempTokens.oauthToken !== oauth_token) {
      console.log("❌ OAuth token mismatch");
      return res.status(400).json({ message: "OAuth token mismatch" });
    }

    // Exchange tokens
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: tempTokens.oauthToken,
      accessSecret: tempTokens.oauthTokenSecret,
    });

    console.log("📡 Exchanging tokens with Twitter...");
    const { accessToken, accessSecret } = await client.login(
      oauth_verifier as string
    );

    // ✅ Save permanent tokens using Mongoose-friendly update
    user.socialAccounts = {
      ...user.socialAccounts,
      twitter: { accessToken, accessSecret },
    };
    if (user.socialAccounts.twitterTemp) {
      delete user.socialAccounts.twitterTemp;
    }

    // Force mark as modified
    user.markModified("socialAccounts");

    await user.save();

    console.log("✅ Twitter account linked successfully");

    // Redirect to frontend
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard?linked=twitter`);
  } catch (error) {
    console.error("🔥 handleOAuthCallback error:", error);
    return res.status(500).json({ message: "OAuth callback failed" });
  }
};

// ------------------ GET LINKED ACCOUNTS ------------------
export const getLinkedAccounts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.json({ socialAccounts: req.user.socialAccounts || {} });
  } catch (error) {
    console.error("getLinkedAccounts error:", error);
    return res.status(500).json({ message: "Failed to fetch accounts" });
  }
};
