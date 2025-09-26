"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/dashboard");
    }
  }, [loading, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
