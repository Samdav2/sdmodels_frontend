"use client";

import Link from "next/link";
import { useState } from "react";

export default function DocsPage() {
  const [selectedSection, setSelectedSection] = useState("introduction");

  const sections = [
    { id: "introduction", name: "Introduction", icon: "📖" },
    { id: "authentication", name: "Authentication", icon: "🔐" },
    { id: "models", name: "Models API", icon: "🎨" },
    { id: "users", name: "Users API", icon: "👤" },
    { id: "marketplace", name: "Marketplace API", icon: "🛒" },
    { id: "webhooks", name: "Webhooks", icon: "🔔" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold">Back to Home</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link
              href="/help"
              className="px-4 py-2 bg-slate-800 border border-slate-700 text-gray-400 hover:bg-slate-700 hover:text-white rounded-lg transition text-sm font-semibold"
            >
              ❓ Help Center
            </Link>
            <Link
              href="/marketplace"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-semibold"
            >
              🛒 Marketplace
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6 sticky top-6">
              <h3 className="text-white font-bold mb-4">📑 Documentation</h3>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
                      selectedSection === section.id
                        ? "bg-orange-500 text-white"
                        : "text-gray-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-8">
              {selectedSection === "introduction" && (
                <div className="prose prose-invert prose-orange max-w-none">
                  <h1 className="text-4xl font-black text-white mb-6">API Documentation</h1>
                  <p className="text-gray-300 text-lg mb-6">
                    Welcome to the SDModels API documentation. Our RESTful API allows you to integrate 3D model marketplace features into your applications.
                  </p>

                  <h2 className="text-2xl font-bold text-white mb-4">Base URL</h2>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
                    <code className="text-orange-400">https://api.sdmodels.com/v1</code>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-4">Rate Limits</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
                    <li>Authenticated: 100 requests/minute</li>
                    <li>Unauthenticated: 20 requests/minute</li>
                    <li>Admin: 1000 requests/minute</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-white mb-4">Response Format</h2>
                  <p className="text-gray-300 mb-4">All responses are in JSON format:</p>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
                    <pre className="text-green-400 text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {...},
  "message": "Success"
}`}
                    </pre>
                  </div>
                </div>
              )}

              {selectedSection === "authentication" && (
                <div className="prose prose-invert prose-orange max-w-none">
                  <h1 className="text-4xl font-black text-white mb-6">Authentication</h1>
                  <p className="text-gray-300 text-lg mb-6">
                    SDModels uses JWT tokens for authentication. Include the token in the Authorization header.
                  </p>

                  <h2 className="text-2xl font-bold text-white mb-4">Login</h2>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
                    <pre className="text-sm overflow-x-auto">
<span className="text-orange-400">POST</span> <span className="text-white">/api/auth/login</span>
                    </pre>
                  </div>

                  <p className="text-gray-300 mb-4">Request Body:</p>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
                    <pre className="text-green-400 text-sm overflow-x-auto">
{`{
  "email": "user@example.com",
  "password": "SecurePass123!"
}`}
                    </pre>
                  </div>

                  <p className="text-gray-300 mb-4">Response:</p>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
                    <pre className="text-green-400 text-sm overflow-x-auto">
{`{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 900
}`}
                    </pre>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-4">Using the Token</h2>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
                    <pre className="text-sm overflow-x-auto">
<span className="text-gray-400">Authorization:</span> <span className="text-white">Bearer eyJ0eXAiOiJKV1QiLCJhbGc...</span>
                    </pre>
                  </div>
                </div>
              )}

              {selectedSection === "models" && (
                <div className="prose prose-invert prose-orange max-w-none">
                  <h1 className="text-4xl font-black text-white mb-6">Models API</h1>
                  
                  <h2 className="text-2xl font-bold text-white mb-4">Get Models</h2>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto">
<span className="text-green-400">GET</span> <span className="text-white">/api/models?page=1&limit=20&category=characters</span>
                    </pre>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-4 mt-8">Get Model Details</h2>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto">
<span className="text-green-400">GET</span> <span className="text-white">/api/models/:id</span>
                    </pre>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-4 mt-8">Upload Model</h2>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto">
<span className="text-orange-400">POST</span> <span className="text-white">/api/models</span>
                    </pre>
                  </div>
                  <p className="text-gray-300 mb-4">Requires authentication. Multipart form data.</p>
                </div>
              )}

              {/* Add more sections as needed */}
              {selectedSection === "users" && (
                <div className="prose prose-invert prose-orange max-w-none">
                  <h1 className="text-4xl font-black text-white mb-6">Users API</h1>
                  <p className="text-gray-300 text-lg">
                    Manage user profiles, followers, and account settings.
                  </p>
                </div>
              )}

              {selectedSection === "marketplace" && (
                <div className="prose prose-invert prose-orange max-w-none">
                  <h1 className="text-4xl font-black text-white mb-6">Marketplace API</h1>
                  <p className="text-gray-300 text-lg">
                    Handle transactions, cart operations, and purchases.
                  </p>
                </div>
              )}

              {selectedSection === "webhooks" && (
                <div className="prose prose-invert prose-orange max-w-none">
                  <h1 className="text-4xl font-black text-white mb-6">Webhooks</h1>
                  <p className="text-gray-300 text-lg mb-6">
                    Receive real-time notifications about events in your account.
                  </p>

                  <h2 className="text-2xl font-bold text-white mb-4">Available Events</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>model.uploaded</li>
                    <li>model.purchased</li>
                    <li>payment.completed</li>
                    <li>user.followed</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
