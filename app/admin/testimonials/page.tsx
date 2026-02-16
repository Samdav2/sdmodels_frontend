"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function TestimonialManagementPage() {
  const [testimonials, setTestimonials] = useState([
    { id: 1, author: "John Doe", company: "GameStudio Inc", text: "Amazing quality models!", rating: 5, verified: true, featured: true },
    { id: 2, author: "Jane Smith", company: "VR Innovations", text: "Best marketplace for 3D assets", rating: 5, verified: true, featured: false },
    { id: 3, author: "Mike Johnson", company: "Indie Games", text: "Great platform and support", rating: 4, verified: false, featured: false },
  ]);

  const toggleFeatured = (id: number) => {
    setTestimonials(prev => prev.map(t => 
      t.id === id ? { ...t, featured: !t.featured } : t
    ));
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this testimonial?")) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
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
                  onClick={() => toggleFeatured(testimonial.id)}
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
  );
}
