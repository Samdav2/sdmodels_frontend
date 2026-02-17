"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTestimonials } from "@/lib/api/hooks/useAdminTestimonials";

export default function TestimonialManagementPage() {
  const { testimonials, loading, error, toggleFeatured, deleteTestimonial } = useAdminTestimonials();

  const handleToggleFeatured = async (id: number) => {
    await toggleFeatured(id);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this testimonial?")) {
      await deleteTestimonial(id);
    }
  };

  if (loading) {
    return (<AdminLayout title="Testimonial Management">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-400">Loading testimonials...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Testimonial Management">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-500 mb-2">Error Loading Testimonials</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <ProtectedRoute>
    <AdminLayout title="Testimonial Management">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400">Manage customer testimonials and reviews</p>
        <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition font-bold">
          ➕ Add Testimonial
        </button>
      </div>

      <div className="grid gap-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{testimonial.author}</h3>
                  {testimonial.verified && <span className="text-green-400 text-sm">✓ Verified</span>}
                  {testimonial.featured && (
                    <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-xs font-bold">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-2">{testimonial.company}</p>
                <p className="text-white mb-2">{testimonial.text}</p>
                <div className="text-yellow-400">{"⭐".repeat(testimonial.rating)}</div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleToggleFeatured(testimonial.id)}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-semibold transition"
                >
                  {testimonial.featured ? "Unfeature" : "Feature"}
                </button>
                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition">
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(testimonial.id)}
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
