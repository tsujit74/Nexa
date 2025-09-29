"use client";

import { useEffect, useCallback } from "react";
import { useSocialAccounts } from "@/hooks/useSocialAccount";
import { useSearchParams, useRouter } from "next/navigation";
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { SocialAccountsType } from "@/lib/social";
import Image from "next/image";

export default function SocialAccounts() {
  const { accounts, fetching, loading, linkAccount, fetchAccounts, error } =
    useSocialAccounts();
  const params = useSearchParams();
  const router = useRouter();

  // Safe useEffect with all dependencies
  const handleLinked = useCallback(() => {
    if (params.get("linked") === "true") {
      fetchAccounts();
      router.replace("/dashboard");
    }
  }, [params, router]);

  useEffect(() => {
    handleLinked();
  }, [handleLinked]);

  const platforms = [
    {
      name: "twitter",
      icon: <FaTwitter className="text-blue-400" size={20} />,
    },
    {
      name: "linkedin",
      icon: <FaLinkedin className="text-blue-700" size={20} />,
    },
    {
      name: "instagram",
      icon: <FaInstagram className="text-pink-500" size={20} />,
    },
  ];

  if (fetching) {
    return (
      <div className="flex justify-center items-center p-8 bg-white  shadow-lg">
        <span className="text-gray-500 text-lg">
          Loading social accounts...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-l-4 border-red-400 rounded shadow">
        <p className="text-red-700 font-medium">Error:</p>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6  space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        Linked Social Accounts
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <div
            key={platform.name}
            className="flex flex-col p-4 border hover:shadow-md transition duration-200"
          >
            {/* Top row: icon left, photo right */}
            <div className="flex justify-between items-start">
              {/* Icon on top-left */}
              <div className="flex-shrink-0">{platform.icon}</div>

              {/* Photo on top-right */}
              {accounts?.[platform.name as keyof SocialAccountsType] &&
                platform.name === "linkedin" &&
                accounts.linkedin?.photo && (
                  <Image
                    src={accounts.linkedin.photo}
                    alt={accounts.linkedin.name || "Profile Picture"}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                )}
            </div>

            {/* Name & Email centered below top row */}
            <div className="flex flex-col items-center mt-4">
              {accounts?.[platform.name as keyof SocialAccountsType] &&
                platform.name === "linkedin" &&
                accounts.linkedin?.name && (
                  <p className="font-medium text-gray-700">
                    {accounts.linkedin.name}
                  </p>
                )}
              {accounts?.[platform.name as keyof SocialAccountsType] &&
                platform.name === "linkedin" &&
                accounts.linkedin?.email && (
                  <p className="text-sm text-gray-500">
                    {accounts.linkedin.email}
                  </p>
                )}
            </div>

            {/* Bottom: Linked badge or button */}
            {/* Bottom: Linked badge or button */}
            <div className="flex justify-center mt-4">
              {accounts?.[platform.name as keyof SocialAccountsType] ? (
                <span className="text-green-600 font-semibold bg-green-100 px-4 py-1 rounded text-sm">
                  Linked
                </span>
              ) : (
                <button
                  disabled={loading} // only disable while loading
                  onClick={() => linkAccount(platform.name)}
                  className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 shadow-sm text-sm font-medium disabled:opacity-50`}
                >
                  {loading ? "Linking..." : "Link Account"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!accounts || Object.keys(accounts).length === 0 ? (
        <p className="text-gray-500 text-sm mt-4">
          You have not linked any accounts yet. Click &quot;Link Account&quot;
          to start posting.
        </p>
      ) : null}
    </div>
  );
}
