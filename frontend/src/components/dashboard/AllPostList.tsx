"use client";

import { usePostsContext } from "@/context/PostContext";
import { useState, useEffect, useCallback, useMemo } from "react";
import PostStatusNav from "../PostStatusNav";
import EditPostForm from "@/components/dashboard/EditPostForm";
import { Edit } from "lucide-react";
import { PostType } from "@/lib/posts";

interface Post {
  _id: string;
  content?: string;
  scheduledDate?: string;
  platform?: string;
  status?: "pending" | "posted" | "failed";
}

export default function AllPostsList() {
  const { posts, fetchPosts } = usePostsContext();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "posted" | "failed" | "all">(
    "all"
  );
  const [editPost, setEditPost] = useState<PostType | null>(null);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      await fetchPosts();
    } catch (err) {
      console.error(err);
      setError("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, []);

  const pendingPosts = useMemo(
    () => posts.filter((p) => p.status === "pending"),
    [posts]
  );
  const postedPosts = useMemo(
    () => posts.filter((p) => p.status === "posted"),
    [posts]
  );
  const failedPosts = useMemo(
    () => posts.filter((p) => p.status === "failed"),
    [posts]
  );

  const formatUTC = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });
  };

  const renderPostItem = (post: PostType) => (
    <div
      key={post._id}
      className="border p-3 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2 hover:bg-gray-50 transition"
      aria-label={`Post on ${post.platform} scheduled for ${formatUTC(
        post.scheduledDate
      )}`}
    >
      <div
        className="flex-1 cursor-pointer"
        onClick={() => setSelectedPost(post)}
      >
        <p className="text-gray-800 font-medium break-words">
          {post.content || "No Content"}
        </p>
        <p className="text-sm text-gray-500">
          Scheduled: {formatUTC(post.scheduledDate)}
        </p>
        <p className="text-sm text-gray-500 capitalize">
          Platform: {post.platform || "N/A"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {post.status === "pending" && (
          <button
            className="p-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-800"
            onClick={() => setEditPost(post)}
            aria-label="Edit post"
          >
            <Edit size={18} />
          </button>
        )}
        <span
          className={`px-2 py-1 font-semibold ${
            post.status === "pending"
              ? "bg-yellow-200 text-yellow-800"
              : post.status === "posted"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {post.status || "unknown"}
        </span>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="bg-white p-6 shadow text-gray-600 text-center">
        Loading posts...
      </div>
    );
  if (error)
    return (
      <div className="bg-red-50 p-6 shadow text-red-700 text-center">
        {error}
      </div>
    );
  if (!posts.length)
    return (
      <div className="bg-white p-6 shadow text-gray-600 text-center">
        No posts available. Create a new post to get started.
      </div>
    );

  return (
    <div className="mt-6 space-y-6">
      <PostStatusNav
        pendingCount={pendingPosts.length}
        postedCount={postedPosts.length}
        failedCount={failedPosts.length}
        onFilterChange={(status) => setFilter(status)}
      />

      {filter === "pending" || filter === "all"
        ? pendingPosts.length > 0 && (
            <section id="pendingSection" className="bg-white p-4 shadow">
              <h3 className="text-lg font-semibold mb-3">Pending Posts</h3>
              <div className="space-y-3">
                {pendingPosts.map(renderPostItem)}
              </div>
            </section>
          )
        : null}

      {filter === "posted" || filter === "all"
        ? postedPosts.length > 0 && (
            <section id="postedSection" className="bg-white p-4 shadow">
              <h3 className="text-lg font-semibold mb-3">Posted Posts</h3>
              <div className="space-y-3">{postedPosts.map(renderPostItem)}</div>
            </section>
          )
        : null}

      {filter === "failed" || filter === "all"
        ? failedPosts.length > 0 && (
            <section id="failedSection" className="bg-white p-4 shadow">
              <h3 className="text-lg font-semibold mb-3">Failed Posts</h3>
              <div className="space-y-3">{failedPosts.map(renderPostItem)}</div>
            </section>
          )
        : null}

      {/* Details Modal */}
      {selectedPost && !editPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 shadow-lg w-11/12 md:w-1/2 relative rounded-md">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedPost(null)}
              aria-label="Close post details"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-3">Post Details</h3>
            <p className="mb-2">
              <strong>Content:</strong> {selectedPost.content || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Platform:</strong> {selectedPost.platform || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 font-semibold ${
                  selectedPost.status === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : selectedPost.status === "posted"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {selectedPost.status || "unknown"}
              </span>
            </p>
            <p className="mb-2">
              <strong>Scheduled:</strong>{" "}
              {formatUTC(selectedPost.scheduledDate)}
            </p>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editPost && (
        <EditPostForm onClose={() => setEditPost(null)} post={editPost} />
      )}
    </div>
  );
}
