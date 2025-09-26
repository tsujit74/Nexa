// src/lib/api.ts
import axios, { AxiosRequestConfig } from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

// Add token to every request if available
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// GET request
export const get = async <T>(url: string, config?: AxiosRequestConfig) => {
  const response = await api.get<T>(url, config);
  return response.data;
};

// POST request
export const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
  const response = await api.post<T>(url, data, config);
  return response.data;
};

// PUT request
export const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
  const response = await api.put<T>(url, data, config);
  return response.data;
};

// DELETE request
export const del = async <T>(url: string, config?: AxiosRequestConfig) => {
  const response = await api.delete<T>(url, config);
  return response.data;
};

export default api;
