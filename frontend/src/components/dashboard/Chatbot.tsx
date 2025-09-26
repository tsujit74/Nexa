"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";

interface ChatbotProps {
  onGenerate?: (text: string) => void;
}

export default function Chatbot({ onGenerate }: ChatbotProps) {
  const { messages, loading, sendMessage } = useChat();
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      const aiText = await sendMessage(input) || "";
      if (onGenerate) onGenerate(aiText) ;
    } catch (err) {
      console.error(err);
    }
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.role === "user" ? "ml-auto bg-blue-500 text-white" : "mr-auto bg-gray-200 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <p className="text-gray-500 italic">Thinking...</p>}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border rounded-lg p-2"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
