"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function LearningCenterManagementPage() {
  const [tutorials, setTutorials] = useState([
    { id: 1, title: "Getting Started with 3D Modeling", category: "Beginner", views: 2340, published: true },
    { id: 2, title: "Advanced Rigging Techniques", category: "Advanced", views: 1560, published: true },
    { id: 3, title: "PBR Texturing Masterclass", category: "Intermediate", views: 890, published: false },
  ]);

  const handleDelete = (id: number) => {
    if (confirm("Delete this tutorial?")) {
      setTutorials(prev => prev.filter(t => t.id !== id));
    }
  };

  const togglePublish = (id: number) => {
    setTutorials(prev => prev.map(t => 
      t.id === id ? { ...t, published: !t.published } : t
    ));
  };

  return (
    <AdminLayout title="Learning Center Management">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400">Manage tutorials and educational content</p>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition font-bold">
          ➕ Create Tutorial
        </button>
      </div>

      <div className="grid gap-4">
        {tutorials.map((tutorial) => (
          <div key={tutorial.id} className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">{tutorial.title}</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-cyan-900/30 text-cyan-400 rounded-full font-semibold">
                    {tutorial.category}
                  </span>
                  <span className="text-gray-400">👁️ {tutorial.views} views</span>
                  <span className={`px-3 py-1 rounded-full font-semibold ${
                    tutorial.published 
                      ? "bg-green-900/30 text-green-400"
                      : "bg-yellow-900/30 text-yellow-400"
                  }`}>
                    {tutorial.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => togglePublish(tutorial.id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition"
                >
                  {tutorial.published ? "Unpublish" : "Publish"}
                </button>
                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition">
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(tutorial.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
