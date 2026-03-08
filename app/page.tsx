"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center justify-center gap-8 px-6 py-12 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            GrowthBook Feature Flags
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Test and manage feature flags based on user roles
          </p>
        </div>

        <div className="space-y-3 text-left max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Test Credentials:
          </h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p><strong>User:</strong> rahul / 123</p>
            <p><strong>Manager:</strong> sneha / 123</p>
            <p><strong>Admin:</strong> vikram / 123</p>
          </div>
        </div>

        <Link
          href="/login"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          Go to Login
        </Link>
      </main>
    </div>
  );
}
