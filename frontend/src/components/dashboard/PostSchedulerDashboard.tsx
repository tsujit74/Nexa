"use client";

import FullCalendar from "@fullcalendar/react";
import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { usePostsContext } from "@/context/PostContext";

interface Post {
  _id: string;
  content: string;
  status: "pending" | "posted" | "failed";
  platform: string;
  scheduledDate: string;
}

export default function PostSchedulerCalendar() {
  const { posts } = usePostsContext();
  const [events, setEvents] = useState<EventInput[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    "pending" | "posted" | "failed" | "all"
  >("all");

  const [selectedPost, setSelectedPost] = useState<{
    content: string;
    status: string;
    platform: string;
    time: string;
  } | null>(null);

  const filteredPosts = useMemo(
    () =>
      selectedStatus === "all"
        ? posts
        : posts.filter((post) => post.status === selectedStatus),
    [posts, selectedStatus]
  );

  useEffect(() => {
    const mapped = filteredPosts.map((post: Post) => ({
      id: post._id,
      title: `${(post.platform || "ALL").toUpperCase()} - ${
        (post.content || "").slice(0, 30) + ((post.content||"").length > 30 ? "..." : "")
      }`,

      start: post.scheduledDate,
      color:
        post.status === "posted"
          ? "#16a34a"
          : post.status === "failed"
          ? "#dc2626"
          : "#f59e0b",
      extendedProps: {
        content: post.content,
        status: post.status,
        platform: post.platform,
        time: new Date(post.scheduledDate).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      },
    }));

    setEvents(mapped);
  }, [filteredPosts]);

  return (
    <div className="bg-white p-6  mt-6">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">
        Post Scheduler
      </h3>

      <div className="flex gap-4 mb-6 flex-wrap">
        {(["all", "pending", "posted", "failed"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2  font-semibold ${
              selectedStatus === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
            {status !== "all" &&
              `(${posts.filter((p) => p.status === status).length})`}
          </button>
        ))}
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        events={events}
        height={600}
        timeZone="Asia/Kolkata"
        eventClick={(info) => {
          const p = info.event.extendedProps as {
            content: string;
            status: string;
            platform: string;
            time: string;
          };
          setSelectedPost({
            content: p.content,
            status: p.status,
            platform: p.platform,
            time: p.time,
          });
        }}
      />

      {selectedPost && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white  w-96 p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedPost(null)}
              aria-label="Close post details"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              {selectedPost.platform.toUpperCase()} Post Details
            </h3>

            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Content:</strong> {selectedPost.content || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    selectedPost.status === "posted"
                      ? "text-green-600"
                      : selectedPost.status === "failed"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {selectedPost.status.toUpperCase()}
                </span>
              </p>
              <p className="text-gray-700">
                <strong>Scheduled:</strong> {selectedPost.time}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
