"use client";

import { useState, useRef } from "react";
import Chatbot from "./Chatbot";
import { FaRobot, FaTimes } from "react-icons/fa";

interface FloatingChatbotProps {
  onGenerate: (text: string) => void;
}

export default function FloatingChatbot({ onGenerate }: FloatingChatbotProps) {
  const [open, setOpen] = useState(false);

  // Position state
  const [position, setPosition] = useState({
    x: window.innerWidth - 100,
    y: window.innerHeight - 100,
  });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  // Add/remove event listeners
  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center z-50"
          title="Open Chatbot"
        >
          <FaRobot size={24} />
        </button>
      )}

      {open && (
        <div
          className="fixed w-80 h-96 bg-white border rounded-lg shadow-lg flex flex-col z-50 cursor-move"
          style={{ left: position.x, top: position.y }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center p-3 border-b bg-blue-50 cursor-move"
            onMouseDown={handleMouseDown}
          >
            <h3 className="font-semibold text-gray-800">Chatbot</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              <FaTimes />
            </button>
          </div>

          {/* Chat content */}
          <div className="flex-1 p-3 overflow-y-auto">
            <Chatbot onGenerate={onGenerate} />
          </div>
        </div>
      )}
    </>
  );
}
