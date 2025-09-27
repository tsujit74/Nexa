import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/context/ToastContext";
import * as postsApi from "@/lib/posts";
import { PostType } from "@/lib/posts";

export function usePosts() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await postsApi.getPosts();
      setPosts(res);
    } catch (err) {
      console.error(err);
      showToast({ message: "Failed to load posts", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [showToast]); 

  const createPost = async (data: Omit<PostType, "_id" | "status">) => {
    const tempPost: PostType = {
      ...data,
      _id: "temp-" + Date.now(),
      status: "pending",
    };
    setPosts(prev => [tempPost, ...prev]);

    try {
      const newPost = await postsApi.createPost(data);
      setPosts(prev => prev.map(p => (p._id === tempPost._id ? newPost : p)));
      showToast({ message: "Post created successfully!", type: "success" });
      return newPost;
    } catch (err) {
      setPosts(prev => prev.filter(p => p._id !== tempPost._id));
      showToast({ message: "Failed to create post", type: "error" });
      throw err;
    }
  };

  const updatePost = async (id: string, data: Partial<PostType>) => {
    try {
      const updated = await postsApi.updatePost(id, data);
      setPosts(prev => prev.map(p => (p._id === id ? updated : p)));
      showToast({ message: "Post updated successfully", type: "success" });
      return updated;
    } catch (err) {
      console.error(err);
      showToast({ message: "Failed to update post", type: "error" });
      throw err;
    }
  };

  const deletePost = async (id: string) => {
    try {
      await postsApi.deletePost(id);
      setPosts(prev => prev.filter(p => p._id !== id));
      showToast({ message: "Post deleted successfully", type: "success" });
    } catch (err) {
      console.error(err);
      showToast({ message: "Failed to delete post", type: "error" });
      throw err;
    }
  };

 
  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, setPosts, fetchPosts, createPost, updatePost, deletePost, loading };
}
