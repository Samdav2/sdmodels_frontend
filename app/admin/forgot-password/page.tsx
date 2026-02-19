"use client";

import Link from "next/link";
import { useState } from "react";
import { authApi } from "@/lib/api/auth";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.adminForgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-red-600 rounded-2xl mb-4">
            <span className="text-4xl">🔐</span>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent mb-2">
            RESET PASSWORD
          </h1>
          <p className="text-gray-400">Admin Account Recovery</p>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-8 shadow-2xl">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-bold mb-2">Admin Email</label>
                <p className="text-gray-400 text-sm mb-3">
                  Enter your admin email address and we'll send you a password reset link.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sdmodels.com"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-400 text-sm font-semibold">⚠️ {error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-xl font-black text-lg hover:from-yellow-500 hover:to-red-500 transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="text-6xl mb-4">📧</div>
              <h3 className="text-2xl font-black text-white mb-3">Check Your Email</h3>
              <p className="text-gray-400 mb-6">
                We've sent a password reset link to <span className="text-white font-semibold">{email}</span>
              </p>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <p className="text-yellow-400 text-sm">
                  The link will expire in 1 hour for security reasons.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 text-center space-y-2">
            <Link
              href="/admin/login"
              className="block text-yellow-400 hover:text-yellow-300 text-sm font-semibold"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
