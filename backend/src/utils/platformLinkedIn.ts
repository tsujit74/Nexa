// src/utils/platformLinkedIn.ts
import { IPost } from "../models/Post";
import fetch from "node-fetch";



export const postToLinkedIn = async (
  post: IPost,
  linkedinAccount: { accessToken: string; linkedInId: string }
) => {
  try {
    if (!linkedinAccount.accessToken || !linkedinAccount.linkedInId) {
      throw new Error("LinkedIn account not linked or missing ID");
    }

    const body = {
      author: `urn:li:person:${linkedinAccount.linkedInId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: post.content || "New post from my app 🚀",
          },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${linkedinAccount.accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`LinkedIn API error: ${res.status} ${errText}`);
    }

    const data = await res.json();
    console.log(`[LinkedIn] Post successful:`, data);
    return data;
  } catch (err) {
    console.error(`[LinkedIn] Failed to post:`, err);
    return null;
  }
};
