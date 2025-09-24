import { IPost } from "../models/Post";

export const postToPlatform = async (post: IPost) => {
  console.log(`Posting to ${post.platform}: ${post.content}`);
};
