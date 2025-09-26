"use client";

import { useAuth } from "@/hooks/useAuth";
import DashboardNotFound from "@/components//dashboard/DashbaordNotFound";
import AuthGuard from "@/components/AuthGaurd";

export default function DashboardCatchAll() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Checking session...</p>
      </div>
    );
  }

 
  if (!user) {
    return <AuthGuard children={undefined} />;
  }


  return <DashboardNotFound children={undefined} />;
}
