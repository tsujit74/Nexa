// src/utils/platformLinkedIn.ts
import { IPost } from "../models/Post";
import fetch from "node-fetch";

export const postToLinkedIn = async (post: IPost, token: string) => {
  try {
    if (!token) throw new Error("LinkedIn token not found");

    // LinkedIn API requires POST to /ugcPosts
    const body = {
      author: `urn:li:person:${post.userId}`, // LinkedIn user URN
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: post.content },
          shareMediaCategory: "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    };

    const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`LinkedIn API error: ${res.statusText}`);

    console.log(`[LinkedIn] Post successful`);
    return true;
  } catch (err) {
    console.error(`[LinkedIn] Failed to post:`, err);
    return false;
  }
};
