// src/hooks/useChat.ts
"use client";

import { useState } from "react";
import { sendChatMessage, ChatMessage } from "@/lib/chat";

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);
    try {
      const aiText = await sendChatMessage(text);
      const aiMsg: ChatMessage = { role: "ai", text: aiText };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Error getting response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage };
};
