import React from "react";
import DashboardPage from "./dashboard/page";
import AuthGuard from "@/components/AuthGaurd";

function page() {
  return (
    <div>
      <AuthGuard>
        <DashboardPage />
      </AuthGuard>
    </div>
  );
}

export default page;
