// pages/privacy.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <ShieldCheck size={24} aria-hidden="true" /> 
            <span>Nexa</span>
          </h1>
          <nav>
            <Link
              href="/dashboard"
              className="text-indigo-600 hover:underline font-medium"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto p-8 space-y-8">
        <h2 className="text-3xl font-semibold border-b pb-2">Privacy Policy</h2>

        <p className="text-gray-700 leading-relaxed">
          At Nexa, protecting your privacy is our top priority. This Privacy
          Policy explains how we collect, store, and use your personal
          information to provide and enhance our services.
        </p>

        <section className="space-y-4">
          <h3 className="text-2xl font-semibold">1. Information We Collect</h3>
          <p className="text-gray-700 leading-relaxed">
            We may collect information you provide directly, such as your name,
            email, and linked social media accounts. Additionally, we may
            collect technical data necessary for our platform’s functionality.
          </p>

          <h3 className="text-2xl font-semibold">2. Use of Your Information</h3>
          <p className="text-gray-700 leading-relaxed">
            Your data is used solely to operate, maintain, and improve Nexa,
            including scheduling social media posts, sending notifications, and
            providing support.
          </p>

          <h3 className="text-2xl font-semibold">3. Data Sharing</h3>
          <p className="text-gray-700 leading-relaxed">
            Nexa does not sell or trade your personal information. Data may only
            be shared with trusted third-party services required to deliver our
            features, such as social media APIs.
          </p>

          <h3 className="text-2xl font-semibold">4. Data Security</h3>
          <p className="text-gray-700 leading-relaxed">
            We implement industry-standard security measures to protect your
            data against unauthorized access, loss, or misuse.
          </p>

          <h3 className="text-2xl font-semibold">5. Changes to This Policy</h3>
          <p className="text-gray-700 leading-relaxed">
            This Privacy Policy may be updated occasionally. All updates will be
            posted on this page, with the date of the latest revision indicated.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Questions regarding this policy can be directed to{" "}
            <a
              href="mailto:tsujeet440@gmail.com"
              className="text-indigo-600 hover:underline"
            >
              tsujeet440@gmail.com
            </a>
            .
          </p>
        </section>

        {/* Developer Info */}
        <section className="mt-8 p-6 bg-gray-100 rounded-lg border">
          <h3 className="text-xl font-semibold mb-2">Developer Information</h3>
          <p className="text-gray-700 leading-relaxed">
            Developed by <strong>Sujit Thakur</strong>.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
            <li>
              Email:{" "}
              <a
                href="mailto:tsujeet440@gmail.com"
                className="text-indigo-600 hover:underline"
              >
                tsujeet440@gmail.com
              </a>
            </li>
            <li>
              Portfolio:{" "}
              <a
                href="https://sujit-porttfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                sujit-porttfolio.vercel.app
              </a>
            </li>
            <li>
              GitHub:{" "}
              <a
                href="https://github.com/tsujit74"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                github.com/tsujit74
              </a>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Privacy;
