"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminLearning } from "@/lib/api/hooks/useAdminLearning";

export default function LearningCenterManagementPage() {
  const { courses, loading, error, deleteCourse } = useAdminLearning();

  const handleDelete = async (id: number) => {
    if (confirm("Delete this course?")) {
      await deleteCourse(id);
    }
  };

  if (loading) {
    return (<AdminLayout title="Learning Center Management">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-400">Loading courses...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Learning Center Management">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-500 mb-2">Error Loading Tutorials</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
    <AdminLayout title="Learning Center Management">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400">Manage tutorials and educational content</p>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition font-bold">
          ➕ Create Tutorial
        </button>
      </div>

      <div className="grid gap-4">
        {courses.map((tutorial: any) => (
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
                  onClick={() => handleTogglePublish(tutorial.id)}
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
    </ProtectedRoute>
  );
}
