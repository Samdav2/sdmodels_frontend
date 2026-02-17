"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-slate-900/50 border border-red-500/20 rounded-2xl p-12">
          {/* Error Icon */}
          <div className="text-9xl mb-6">
            ⚠️
          </div>

          {/* Error Code */}
          <h1 className="text-6xl font-black bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent mb-4">
            Oops!
          </h1>

          {/* Message */}
          <h2 className="text-3xl font-bold text-white mb-4">
            Something Went Wrong
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.
          </p>

          {/* Error Details (Development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-left">
              <p className="text-red-400 text-sm font-mono break-all">
                {error.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:opacity-90 transition font-bold text-lg"
            >
              🔄 Try Again
            </button>
            <Link
              href="/"
              className="px-8 py-4 bg-slate-800 border border-slate-700 text-gray-400 hover:bg-slate-700 hover:text-white rounded-xl transition font-bold text-lg"
            >
              🏠 Go Home
            </Link>
          </div>

          {/* Support Link */}
          <div className="mt-12 pt-8 border-t border-slate-700">
            <p className="text-gray-400 mb-4">Need help?</p>
            <Link
              href="/support"
              className="text-orange-400 hover:text-orange-300 transition font-semibold"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
