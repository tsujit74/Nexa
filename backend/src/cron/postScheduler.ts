// src/cron/postScheduler.ts
import cron from "node-cron";
import { runSchedulerNow } from "../utils/postScheduler";

cron.schedule("* * * * *", async () => {
  console.log("⏱ Scheduled posts cron job started...");
  await runSchedulerNow();
});
