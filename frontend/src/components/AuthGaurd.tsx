"use client";

import { ReactNode, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import DashboardSidebar from "./dashboard/DashboardSidebar";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/dashboard");
    }
  }, [loading, user, router]);

  if (loading) return <div><DashboardSidebar/> <p className="text-center">Loading...</p></div>;

  return <>{children}</>;
}
