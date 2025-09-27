"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/context/ToastContext";
import { getSocialAccounts, startSocialOAuth } from "@/lib/social";
import { useAuthContext } from "@/context/AuthContext";

export const useSocialAccounts = () => {
  const { showToast } = useToast();
  const { loading: authLoading, user, token } = useAuthContext();

  const [accounts, setAccounts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
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
      showToast({ message: "Accounts loaded successfully", type: "success" });
    } catch (err: unknown) {
      console.error("Fetch accounts error:", err);
      setError("Failed to load accounts");
      showToast({ message: "Failed to load linked accounts", type: "error" });
    } finally {
      setFetching(false);
    }
  }, [token, showToast]);

  const linkAccount = async (platform: string, onLinked?: () => void) => {
    if (!token) {
      showToast({ message: "Authentication required", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const url = await startSocialOAuth(platform);
      if (url) {
        showToast({ message: `Redirecting to ${platform}...`, type: "success" });
        window.location.href = url;
      }
      if (onLinked) onLinked();
    } catch (err: unknown) {
      console.error(err);
      showToast({ message: `Failed to link ${platform} account`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user && token) {
      fetchAccounts();
    } else if (!user && !authLoading) {
      setFetching(false);
    }
  }, [authLoading, user, token, fetchAccounts]);

  return {
    accounts,
    fetching,
    loading,
    linkAccount,
    fetchAccounts,
    error,
  };
};
