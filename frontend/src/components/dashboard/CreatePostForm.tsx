"use client";

import { useState, useEffect } from "react";
import { usePostsContext } from "@/context/PostContext";
import { useToast } from "@/context/ToastContext";
import { useSocialAccounts } from "@/hooks/useSocialAccount";
import { AxiosError } from "axios";

interface CreatePostFormProps {
  initialContent?: string;
}

export default function CreatePostForm({
  initialContent = "",
}: CreatePostFormProps) {
  const { createPost, postImmediately } = usePostsContext(); // <-- include immediate post
  const { showToast } = useToast();
  const { accounts } = useSocialAccounts();

  const [content, setContent] = useState(initialContent);
  const [scheduledDate, setScheduledDate] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<
    ("twitter" | "linkedin" | "instagram")[]
  >([]);
  const [loading, setLoading] = useState(false);

  const allPlatforms: ("twitter" | "linkedin" | "instagram")[] = [
    "twitter",
    "linkedin",
    "instagram",
  ];

  useEffect(() => {
    setContent(initialContent);
    setSelectedPlatforms([]);
  }, [initialContent, accounts]);

  const handlePlatformToggle = (
    platform: "twitter" | "linkedin" | "instagram"
  ) => {
    if (!accounts?.[platform]) return;
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

 const handleSubmit = async (instant = false) => {
  if (!content.trim()) {
    showToast({ message: "Post content cannot be empty", type: "error" });
    return;
  }

  if (selectedPlatforms.length === 0) {
    showToast({
      message: "Please select at least one platform",
      type: "error",
    });
    return;
  }

  setLoading(true);

  const extractBackendMessage = (err: unknown, fallbackMessage: string) => {
    if (err instanceof AxiosError) {
      return err.response?.data?.message || fallbackMessage;
    } else if (err instanceof Error) {
      return err.message;
    }
    return fallbackMessage;
  };

  try {
    if (instant) {
      await Promise.all(
        selectedPlatforms.map((p) =>
          postImmediately({ content, platform: p })
        )
      );
      showToast({ message: "Posted successfully!", type: "success" });
    } else {
      if (!scheduledDate) {
        showToast({
          message: "Please select a schedule date & time",
          type: "error",
        });
        setLoading(false);
        return;
      }

      const scheduledDateISO = new Date(
        new Date(scheduledDate).getTime() -
          new Date(scheduledDate).getTimezoneOffset() * 60000
      ).toISOString();

      await Promise.all(
        selectedPlatforms.map((p) =>
          createPost({
            content,
            scheduledDate: scheduledDateISO,
            type: "static",
            platform: p,
          })
        )
      );

      showToast({ message: "Post scheduled successfully!", type: "success" });
    }

    // Reset form
    setContent("");
    setScheduledDate("");
    setSelectedPlatforms([]);
  } catch (err: unknown) {
    const message = extractBackendMessage(err, "Failed to create post. Please try again.");
    showToast({ message, type: "error" });
    console.error("Post creation error:", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="bg-white p-6 w-full">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">
        Create New Post
      </h3>

      <div className="flex flex-col gap-4">
        <textarea
          placeholder="Write your post or edit chatbot content..."
          className="border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />

        <div className="flex flex-col gap-1">
          <span className="text-gray-700 font-medium">Select Platform(s)</span>
          <div className="flex gap-2 flex-wrap">
            {allPlatforms.map((platform) => {
              const isLinked = !!accounts?.[platform];
              const isSelected = selectedPlatforms.includes(platform);
              return (
                <button
                  key={platform}
                  type="button"
                  disabled={!isLinked}
                  onClick={() => handlePlatformToggle(platform)}
                  className={`px-3 py-1 font-medium border transition relative ${
                    isLinked
                      ? isSelected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                      : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                  title={
                    !isLinked
                      ? `Please link your ${platform} account first`
                      : ""
                  }
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-gray-700 font-medium">
            Schedule Date & Time
          </span>
          <input
            type="datetime-local"
            className="border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={scheduledDate}
            min={new Date().toISOString().slice(0, 16)}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
        </label>

        <div className="flex gap-2">
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 flex-1 disabled:opacity-50 transition"
          >
            {loading ? "Scheduling..." : "Schedule Post"}
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 flex-1 disabled:opacity-50 transition"
          >
            {loading ? "Posting..." : "Post Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
