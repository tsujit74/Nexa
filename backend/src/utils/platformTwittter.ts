// src/utils/platformTwitter.ts
import { IPost } from "../models/Post";
import TwitterApi from "twitter-api-v2";

export const postToTwitter = async (post: IPost, twitterAccount: { accessToken: string, accessSecret: string }) => {
  try {
    if (!twitterAccount || !twitterAccount.accessToken || !twitterAccount.accessSecret) {
      throw new Error("Twitter accessToken or accessSecret not found");
    }

    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: twitterAccount.accessToken,
      accessSecret: twitterAccount.accessSecret,
    });

    const rwClient = client.readWrite;

    const response = await rwClient.v2.tweet(post.content);

    console.log(`[Twitter] Post successful: ${response.data.id}`);
    return true;
  } catch (err) {
    console.error(`[Twitter] Failed to post:`, err);
    return false;
  }
};
