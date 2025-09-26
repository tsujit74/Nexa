"use client";

import { createContext, useContext, ReactNode } from "react";
import { usePosts } from "@/hooks/usePost";

const PostsContext = createContext<ReturnType<typeof usePosts> | null>(null);

export function PostsProvider({ children }: { children: ReactNode }) {
  const postsData = usePosts();
  return <PostsContext.Provider value={postsData}>{children}</PostsContext.Provider>;
}

export function usePostsContext() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePostsContext must be used within PostsProvider");
  return ctx;
}
