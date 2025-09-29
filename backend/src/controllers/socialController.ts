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

  if (!req.user || !req.token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    if (platform === "twitter") {
      const client = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY!,
        appSecret: process.env.TWITTER_API_SECRET!,
      });

      const callbackUrl = process.env.TWITTER_CALLBACK_URL!;
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
      )}&scope=openid%20profile%20email%20w_member_social&state=${state}`;

      return res.json({ url });
    }

    if (platform === "instagram") {
      const callbackUrl = process.env.INSTAGRAM_CALLBACK_URL!;
      const state = req.token; // JWT or unique string to identify user

      const url = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${
        process.env.INSTAGRAM_CLIENT_ID
      }&redirect_uri=${encodeURIComponent(
        callbackUrl
      )}&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement,pages_manage_posts&response_type=code&state=${state}`;

      return res.json({ url });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to start OAuth" });
  }
};

export const handleOAuthCallback = async (req: Request, res: Response) => {
  const { platform } = req.params;

  try {
    if (platform === "twitter") {
      const { oauth_token, oauth_verifier } = req.query;
      if (!oauth_token || !oauth_verifier) {
        return res
          .status(400)
          .json({ message: "Missing oauth_token or oauth_verifier" });
      }

      const user = await User.findOne({
        "socialAccounts.twitterTemp.oauthToken": oauth_token,
      });
      if (!user) return res.status(404).json({ message: "User not found" });

      const tempTokens = user.socialAccounts?.twitterTemp;
      if (!tempTokens)
        return res.status(400).json({ message: "Missing temp tokens" });

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

      return res.redirect(
        `${process.env.FRONTEND_URL}/dashboard?linked=twitter`
      );
    }

    if (platform === "linkedin") {
      const { code, state } = req.query;
      if (!code || !state)
        return res.status(400).json({ message: "Missing code or state" });

      const decoded = jwt.verify(
        state as string,
        process.env.JWT_SECRET!
      ) as TokenPayload;
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const tokenResp = await axios.post(
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

      const { access_token, id_token } = tokenResp.data;
      if (!access_token || !id_token)
        return res.status(500).json({ message: "Failed to obtain tokens" });

      // Fetch Lite Profile
      const profileResp = await axios.get(
        "https://api.linkedin.com/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      const { sub: linkedInId, name, email, picture } = profileResp.data;
      if (!linkedInId)
        return res
          .status(500)
          .json({ message: "Failed to fetch LinkedIn profile" });
      user.socialAccounts = {
        ...user.socialAccounts,
        linkedin: {
          accessToken: access_token,
          linkedInId,
          name,
          email,
          photo: picture,
        },
      };
      user.markModified("socialAccounts");
      await user.save();

      return res.redirect(
        `${process.env.FRONTEND_URL}/dashboard?linked=linkedin`
      );
    }

   if (platform === "instagram") {
  const { code, state } = req.query;
  if (!code || !state)
    return res.status(400).json({ message: "Missing code or state" });

  const decoded = jwt.verify(state as string, process.env.JWT_SECRET!) as TokenPayload;
  const user = await User.findById(decoded.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  // 1️⃣ Exchange code for short-lived user token
  const shortTokenResp = await axios.get(
    "https://graph.facebook.com/v17.0/oauth/access_token",
    {
      params: {
        client_id: process.env.INSTAGRAM_CLIENT_ID!,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
        redirect_uri: process.env.INSTAGRAM_CALLBACK_URL!,
        code,
      },
    }
  );

  const shortLivedToken = shortTokenResp.data.access_token;

  // 2️⃣ Exchange for long-lived token
  const longTokenResp = await axios.get(
    "https://graph.facebook.com/v17.0/oauth/access_token",
    {
      params: {
        grant_type: "fb_exchange_token",
        client_id: process.env.INSTAGRAM_CLIENT_ID!,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
        fb_exchange_token: shortLivedToken,
      },
    }
  );

  const longLivedToken = longTokenResp.data.access_token;

  // 3️⃣ Get user's pages
  const pagesResp = await axios.get(
    "https://graph.facebook.com/v17.0/me/accounts",
    { params: { access_token: longLivedToken } }
  );

  const page = pagesResp.data.data[0]; // pick first page for example
  if (!page) return res.status(500).json({ message: "No Facebook Page found" });

  // 4️⃣ Get Instagram Business Account ID
  const igResp = await axios.get(
    `https://graph.facebook.com/v17.0/${page.id}`,
    { params: { fields: "instagram_business_account", access_token: page.access_token } }
  );

  const igUserId = igResp.data.instagram_business_account?.id;
  if (!igUserId) return res.status(500).json({ message: "No Instagram Business account found" });

  // 5️⃣ Save tokens & igUserId in user document
 user.socialAccounts.instagram = {
  accessToken: page.access_token,        // renamed from pageAccessToken
  instagramBusinessId: igUserId,         // renamed from instagramId
};
user.markModified("socialAccounts");
await user.save();


  return res.redirect(`${process.env.FRONTEND_URL}/dashboard?linked=instagram`);
}

  } catch (error: any) {
    return res.status(500).json({ message: "OAuth callback failed" });
  }
};

export const getLinkedAccounts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    return res.json({ socialAccounts: req.user.socialAccounts || {} });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch accounts" });
  }
};
