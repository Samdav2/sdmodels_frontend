"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBounty } from "@/lib/api/bounties";

export default function CreateBountyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    category: "Characters",
    difficulty: "medium" as "easy" | "medium" | "hard",
    requirements: [""],
  });

  const categories = [
    "Characters", "Vehicles", "Weapons", "Environments", 
    "Props", "Creatures", "Architecture", "UI Elements", "Other"
  ];

  const handleAddRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, ""]
    }));
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description || !formData.budget || !formData.deadline) {
      setError("Please fill in all required fields");
      return;
    }

    const filteredRequirements = formData.requirements.filter(req => req.trim() !== "");
    if (filteredRequirements.length === 0) {
      setError("Please add at least one requirement");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createBounty({
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        deadline: formData.deadline,
        category: formData.category,
        difficulty: formData.difficulty,
        requirements: filteredRequirements,
      });

      router.push("/bounties/my-posted");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create bounty");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="relative z-10 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
              <span className="text-white font-bold text-lg">SD</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Create Bounty
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center">
            <Link href="/bounties" className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition">
              Back to Bounties
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            💼 Post a New <span className="text-orange-500">Bounty</span>
          </h2>
          <p className="text-slate-400">
            Describe your project and budget. Artists will apply, and you choose who gets the job.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
            <label className="block text-white font-semibold mb-2">
              Bounty Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Cyberpunk Character Model"
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Description */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
            <label className="block text-white font-semibold mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what you need in detail..."
              rows={6}
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition resize-none"
              required
            />
          </div>

          {/* Budget & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <label className="block text-white font-semibold mb-2">
                Budget (USD) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="200"
                  min="10"
                  step="10"
                  className="w-full pl-8 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <label className="block text-white font-semibold mb-2">
                Deadline <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none transition"
                required
              />
            </div>
          </div>

          {/* Category & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <label className="block text-white font-semibold mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none transition"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <label className="block text-white font-semibold mb-2">
                Difficulty <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none transition"
                required
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
            <label className="block text-white font-semibold mb-2">
              Requirements <span className="text-red-400">*</span>
            </label>
            <p className="text-sm text-slate-400 mb-4">List specific requirements for the model</p>
            
            <div className="space-y-3">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    placeholder="e.g., Game-ready topology"
                    className="flex-1 px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(index)}
                      className="px-4 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddRequirement}
              className="mt-4 px-4 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500/30 transition font-semibold"
            >
              + Add Requirement
            </button>
          </div>

          {/* Escrow Notice */}
          <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-xl p-6">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
              <span>🔒</span>
              Escrow Protection
            </h3>
            <p className="text-sm text-slate-300">
              Your payment will be held in escrow until the artist delivers the work and you approve it. 
              This protects both parties and ensures quality delivery.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Link
              href="/bounties"
              className="flex-1 px-6 py-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition font-semibold text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Post Bounty"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
