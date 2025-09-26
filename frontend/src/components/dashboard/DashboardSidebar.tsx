"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, JSX } from "react";
import { Calendar, List, LogOut, User as UserIcon, LogIn } from "lucide-react";

interface Section {
  id: string;
  label: string;
  icon: JSX.Element;
}

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>("social");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/dashboard");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Something went wrong while logging out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const sections: Section[] = useMemo(
    () => [
      { id: "social", label: "Social Accounts", icon: <UserIcon size={18} /> },
      { id: "allPosts", label: "All Posts", icon: <List size={18} /> },
      { id: "scheduler", label: "Scheduler", icon: <Calendar size={18} /> },
    ],
    []
  );

  useEffect(() => {
    if (!user) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections, user]);

  return (
    <aside className="w-64 bg-white border-r shadow-sm flex flex-col fixed h-full">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-blue-600 tracking-tight">
          Dashboard
        </h1>
      </div>

      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
            {user?.name?.[0]?.toUpperCase() || "G"}
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {user?.name || "Guest User"}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {user?.email || "Not logged in"}
            </p>
          </div>
        </div>

        {user ? (
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            <LogOut size={16} />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        ) : (
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            <LogIn size={16} />
            Login
          </button>
        )}
      </div>

      {user ? (
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          {sections.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() =>
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
              }
              className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium transition ${
                activeSection === id
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </nav>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm p-4">
          Please login to access dashboard features
        </div>
      )}

      <div className="p-4 border-t text-xs text-gray-400 text-center">
        © {new Date().getFullYear()} Sujit Thakur
      </div>
    </aside>
  );
}
