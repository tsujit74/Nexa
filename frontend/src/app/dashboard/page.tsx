"use client";

import { Suspense, useState } from "react";
import SocialAccounts from "@/components/dashboard/SocialAccount";
import CreatePostForm from "@/components/dashboard/CreatePostForm";
import AllPostsList from "@/components/dashboard/AllPostList";
import PostSchedulerCalendar from "@/components/dashboard/PostSchedulerDashboard";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { PostsProvider } from "@/context/PostContext";
import Chatbot from "@/components/dashboard/Chatbot";
import FloatingChatbot from "@/components/dashboard/FlaotingChatbot";

export default function DashboardPage() {
  const [generatedContent, setGeneratedContent] = useState("");

  return (
    <PostsProvider>
      <div className="min-h-screen flex bg-gray-100">
        <DashboardSidebar />

        <main className="flex-1 p-8 ml-64 space-y-10">
          <section id="social">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">
              Manage Your Social Accounts
            </h2>
            <Suspense fallback={<div>Loading social accounts...</div>}>
              <SocialAccounts />
            </Suspense>
          </section>

          <section id="allPosts">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">
              All Posts
            </h2>
            <AllPostsList />
          </section>

          <section id="scheduler">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">
              Scheduler Dashboard
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                <PostSchedulerCalendar />
              </div>

              <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
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
