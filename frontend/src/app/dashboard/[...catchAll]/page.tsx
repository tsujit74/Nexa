"use client";

import AuthGuard from "@/components/AuthGaurd";
import DashboardNotFound from "@/components/dashboard/DashbaordNotFound";

export default function DashboardCatchAll() {
  return (
    <AuthGuard>
      <DashboardNotFound />
    </AuthGuard>
  );
}
