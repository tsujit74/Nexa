// src/utils/postScheduler.ts
import Post, { IPost } from "../models/Post";
import User from "../models/User";
import { postToTwitter } from "./platformTwittter";
import { postToLinkedIn } from "./platformLinkedIn";
import { postToInstagram } from "./platformInstagram";

export const runSchedulerNow = async () => {
  console.log(" Running scheduler manually...");

  try {
    const localTime = new Date(); // IST
    const now = new Date(
      localTime.getTime() - localTime.getTimezoneOffset() * 60000
    );

    console.log(" Current time (server):", now);
    const T = await Post.find({ status: "pending" });
    console.log(" All pending posts with scheduledDate:");
    T.forEach((p) => console.log(p._id, p.scheduledDate));

    const posts = await Post.find({
      status: "pending",
      scheduledDate: { $lte: now.toISOString() },
    });

    console.log(` Found ${posts.length} post(s) to process.`);

    for (const post of posts) {
      if (!post.userId) {
        console.warn(` No userId for post ${post._id}`);
        continue;
      }

      const user = await User.findById(post.userId.toString());
      if (!user) {
        console.warn(`⚠️ User not found for post ${post._id}`);
        continue;
      }

      try {
        // Twitter
        if (["twitter", "all"].includes(post.platform)) {
          if (user.socialAccounts.twitter) {
            try {
              await postToTwitter(post, user.socialAccounts.twitter);
            } catch (err) {
              console.error(` Twitter failed for ${post._id}:`, err);
            }
          } else {
            console.warn(` Twitter account not linked for post ${post._id}`);
          }
        }

      
if (["linkedin", "all"].includes(post.platform)) {
  if (user.socialAccounts.linkedin) {
    try {
      await postToLinkedIn(post, user.socialAccounts.linkedin);
    } catch (err) {
      console.error(`LinkedIn failed for ${post._id}:`, err);
    }
  } else {
    console.warn(`LinkedIn account not linked for post ${post._id}`);
  }
}


        // Instagram
        // if (["instagram", "all"].includes(post.platform)) {
        //   if (user.socialAccounts.instagram) {
        //     try {
        //       await postToInstagram(
        //         post,
        //         user.socialAccounts.instagram,
        //         user.socialAccounts.instagramId
        //       );
        //     } catch (err) {
        //       console.error(`Instagram failed for ${post._id}:`, err);
        //     }
        //   }
        // }

        // Mark post as posted
        post.status = "posted";
        await post.save();
        console.log(` Post ${post._id} marked as posted.`);
      } catch (err) {
        console.error(`Failed to post ${post._id}:`, err);
        post.status = "failed";
        await post.save();
      }
    }
  } catch (err) {
    console.error("Error fetching scheduled posts:", err);
  }

  console.log(" Scheduler run completed.");
};