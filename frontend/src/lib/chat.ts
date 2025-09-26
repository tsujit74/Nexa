// src/lib/chat.ts
import { post } from "./api";

export interface ChatResponse {
  success: boolean;
  response: string;
  contextLength: number;
}

export interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

export const sendChatMessage = async (
  message: string,
  mode: "default" | "short" | "professional" = "default"
): Promise<string> => {
  const res = await post<ChatResponse>("/chatbot/message", { message, mode });
  return res.response;
};
