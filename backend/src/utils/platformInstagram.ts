// src/utils/platformInstagram.ts
import { IPost } from "../models/Post";
import fetch from "node-fetch";

export interface IInstagramAccount {
  accessToken: string;
  instagramBusinessId: string;
}

/**
 * Post a text-only update to Instagram Business Account
 */
export const postToInstagram = async (
  post: IPost,
  instagramAccount: IInstagramAccount
) => {
  try {
    const { accessToken, instagramBusinessId } = instagramAccount;

    // 1️⃣ Create media container with a simple text caption as image placeholder
    // Instagram requires an image/video, so we can use a 1x1 transparent image as placeholder
    const placeholderImage = "https://via.placeholder.com/1x1.png";

    const mediaRes = await fetch(
      `https://graph.facebook.com/v17.0/${instagramBusinessId}/media`,
      {
        method: "POST",
        body: new URLSearchParams({
          image_url: placeholderImage,
          caption: post.content || "New post from Nexa 🚀",
          access_token: accessToken,
        }),
      }
    );

    const mediaData = (await mediaRes.json()) as { id?: string; error?: any };

    if (!mediaData.id) {
      console.error("[Instagram] Media creation error:", mediaData.error);
      throw new Error("Failed to create Instagram media container");
    }

    // 2️⃣ Publish media
    const publishRes = await fetch(
      `https://graph.facebook.com/v17.0/${instagramBusinessId}/media_publish`,
      {
        method: "POST",
        body: new URLSearchParams({
          creation_id: mediaData.id,
          access_token: accessToken,
        }),
      }
    );

    const publishData = (await publishRes.json()) as { id?: string; error?: any };

    if (!publishData.id) {
      console.error("[Instagram] Publish error:", publishData.error);
      throw new Error("Failed to publish Instagram post");
    }

    console.log(`[Instagram] Text post successful: ${publishData.id}`);
  } catch (err) {
    console.error("[Instagram] Post failed:", err);
    throw err;
  }
};
