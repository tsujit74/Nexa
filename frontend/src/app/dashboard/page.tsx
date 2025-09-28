"use client";

import { Suspense, useState } from "react";
import SocialAccounts from "@/components/dashboard/SocialAccount";
import CreatePostForm from "@/components/dashboard/CreatePostForm";
import AllPostsList from "@/components/dashboard/AllPostList";
import PostSchedulerCalendar from "@/components/dashboard/PostSchedulerDashboard";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { PostsProvider } from "@/context/PostContext";
import FloatingChatbot from "@/components/dashboard/FlaotingChatbot";
import { useAuthContext } from "@/context/AuthContext";  
import AuthPage from "@/components/auth/page";       
export default function DashboardPage() {
  const [generatedContent, setGeneratedContent] = useState("");
  const { token, loading } = useAuthContext();

  // While checking session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking session...</p>
      </div>
    );
  }

  // If user not logged in → show AuthForm
  if (!token) {
    return (
      <div className="min-h-screen flex bg-gray-100">
        <DashboardSidebar />
        <main className="flex-1  items-center justify-center">
          <AuthPage />
        </main>
      </div>
    );
  }

  // Normal dashboard when logged in
  return (
    <PostsProvider>
      <div className="min-h-screen flex bg-gray-100">
        <DashboardSidebar />

        <main className="flex-1 p-8 ml-80 space-y-10">
          {/* Social Accounts */}
          <section id="social">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">
              Manage Your Social Accounts
            </h2>
            <Suspense fallback={<div>Loading social accounts...</div>}>
              <SocialAccounts />
            </Suspense>
          </section>

          {/* All Posts */}
          <section id="allPosts">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">
              All Posts
            </h2>
            <AllPostsList />
          </section>

          {/* Scheduler */}
          <section id="scheduler">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">
              Scheduler Dashboard
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 bg-white p-6 ">
                <PostSchedulerCalendar />
              </div>

              <div className="w-full md:w-1/3 bg-white p-6 ">
                <CreatePostForm initialContent={generatedContent} />
              </div>
            </div>
          </section>


          <FloatingChatbot onGenerate={(text) => setGeneratedContent(text)} />
        </main>
      </div>
    </PostsProvider>
  );
}
