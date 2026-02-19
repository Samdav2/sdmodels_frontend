"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminEmails } from "@/lib/api/hooks/useAdminEmails";

export default function EmailSystemPage() {
  const { emailTemplates, campaigns, loading, error, sendEmail } = useAdminEmails();
  const [recipientType, setRecipientType] = useState("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSendEmail = async () => {
    const success = await sendEmail(recipientType, subject, body);
    if (success) {
      alert(`Email sent to ${recipientType} users!`);
      setSubject("");
      setBody("");
    }
  };

  if (loading) {
    return (<AdminLayout title="Email System Management">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-400">Loading email settings...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Email System Management">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-500 mb-2">Error Loading Email Settings</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <ProtectedRoute>
    <AdminLayout title="Email System Management">
      {/* Quick Send */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Quick Send Email</h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Recipient Type</label>
              <select 
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
              >
                <option value="all">All Users</option>
                <option value="verified">Verified Creators</option>
                <option value="new">New Users (Last 30 days)</option>
                <option value="top">Top Sellers</option>
                <option value="custom">Custom List</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email Template</label>
              <select className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600">
                <option>Custom Email</option>
                {emailTemplates.map(t => (
                  <option key={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Email Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Compose your email... (HTML supported)"
              className="w-full h-48 px-4 py-3 bg-slate-800 border border-yellow-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-500 hover:to-blue-500 transition font-bold">
              📧 Send Test Email
            </button>
            <button 
              onClick={handleSendEmail}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition font-bold"
            >
              🚀 Send to Recipients
            </button>
          </div>
        </div>
      </div>

      {/* Email Templates */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Email Templates</h3>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition">
            ➕ New Template
          </button>
        </div>
        <div className="space-y-3">
          {emailTemplates.map((template) => (
            <div key={template.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div className="flex-1">
                <h4 className="text-white font-bold">{template.name}</h4>
                <p className="text-gray-400 text-sm">{template.subject}</p>
                <p className="text-gray-500 text-xs mt-1">Sent {template.sent} times</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  template.status === "Active"
                    ? "bg-green-900/30 text-green-400"
                    : "bg-gray-800 text-gray-400"
                }`}>
                  {template.status}
                </span>
                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition">
                  Edit
                </button>
                <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-semibold transition">
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Campaigns */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Email Campaigns</h3>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition">
            ➕ New Campaign
          </button>
        </div>
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-bold mb-1">{campaign.name}</h4>
                  <p className="text-gray-400 text-sm">Sent to {campaign.recipients} recipients on {campaign.sent}</p>
                </div>
                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition">
                  View Report
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-gray-400 text-xs mb-1">Open Rate</div>
                  <div className="text-white font-bold">{((campaign.opens / campaign.recipients) * 100).toFixed(1)}%</div>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-gray-400 text-xs mb-1">Click Rate</div>
                  <div className="text-white font-bold">{((campaign.clicks / campaign.recipients) * 100).toFixed(1)}%</div>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-gray-400 text-xs mb-1">Total Clicks</div>
                  <div className="text-white font-bold">{campaign.clicks}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Configuration */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Email Configuration</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">SMTP Server</label>
            <input
              type="text"
              defaultValue="smtp.example.com"
              className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">SMTP Port</label>
            <input
              type="number"
              defaultValue="587"
              className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">From Email</label>
            <input
              type="email"
              defaultValue="noreply@nexusmodels.com"
              className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">From Name</label>
            <input
              type="text"
              defaultValue="SDModels"
              className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
            />
          </div>
        </div>
        <button className="mt-6 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-500 hover:to-orange-500 transition font-bold">
          💾 Save Email Settings
        </button>
      </div>
    </AdminLayout>
    </ProtectedRoute>
  );
}
