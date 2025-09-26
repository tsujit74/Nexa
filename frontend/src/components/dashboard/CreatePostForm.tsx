"use client";

import { useState } from "react";
import { usePostsContext } from "@/context/PostContext";
import { useToast } from "@/context/ToastContext";

export default function CreatePostForm() {
  const { createPost } = usePostsContext();
  const { showToast } = useToast();

  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [platform, setPlatform] = useState<"twitter" | "linkedin" | "instagram" | "all">("twitter");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!content.trim() || !scheduledDate) {
      showToast({ message: "Please fill all fields", type: "error" });
      return;
    }

    const selectedDate = new Date(scheduledDate);
    if (isNaN(selectedDate.getTime())) {
      showToast({ message: "Invalid date format", type: "error" });
      return;
    }

    if (selectedDate <= new Date()) {
      showToast({ message: "Scheduled date must be in the future", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const utcDateISO = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      ).toISOString();

      await createPost({
        content,
        scheduledDate: utcDateISO,
        type: "static",
        platform,
      });

      setContent("");
      setScheduledDate("");
      setPlatform("twitter");

      showToast({ message: "Post scheduled successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      showToast({ message: "Failed to schedule post. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Create New Post</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Content */}
        <textarea
          placeholder="Write your post..."
          className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
        />

        {/* Schedule Date */}
        <label className="flex flex-col gap-1">
          <span className="text-gray-700 font-medium">Schedule Date & Time</span>
          <input
            type="datetime-local"
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={scheduledDate}
            min={new Date().toISOString().slice(0, 16)}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
          />
        </label>

        {/* Platform */}
        <label className="flex flex-col gap-1">
          <span className="text-gray-700 font-medium">Select Platform</span>
          <select
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={platform}
            onChange={(e) =>
              setPlatform(e.target.value as "twitter" | "linkedin" | "instagram" | "all")
            }
          >
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="instagram">Instagram</option>
            <option value="all">All Platforms</option>
          </select>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50 transition"
        >
          {loading ? "Scheduling..." : "Schedule Post"}
        </button>
      </form>
    </div>
  );
}
