"use client";

import SocialAccounts from "@/components/dashboard/SocialAccount";
import CreatePostForm from "@/components/dashboard/CreatePostForm";
import AllPostsList from "@/components/dashboard/AllPostList";
import PostSchedulerCalendar from "@/components/dashboard/PostSchedulerDashboard";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { PostsProvider } from "@/context/PostContext";

export default function DashboardPage() {
  return (
    <PostsProvider>
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 ml-64 space-y-10">
          {/* Social Accounts */}
          <section id="social">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">Manage Your Social Accounts</h2>
            <SocialAccounts />
          </section>

          {/* All Posts */}
          <section id="allPosts">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">All Posts</h2>
            <AllPostsList />
          </section>

          {/* Scheduler */}
          <section id="scheduler">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">Scheduler Dashboard</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                <PostSchedulerCalendar />
              </div>

              <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
                <CreatePostForm />
              </div>
            </div>
          </section>
        </main>
      </div>
    </PostsProvider>
  );
}
