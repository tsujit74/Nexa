// src/hooks/useAuth.ts
import { useAuthContext } from "@/context/AuthContext";

export const useAuth = () => {
  const { user, loading, login, signup, logout } = useAuthContext();
  return { user, loading, login, signup, logout, isAuthenticated: !!user };
};
