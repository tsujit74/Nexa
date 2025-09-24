// src/cron/postScheduler.ts
import cron from "node-cron";
import { runSchedulerNow } from "../utils/postScheduler";

// Schedule the job to run every minute
cron.schedule("* * * * *", async () => {
  console.log("⏱ Running scheduled posts cron job...");
  await runSchedulerNow();
});
