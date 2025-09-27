import axios, { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;
    }
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API response error:", error.response.data || error.response.statusText);
      return Promise.reject(error.response.data || { message: "Something went wrong" });
    } else if (error.request) {
      // Request made but no response received
      console.error("API request error:", error.request);
      return Promise.reject({ message: "No response from server" });
    } else {
      // Something else happened
      console.error("API error:", error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// GET request
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.get<T>(url, config);
  return response.data;
};

// POST request
export const post = async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.post<T>(url, data, config);
  return response.data;
};

// PUT request
export const put = async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.put<T>(url, data, config);
  return response.data;
};

// DELETE request
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.delete<T>(url, config);
  return response.data;
};

export default api;
