// src/utils/postScheduler.ts
import Post from "../models/Post";
import User from "../models/User";
import { postToTwitter } from "./platformTwittter";
import { postToLinkedIn } from "./platformLinkedIn";
import { postToInstagram } from "./platformInstagram";
// import { postToInstagram } from "./platformInstagram";

export const runSchedulerNow = async () => {
  console.log("⏱ Running scheduler...");

  try {
    // Get current IST time
    const localTime = new Date();
    const now = new Date(
      localTime.getTime() - localTime.getTimezoneOffset() * 60000
    );

    // Count pending posts
    const pendingCount = await Post.countDocuments({ status: "pending" });
    if (pendingCount === 0) {
      console.log("✅ No pending posts, skipping this run.");
      return;
    }

    // Find posts scheduled until now
    const posts = await Post.find({
      status: "pending",
      scheduledDate: { $lte: now.toISOString() },
    });

    if (posts.length === 0) {
      console.log("✅ No posts are scheduled for this time.");
      return;
    }

    console.log(`Found ${posts.length} post(s) to process.`);

    for (const post of posts) {
      if (!post.userId) continue;

      const user = await User.findById(post.userId.toString());
      if (!user) {
        console.warn(`⚠️ User not found for post ${post._id}`);
        post.status = "failed";
        await post.save();
        continue;
      }

      try {
        // Twitter
        if (
          ["twitter", "all"].includes(post.platform) &&
          user.socialAccounts.twitter
        ) {
          await postToTwitter(post, user.socialAccounts.twitter);
        }

        // LinkedIn
        if (
          ["linkedin", "all"].includes(post.platform) &&
          user.socialAccounts.linkedin
        ) {
          await postToLinkedIn(post, user.socialAccounts.linkedin);
        }

        //Instagram (optional)
        if (
          ["instagram", "all"].includes(post.platform) &&
          user.socialAccounts.instagram?.accessToken &&
          user.socialAccounts.instagram?.instagramBusinessId
        ) {
          await postToInstagram(post, {
            accessToken: user.socialAccounts.instagram.accessToken,
            instagramBusinessId:
              user.socialAccounts.instagram.instagramBusinessId,
          });
        }

        post.status = "posted";
        await post.save();
        console.log(`✅ Post ${post._id} marked as posted.`);
      } catch (err) {
        console.error(`❌ Failed to post ${post._id}:`, err);
        post.status = "failed";
        await post.save();
      }
    }
  } catch (err) {
    console.error("❌ Error running scheduler:", err);
  }

  console.log("⏱ Scheduler run completed.");
};
