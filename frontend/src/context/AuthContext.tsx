"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

interface UserType {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: UserType | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      setToken(storedToken);

      try {
        const profile = await authApi.getProfile(storedToken);
        setUser(profile);
      } catch (err: any) {
        console.error("Failed to load profile:", err);
        showToast({ message: "Session expired. Please log in again.", type: "error" });
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
      showToast({ message: "Welcome back! 🎉", type: "success" });
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      showToast({
        message: err?.response?.data?.message || "Invalid email or password.",
        type: "error",
      });
      throw err;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await authApi.signup(name, email, password);
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
      showToast({ message: "Account created successfully 🎉", type: "success" });
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Signup failed:", err);
      showToast({
        message: err?.response?.data?.message || "Signup failed. Try again.",
        type: "error",
      });
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    showToast({ message: "Logged out successfully 👋", type: "success" });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return ctx;
};
