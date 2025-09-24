import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// REST API route test
router.get("/test-gemini", async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Hello Gemini, how are you?" }] }],
        }),
      }
    );

    const data = await response.json();
    res.json({ apiResponse: data });
  } catch (err) {
    console.error("Error calling Gemini API:", err);
    res.status(500).json({ error: "Gemini API call failed" });
  }
});

const key = process.env.GEMINI_API_KEY;

if (!key) {
  throw new Error("❌ GEMINI_API_KEY is missing in .env");
}







export default router;
