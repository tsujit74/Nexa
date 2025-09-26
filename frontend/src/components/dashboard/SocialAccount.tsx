"use client";
import { useEffect } from "react";
import { useSocialAccounts } from "@/hooks/useSocialAccount";
import { useSearchParams, useRouter } from "next/navigation";

export default function SocialAccounts() {
  const { accounts, fetching, loading, linkAccount, fetchAccounts, error } = useSocialAccounts();
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (params.get("linked") === "true") {
      fetchAccounts();
      router.replace("/dashboard"); // remove query param after refreshing
    }
  }, [params]);

  if (fetching) {
    return (
      <div className="bg-white p-4 rounded shadow text-gray-600">
        Loading social accounts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded shadow text-red-500">
        Failed to load social accounts. Please try again later.
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Linked Social Accounts</h3>

      {["twitter", "linkedin", "instagram"].map((platform) => (
        <div
          key={platform}
          className="flex justify-between items-center p-2 border rounded mb-2"
        >
          <span className="capitalize">{platform}</span>

          {accounts?.[platform] ? (
            <span className="text-green-600 font-semibold">Linked</span>
          ) : (
            <button
              disabled={loading}
              onClick={() => linkAccount(platform)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Linking..." : "Link"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
