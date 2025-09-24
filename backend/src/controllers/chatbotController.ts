import { Request, Response } from "express";
import ChatbotSession from "../models/ChatbotSession";
import { generateAIContent } from "../utils/aiClient";

export const sendMessage = async (req: Request, res: Response) => {
 const userId = (req as any).user?.id || "68d167735dd40267a71c9310"; // dummy user ID

  const { message, mode = "default" } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID not found. Make sure you are authenticated." });
  }

  try {
    let session = await ChatbotSession.findOne({ userId });
    if (!session) {
      session = await ChatbotSession.create({ userId, context: [] });
    }

    const aiResponse = await generateAIContent(session.context, message, mode);

    session.context.push({ user: message, ai: aiResponse });
    if (session.context.length > 20) session.context = session.context.slice(-20);
    await session.save();

    res.status(200).json({
      success: true,
      response: aiResponse,
      contextLength: session.context.length,
    });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ success: false, message: "Error generating AI response" });
  }
};
