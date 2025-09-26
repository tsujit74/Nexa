import { Request, Response } from "express";
import User from "../models/User";
import TwitterApi from "twitter-api-v2";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/authMiddleware";
import axios from "axios";

type Platform = "twitter" | "linkedin" | "instagram";

interface TokenPayload {
  userId: string;
}

export const startOAuth = async (req: AuthRequest, res: Response) => {
  const { platform } = req.params;

  if (!["twitter", "linkedin", "instagram"].includes(platform)) {
    return res.status(400).json({ message: "Unsupported platform" });
  }

  try {
    if (!req.user || !req.token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (platform === "twitter") {
      const client = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY!,
        appSecret: process.env.TWITTER_API_SECRET!,
      });

      const callbackUrl = process.env.TWITTER_CALLBACK_URL!;
      console.log("📡 Twitter Callback URL:", callbackUrl);

      const { url, oauth_token, oauth_token_secret } =
        await client.generateAuthLink(callbackUrl);

      await User.findByIdAndUpdate(req.user._id, {
        "socialAccounts.twitterTemp": {
          oauthToken: oauth_token,
          oauthTokenSecret: oauth_token_secret,
        },
      });

      return res.json({ url });
    }

    if (platform === "linkedin") {
      const callbackUrl = process.env.LINKEDIN_CALLBACK_URL!;
      const state = req.token;

      const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${
        process.env.LINKEDIN_CLIENT_ID
      }&redirect_uri=${encodeURIComponent(
        callbackUrl
      )}&scope=openid%20profile%20email%20w_member_social&state=${req.token}`;

      return res.json({ url });
    }

    if (platform === "instagram") {
      const callbackUrl = process.env.INSTAGRAM_CALLBACK_URL!;
      const state = req.token;

      const url = `https://api.instagram.com/oauth/authorize?client_id=${
        process.env.INSTAGRAM_CLIENT_ID
      }&redirect_uri=${encodeURIComponent(
        callbackUrl
      )}&scope=user_profile,user_media&response_type=code&state=${state}`;

      return res.json({ url });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to start OAuth" });
  }
};

export const handleOAuthCallback = async (req: Request, res: Response) => {
  const { platform } = req.params;

  if (platform === "twitter") {
    const { oauth_token, oauth_verifier } = req.query;

    if (!oauth_token || !oauth_verifier) {
      return res
        .status(400)
        .json({ message: "Missing oauth_token or oauth_verifier" });
    }

    try {
      const user = await User.findOne({
        "socialAccounts.twitterTemp.oauthToken": oauth_token,
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const tempTokens = user.socialAccounts?.twitterTemp;
      if (!tempTokens) {
        return res.status(400).json({ message: "Missing temp tokens" });
      }

      const client = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY!,
        appSecret: process.env.TWITTER_API_SECRET!,
        accessToken: tempTokens.oauthToken,
        accessSecret: tempTokens.oauthTokenSecret,
      });

      const { accessToken, accessSecret } = await client.login(
        oauth_verifier as string
      );

      user.socialAccounts = {
        ...user.socialAccounts,
        twitter: { accessToken, accessSecret },
      };
      delete user.socialAccounts.twitterTemp;
      user.markModified("socialAccounts");
      await user.save();

      console.log("✅ Twitter account linked successfully");
      return res.redirect(
        `${process.env.FRONTEND_URL}/dashboard?linked=twitter`
      );
    } catch (error: any) {
      return res.status(500).json({ message: "OAuth callback failed" });
    }
  }

  if (platform === "linkedin") {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.status(400).json({ message: "Missing code or state" });
    }

    try {
      const decoded = jwt.verify(
        state as string,
        process.env.JWT_SECRET!
      ) as TokenPayload;
      console.log("🔑 Decoded LinkedIn state:", decoded);

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resp = await axios.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        new URLSearchParams({
          grant_type: "authorization_code",
          code: code as string,
          redirect_uri: process.env.LINKEDIN_CALLBACK_URL!,
          client_id: process.env.LINKEDIN_CLIENT_ID!,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const { access_token } = resp.data;

      user.socialAccounts = {
        ...user.socialAccounts,
        linkedin: { accessToken: access_token },
      };
      user.markModified("socialAccounts");
      await user.save();

      console.log("✅ LinkedIn account linked successfully");
      return res.redirect(
        `${process.env.FRONTEND_URL}/dashboard?linked=linkedin`
      );
    } catch (error: any) {
      return res.status(500).json({ message: "OAuth callback failed" });
    }
  }

  if (platform === "instagram") {
    const { code, state } = req.query;
    if (!code || !state) {
      console.error("❌ Missing Instagram code or state");
      return res.status(400).json({ message: "Missing code or state" });
    }

    try {
      const decoded = jwt.verify(
        state as string,
        process.env.JWT_SECRET!
      ) as TokenPayload;
      console.log("🔑 Decoded Instagram state:", decoded);

      const user = await User.findById(decoded.userId);
      if (!user) {
        console.error("❌ Instagram user not found");
        return res.status(404).json({ message: "User not found" });
      }

      const resp = await axios.post(
        "https://api.instagram.com/oauth/access_token",
        new URLSearchParams({
          client_id: process.env.INSTAGRAM_CLIENT_ID!,
          client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
          grant_type: "authorization_code",
          redirect_uri: process.env.INSTAGRAM_CALLBACK_URL!,
          code: code as string,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      console.log("📡 Instagram access token response:", resp.data);
      const { access_token } = resp.data;

      user.socialAccounts = {
        ...user.socialAccounts,
        instagram: { accessToken: access_token },
      };
      user.markModified("socialAccounts");
      await user.save();

      console.log("✅ Instagram account linked successfully");
      return res.redirect(
        `${process.env.FRONTEND_URL}/dashboard?linked=instagram`
      );
    } catch (error: any) {
      console.error(
        "❌ Instagram OAuth callback error:",
        error.response?.data || error.message
      );
      return res.status(500).json({ message: "OAuth callback failed" });
    }
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
    return res.status(500).json({ message: "Failed to fetch accounts" });
  }
};
