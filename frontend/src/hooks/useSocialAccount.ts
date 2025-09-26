import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { getSocialAccounts, startSocialOAuth } from "@/lib/social";
import { useAuthContext } from "@/context/AuthContext";

export const useSocialAccounts = () => {
  const [accounts, setAccounts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();
  const { loading: authLoading, user, token } = useAuthContext();

  // Fetch linked social accounts
  const fetchAccounts = async () => {
    if (!token) {
      setError("No authentication token found");
      setFetching(false);
      return;
    }

    setFetching(true);
    setError(null);

    try {
      const data = await getSocialAccounts(token);
      setAccounts(data || {});
    } catch (err: any) {
      console.error("Fetch accounts error:", err);
      setError("Failed to load accounts");
      showToast({ message: "Failed to load linked accounts", type: "error" });
    } finally {
      setFetching(false);
    }
  };

  // Link a social account
  const linkAccount = async (platform: string) => {
    if (!token) {
      showToast({ message: "Authentication required", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const url = await startSocialOAuth(platform);
      if (url) {
        // Redirect user to social OAuth login
        window.location.href = url;
        console.log(window.location.href)
      } else {
        throw new Error("No OAuth URL received");
      }
    } catch (err: any) {
      console.error("Link account error:", err);
      showToast({
        message: err?.message || "Failed to start OAuth flow",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch accounts after auth & user load
  useEffect(() => {
    if (!authLoading && user && token) {
      fetchAccounts();
    } else if (!user && !authLoading) {
      setFetching(false);
    }
  }, [authLoading, user, token]);

  return {
    accounts,
    fetching,
    loading,
    linkAccount,
    fetchAccounts,
    error,
  };
};
