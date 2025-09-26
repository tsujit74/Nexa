"use client";

import SocialAccounts from "@/components/dashboard/SocialAccount";

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Settings</h1>
      </header>

      <main className="flex-1 p-6 bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Manage Social Accounts</h2>
        <p className="text-gray-700 mb-6">
          Link your social accounts to enable posting and integrations.
        </p>

        <SocialAccounts />
      </main>
    </div>
  );
}
