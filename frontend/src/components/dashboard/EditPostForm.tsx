"use client";

import { useState, useEffect } from "react";
import { PostType } from "@/lib/posts";
import { usePostsContext } from "@/context/PostContext";
import { X } from "lucide-react";

interface EditPostFormProps {
  post: PostType;
  onClose: () => void;
}

export default function EditPostForm({ post, onClose }: EditPostFormProps) {
  const { updatePost } = usePostsContext();
  const [content, setContent] = useState(post.content);
  const [scheduledDate, setScheduledDate] = useState("");
  const [platform, setPlatform] = useState<PostType["platform"]>(post.platform);
  const [saving, setSaving] = useState(false);

  // Initialize scheduledDate in local datetime format
  useEffect(() => {
    if (post.scheduledDate) {
      const dt = new Date(post.scheduledDate);
      const localISO = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setScheduledDate(localISO);
    }
  }, [post.scheduledDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Convert back to UTC ISO string
      const scheduledDateISO = new Date(
        new Date(scheduledDate).getTime() - new Date(scheduledDate).getTimezoneOffset() * 60000
      ).toISOString();

      await updatePost(post._id, { content, scheduledDate: scheduledDateISO, platform });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 shadow-lg w-11/12 md:w-1/2 relative rounded-md">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h3 className="text-xl font-semibold mb-4">Edit Post</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Scheduled Date</label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
              min={new Date().toISOString().slice(0, 16)} // prevent past dates
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as PostType["platform"])}
              className="w-full border rounded px-3 py-2"
            >
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
              <option value="all">All</option>
            </select>
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
              saving ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={saving}
          >
            {saving ? "Updating..." : "Update Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
