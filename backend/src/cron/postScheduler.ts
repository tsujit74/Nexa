// src/cron/postScheduler.ts
import cron from "node-cron";
import { runSchedulerNow } from "../utils/postScheduler";

// Runs every 30 minutes
cron.schedule("*/30 * * * *", async () => {
  console.log("⏱ Scheduled posts cron job started...");
  await runSchedulerNow();
});
