"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function ContentCMSPage() {
  const [posts, setPosts] = useState([
    { id: 1, title: "Platform Update: New Features", status: "Published", date: "2024-02-15", views: 1234 },
    { id: 2, title: "Creator Spotlight: PixelForge", status: "Draft", date: "2024-02-16", views: 0 },
  ]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePublish = () => {
    if (!title || !content) {
      alert("Please fill in title and content");
      return;
    }
    // TODO: Call API
    alert("Post published!");
    setTitle("");
    setContent("");
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this post?")) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <AdminLayout title="Content Management System">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400">Create and manage platform updates and announcements</p>
      </div>

      {/* Post Editor */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Rich Text Editor</h3>
        
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title..."
          className="w-full px-4 py-3 bg-slate-800 border border-yellow-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600 mb-4 text-xl font-bold"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content here... (Supports Markdown)"
          className="w-full h-64 px-4 py-3 bg-slate-800 border border-yellow-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600 resize-none"
        />

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition text-sm">
              📷 Add Image
            </button>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition text-sm">
              🎨 Embed 3D Model
            </button>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition text-sm">
              🔗 Add Link
            </button>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-semibold">
              Save Draft
            </button>
            <button 
              onClick={handlePublish}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition font-bold"
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Existing Posts */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Published Content</h3>
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition">
              <div className="flex-1">
                <div className="text-white font-bold">{post.title}</div>
                <div className="text-gray-400 text-sm">{post.date} • {post.views} views</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  post.status === "Published"
                    ? "bg-green-900/30 text-green-400"
                    : "bg-yellow-900/30 text-yellow-400"
                }`}>
                  {post.status}
                </span>
                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition">
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(post.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
