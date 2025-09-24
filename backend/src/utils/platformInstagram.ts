import fetch from "node-fetch";
import { IPost } from "../models/Post";

export const postToInstagram = async (post: IPost, token: string, instagramBusinessId: string) => {
  try {
    // 1️⃣ Create media container
    const mediaRes = await fetch(`https://graph.facebook.com/v16.0/${instagramBusinessId}/media`, {
      method: "POST",
      body: new URLSearchParams({
        image_url: post.content, // assuming post.content is the image URL
        caption: post.content,   // you can split text/caption if needed
        access_token: token,
      }),
    });

    const mediaData = (await mediaRes.json()) as { id?: string };

    if (!mediaData.id) throw new Error("Failed to create Instagram media container");

    // 2️⃣ Publish media
    const publishRes = await fetch(`https://graph.facebook.com/v16.0/${instagramBusinessId}/media_publish`, {
      method: "POST",
      body: new URLSearchParams({
        creation_id: mediaData.id,
        access_token: token,
      }),
    });

    const publishData = (await publishRes.json()) as { id?: string };

    if (!publishData.id) throw new Error("Failed to publish Instagram post");

    console.log(`[Instagram] Post successful: ${publishData.id}`);
  } catch (err) {
    console.error("[Instagram] Post failed:", err);
    throw err;
  }
};
