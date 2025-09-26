// src/lib/posts.ts
import { get, post, put, del } from "./api";

export interface PostType {
  _id: string;
  content: string;
  type: "dynamic" | "static";
  scheduledDate: string;
  status: "pending" | "posted" | "failed";
  platform: "twitter" | "linkedin" | "instagram" | "all";
}

export const createPost = async (data: Omit<PostType, "_id" | "status">) => {
  return post<PostType>("/posts", data);
};

export const getPosts = async () => {
  return get<PostType[]>("/posts");
};

export const updatePost = async (id: string, data: Partial<PostType>) => {
  return put<PostType>(`/posts/${id}`, data);
};

export const deletePost = async (id: string) => {
  return del<{ success: boolean }>(`/posts/${id}`);
};

