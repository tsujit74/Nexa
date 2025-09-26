// src/lib/auth.ts
import api from "./api";

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", { email, password });
  return res.data;
};

export const signup = async (
  name: string,
  email: string,
  password: string
): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/signup", { name, email, password });
  return res.data;
};

// Pass token here for authorization
export const getProfile = async (token: string) => {
  const res = await api.get<{ id: string; name: string; email: string }>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const logout = async () => {
  localStorage.removeItem("token");
};
