"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/auth";

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength(formData.password);
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = ["", "red", "orange", "yellow", "green", "green"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (strength < 3) {
      setError("Password is too weak. Please use a stronger password.");
      return;
    }

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    setLoading(true);

    try {
      await authApi.adminResetPassword(token, formData.password);
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-black text-white mb-2">Invalid Reset Link</h2>
          <p className="text-gray-400 mb-6">This password reset link is invalid or has expired.</p>
          <Link
            href="/admin/forgot-password"
            className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-xl font-bold hover:from-yellow-500 hover:to-red-500 transition"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-red-600 rounded-2xl mb-4">
            <span className="text-4xl">🔑</span>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent mb-2">
            NEW PASSWORD
          </h1>
          <p className="text-gray-400">Create a secure password</p>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-8 shadow-2xl">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-bold mb-2">New Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                  required
                />
                
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Password Strength</span>
                      <span className={`text-xs font-bold text-${strengthColors[strength]}-400`}>
                        {strengthLabels[strength]}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${strengthColors[strength]}-500 transition-all`}
                        style={{ width: `${(strength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                  required
                />
              </div>

              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 text-sm font-semibold mb-2">Password Requirements:</p>
                <ul className="text-blue-300 text-xs space-y-1">
                  <li className={formData.password.length >= 8 ? "text-green-400" : ""}>
                    ✓ At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? "text-green-400" : ""}>
                    ✓ Uppercase and lowercase letters
                  </li>
                  <li className={/\d/.test(formData.password) ? "text-green-400" : ""}>
                    ✓ At least one number
                  </li>
                  <li className={/[^a-zA-Z0-9]/.test(formData.password) ? "text-green-400" : ""}>
                    ✓ At least one special character
                  </li>
                </ul>
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
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-black text-white mb-3">Password Reset!</h3>
              <p className="text-gray-400 mb-6">
                Your password has been successfully reset. Redirecting to login...
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/admin/login"
              className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
