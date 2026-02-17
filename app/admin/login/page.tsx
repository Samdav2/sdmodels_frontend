"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otpCode: "",
  });
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!showOTP) {
        // First step: validate credentials with backend
        if (!formData.email || !formData.password) {
          setError("Please enter email and password");
          setLoading(false);
          return;
        }

        const response = await authApi.adminLogin({
          email: formData.email,
          password: formData.password,
        });

        // If 2FA is required, show OTP input
        // For now, redirect directly to admin dashboard
        if (response.access_token) {
          router.push("/admin");
        } else {
          setShowOTP(true);
        }
      } else {
        // Second step: verify OTP (if implemented)
        if (formData.otpCode.length === 6) {
          // TODO: Verify OTP with backend
          router.push("/admin");
        } else {
          setError("Invalid OTP code");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-red-600 rounded-2xl mb-4">
            <span className="text-4xl">👑</span>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent mb-2">
            ADMIN ACCESS
          </h1>
          <p className="text-gray-400">Command Bridge Login</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!showOTP ? (
              <>
                {/* Email */}
                <div>
                  <label className="block text-white font-bold mb-2">Admin Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@hwc3d.com"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-white font-bold mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                {/* OTP Code */}
                <div>
                  <label className="block text-white font-bold mb-2">Two-Factor Authentication</label>
                  <p className="text-gray-400 text-sm mb-3">
                    Enter the 6-digit code from your authenticator app
                  </p>
                  <input
                    type="text"
                    value={formData.otpCode}
                    onChange={(e) => setFormData({ ...formData, otpCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    placeholder="000000"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-center text-2xl font-bold tracking-widest placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowOTP(false)}
                  className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold"
                >
                  ← Back to login
                </button>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm font-semibold">⚠️ {error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-xl font-black text-lg hover:from-yellow-500 hover:to-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : showOTP ? "Verify & Login" : "Continue"}
            </button>
          </form>

          {/* Footer Links */}
          {!showOTP && (
            <div className="mt-6 text-center space-y-2">
              <Link
                href="/admin/forgot-password"
                className="block text-yellow-400 hover:text-yellow-300 text-sm font-semibold"
              >
                Forgot Password?
              </Link>
              <Link
                href="/"
                className="block text-gray-400 hover:text-white text-sm"
              >
                ← Back to Website
              </Link>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            🔒 Secured with 256-bit encryption
          </p>
        </div>
      </div>
    </div>
  );
}
