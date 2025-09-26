"use client";

import React, { useState, useEffect } from "react";

export type PostFilterStatus = "pending" | "posted" | "failed" | "all";

interface PostStatusNavProps {
  pendingCount?: number;
  postedCount?: number;
  failedCount?: number;
  onFilterChange?: (status: PostFilterStatus) => void;
  defaultFilter?: PostFilterStatus;
  showCounts?: boolean; // optional flag
}

export default function PostStatusNav({
  pendingCount = 0,
  postedCount = 0,
  failedCount = 0,
  onFilterChange,
  defaultFilter = "all",
  showCounts = true,
}: PostStatusNavProps) {
  const [activeFilter, setActiveFilter] = useState<PostFilterStatus>(defaultFilter);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(activeFilter);
    }
  }, [activeFilter, onFilterChange]);

  const handleFilterClick = (status: PostFilterStatus) => {
    setActiveFilter(status);
  };

  const getButtonClasses = (status: PostFilterStatus) =>
    `px-4 py-2 font-semibold transition ${
      activeFilter === status
        ? "bg-blue-500 text-white"
        : status === "pending"
        ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
        : status === "posted"
        ? "bg-green-200 text-green-800 hover:bg-green-300"
        : status === "failed"
        ? "bg-red-200 text-red-800 hover:bg-red-300"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
    }`;

  return (
    <div className="flex gap-4 flex-wrap mb-4">
      <button className={getButtonClasses("pending")} onClick={() => handleFilterClick("pending")}>
        Pending {showCounts && `(${pendingCount})`}
      </button>
      <button className={getButtonClasses("posted")} onClick={() => handleFilterClick("posted")}>
        Posted {showCounts && `(${postedCount})`}
      </button>
      <button className={getButtonClasses("failed")} onClick={() => handleFilterClick("failed")}>
        Failed {showCounts && `(${failedCount})`}
      </button>
      <button className={getButtonClasses("all")} onClick={() => handleFilterClick("all")}>
        All {showCounts && `(${pendingCount + postedCount + failedCount})`}
      </button>
    </div>
  );
}
