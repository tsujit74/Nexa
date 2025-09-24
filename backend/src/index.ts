import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import "./utils/postScheduler";
import { runSchedulerNow } from "./utils/postScheduler";

// Import routes
import authRoutes from "./routes/authRoutes";
import socialRoutes from "./routes/socialRoutes";
import chatbotRoutes from "./routes/chatbotRoutes";
import postRoutes from "./routes/postRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

import testGeminiRouter from "./routes/testGemini";



// Import cron jobs
import "./cron/postScheduler";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use("/api", testGeminiRouter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/dashboard", dashboardRoutes);









app.get("/run-scheduler", async (_req, res) => {
  await runSchedulerNow();
  res.send("Scheduler triggered manually!");
});









// Health Check
app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("API is running...");
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start Server
const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  });
