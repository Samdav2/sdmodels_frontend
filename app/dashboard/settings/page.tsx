"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "billing">("profile");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
            ⚙️ System Configuration
          </h1>
          <p className="text-sm sm:text-base text-slate-400">Manage your account, security, and preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "profile", label: "Profile", icon: "👤" },
            { id: "security", label: "Neural Link", icon: "🔐" },
            { id: "notifications", label: "Alerts", icon: "🔔" },
            { id: "billing", label: "Billing", icon: "💳" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50"
                  : "bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:border-orange-500/50"
              }`}
            >
              <span className="mr-1 sm:mr-2">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Avatar & Basic Info */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Profile Information</h2>
              
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                {/* Avatar */}
                <div className="relative mx-auto sm:mx-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-3xl sm:text-4xl font-black text-white">
                    JD
                  </div>
                  <button className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition text-sm sm:text-base">
                    📷
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                  <div>
                    <label className="block text-xs sm:text-sm text-slate-400 mb-2">Display Name</label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-slate-400 mb-2">Username</label>
                    <input
                      type="text"
                      defaultValue="@johndoe3d"
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm text-slate-400 mb-2">Bio</label>
                  <textarea
                    rows={3}
                    defaultValue="Professional 3D artist specializing in game-ready assets and architectural visualization."
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:border-orange-500 focus:outline-none transition resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm text-slate-400 mb-2">Location</label>
                    <input
                      type="text"
                      defaultValue="San Francisco, CA"
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-slate-400 mb-2">Website</label>
                    <input
                      type="url"
                      defaultValue="https://johndoe3d.com"
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <button className="mt-4 sm:mt-6 w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition">
                Save Changes
              </button>
            </div>

            {/* Social Links */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Social Links</h2>
              
              <div className="space-y-3 sm:space-y-4">
                {[
                  { platform: "ArtStation", icon: "🎨", placeholder: "artstation.com/username" },
                  { platform: "Twitter/X", icon: "🐦", placeholder: "@username" },
                  { platform: "Instagram", icon: "📸", placeholder: "@username" },
                  { platform: "YouTube", icon: "📺", placeholder: "youtube.com/@channel" },
                ].map((social) => (
                  <div key={social.platform}>
                    <label className="block text-xs sm:text-sm text-slate-400 mb-2">
                      <span className="mr-2">{social.icon}</span>
                      {social.platform}
                    </label>
                    <input
                      type="text"
                      placeholder={social.placeholder}
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>
                ))}
              </div>

              <button className="mt-4 sm:mt-6 w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition">
                Update Links
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            {/* Neural Link Status */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">🔐 Neural Link Status</h2>
                  <p className="text-sm text-slate-400">Advanced biometric authentication system</p>
                </div>
                <div className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg">
                  <span className="text-green-400 font-semibold">● Active</span>
                </div>
              </div>

              {/* Security Features */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      🔑
                    </div>
                    <div>
                      <div className="font-semibold text-white">Two-Factor Authentication</div>
                      <div className="text-sm text-slate-400">Extra layer of security</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`relative w-14 h-7 rounded-full transition ${
                      twoFactorEnabled ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        twoFactorEnabled ? "translate-x-8" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      👆
                    </div>
                    <div>
                      <div className="font-semibold text-white">Biometric Scan</div>
                      <div className="text-sm text-slate-400">Fingerprint authentication</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setBiometricEnabled(!biometricEnabled)}
                    className={`relative w-14 h-7 rounded-full transition ${
                      biometricEnabled ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        biometricEnabled ? "translate-x-8" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Password Change */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <button className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition">
                Update Password
              </button>
            </div>

            {/* Active Sessions */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <h2 className="text-xl font-bold text-white mb-6">Active Sessions</h2>
              
              <div className="space-y-3">
                {[
                  { device: "Chrome on MacBook Pro", location: "San Francisco, CA", current: true, time: "Active now" },
                  { device: "Safari on iPhone 15", location: "San Francisco, CA", current: false, time: "2 hours ago" },
                  { device: "Firefox on Windows", location: "New York, NY", current: false, time: "1 day ago" },
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {session.device.includes("MacBook") ? "💻" : session.device.includes("iPhone") ? "📱" : "🖥️"}
                      </div>
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          {session.device}
                          {session.current && (
                            <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/50 rounded text-xs text-green-400">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-400">{session.location} • {session.time}</div>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition">
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                  <div>
                    <div className="font-semibold text-white">Email Notifications</div>
                    <div className="text-sm text-slate-400">Receive updates via email</div>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative w-14 h-7 rounded-full transition ${
                      emailNotifications ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        emailNotifications ? "translate-x-8" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                  <div>
                    <div className="font-semibold text-white">Push Notifications</div>
                    <div className="text-sm text-slate-400">Browser push notifications</div>
                  </div>
                  <button
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={`relative w-14 h-7 rounded-full transition ${
                      pushNotifications ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        pushNotifications ? "translate-x-8" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Types */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <h2 className="text-xl font-bold text-white mb-6">Alert Types</h2>
              
              <div className="space-y-3">
                {[
                  { label: "New Sales", description: "When someone purchases your model", enabled: true },
                  { label: "New Reviews", description: "When someone reviews your work", enabled: true },
                  { label: "New Followers", description: "When someone follows you", enabled: true },
                  { label: "Messages", description: "Direct messages from buyers", enabled: true },
                  { label: "Platform Updates", description: "News and feature announcements", enabled: false },
                  { label: "Marketing", description: "Promotional content and tips", enabled: false },
                ].map((notif, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                    <div>
                      <div className="font-semibold text-white">{notif.label}</div>
                      <div className="text-sm text-slate-400">{notif.description}</div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={notif.enabled}
                      className="w-5 h-5 accent-orange-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            {/* Payment Methods */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Payment Methods</h2>
                <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition">
                  + Add Method
                </button>
              </div>
              
              <div className="space-y-3">
                {[
                  { type: "PayPal", email: "john.doe@email.com", primary: true },
                  { type: "Bank Account", last4: "4242", primary: false },
                ].map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{method.type === "PayPal" ? "💳" : "🏦"}</div>
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          {method.type}
                          {method.primary && (
                            <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/50 rounded text-xs text-orange-400">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-400">
                          {method.email || `****${method.last4}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!method.primary && (
                        <button className="px-4 py-2 text-orange-400 hover:bg-orange-500/10 rounded-lg transition">
                          Set Primary
                        </button>
                      )}
                      <button className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee Structure */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <h2 className="text-xl font-bold text-white mb-6">Your Fee Structure</h2>
              
              <div className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-slate-400">Current Rank</div>
                    <div className="text-2xl font-black text-orange-400">Gold Modeller</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Platform Fee</div>
                    <div className="text-2xl font-black text-white">6.0%</div>
                  </div>
                </div>
                <div className="text-sm text-slate-300">
                  You're earning 94% of each sale. Reach Platinum rank to reduce fees to 5.5%!
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { rank: "Bronze", fee: "7.5%", requirement: "0-50 sales" },
                  { rank: "Silver", fee: "7.0%", requirement: "51-150 sales" },
                  { rank: "Gold", fee: "6.0%", requirement: "151-500 sales", current: true },
                  { rank: "Platinum", fee: "5.5%", requirement: "501-1000 sales" },
                  { rank: "Mythic", fee: "5.0%", requirement: "1000+ sales" },
                ].map((tier, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      tier.current
                        ? "bg-orange-500/20 border-orange-500/50"
                        : "bg-slate-950/30 border-slate-700/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {tier.rank === "Bronze" ? "🥉" : tier.rank === "Silver" ? "🥈" : tier.rank === "Gold" ? "🥇" : tier.rank === "Platinum" ? "💎" : "👑"}
                        </span>
                        <div>
                          <div className={`font-semibold ${tier.current ? "text-orange-400" : "text-white"}`}>
                            {tier.rank}
                          </div>
                          <div className="text-sm text-slate-400">{tier.requirement}</div>
                        </div>
                      </div>
                      <div className={`font-bold ${tier.current ? "text-orange-400" : "text-slate-300"}`}>
                        {tier.fee}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax Information */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <h2 className="text-xl font-bold text-white mb-6">Tax Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Tax ID / VAT Number</label>
                  <input
                    type="text"
                    placeholder="Enter your tax ID"
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Business Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="Your business name"
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <button className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition">
                Save Tax Info
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
