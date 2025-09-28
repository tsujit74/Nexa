import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/context/ToastContext";
import * as postsApi from "@/lib/posts";
import { PostType } from "@/lib/posts";
import { AxiosError } from "axios";

export function usePosts() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await postsApi.getPosts();
      setPosts(res);
    } catch (err: unknown) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || "Failed to load posts"
          : "Failed to load posts";
      showToast({ message, type: "error" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const handleApiError = (err: unknown, fallback: string) => {
    const message =
      err instanceof AxiosError
        ? err.response?.data?.message || fallback
        : err instanceof Error
        ? err.message
        : fallback;
    showToast({ message, type: "error" });
  };

  const createPost = async (data: Omit<PostType, "_id" | "status">) => {
    const tempPost: PostType = {
      ...data,
      _id: "temp-" + Date.now(),
      status: "pending",
    };
    setPosts((prev) => [tempPost, ...prev]);

    try {
      const newPost = await postsApi.createPost(data);
      setPosts((prev) =>
        prev.map((p) => (p._id === tempPost._id ? newPost : p))
      );
      showToast({ message: "Post created successfully!", type: "success" });
      return newPost;
    } catch (err) {
      setPosts((prev) => prev.filter((p) => p._id !== tempPost._id));
      handleApiError(err, "Failed to create post");
      throw err;
    }
  };

  const updatePost = async (id: string, data: Partial<PostType>) => {
    try {
      const updated = await postsApi.updatePost(id, data);
      setPosts((prev) => prev.map((p) => (p._id === id ? updated : p)));
      showToast({ message: "Post updated successfully", type: "success" });
      return updated;
    } catch (err) {
      handleApiError(err, "Failed to update post");
      throw err;
    }
  };

  const deletePost = async (id: string) => {
    try {
      await postsApi.deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      showToast({ message: "Post deleted successfully", type: "success" });
    } catch (err) {
      handleApiError(err, "Failed to delete post");
      throw err;
    }
  };

  const postImmediately = async (data: {
    content: string;
    platform: "twitter" | "linkedin" | "instagram";
  }) => {
    const tempPost: PostType = {
      _id: "temp-" + Date.now(),
      content: data.content,
      type: "static",
      platform: data.platform,
      scheduledDate: new Date().toISOString(),
      status: "pending",
    };
    setPosts((prev) => [tempPost, ...prev]);

    try {
      const newPost = await postsApi.immediatePost(data);
      setPosts((prev) =>
        prev.map((p) => (p._id === tempPost._id ? newPost : p))
      );
      showToast({
        message: `Posted to ${data.platform} successfully!`,
        type: "success",
      });
      return newPost;
    } catch (err) {
      setPosts((prev) => prev.filter((p) => p._id !== tempPost._id));
      handleApiError(err, `Failed to post to ${data.platform}`);
      throw err;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    setPosts,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    postImmediately,
    loading,
  };
}
