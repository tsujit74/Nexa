// src/hooks/usePosts.ts
"use client";

import { useState, useEffect } from "react";
import * as postsApi from "../lib/posts";
import { PostType } from "../lib/posts";

export function usePosts() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const res = await postsApi.getPosts();
    setPosts(res);
    setLoading(false);
  };

  const createPost = async (data: Omit<PostType, "_id" | "status">) => {
    const newPost = await postsApi.createPost(data);
    setPosts((prev) => [...prev, newPost]);
    return newPost;
  };

  const updatePost = async (id: string, data: Partial<PostType>) => {
    const updated = await postsApi.updatePost(id, data);
    setPosts((prev) => prev.map((p) => (p._id === id ? updated : p)));
    return updated;
  };

  const deletePost = async (id: string) => {
    await postsApi.deletePost(id);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, fetchPosts, createPost, updatePost, deletePost };
}
