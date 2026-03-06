"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBounty, MilestoneCreate } from "@/lib/api/bounties";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";
import { getAccessToken } from "@/lib/api/client";
import { getWalletBalance, Wallet } from "@/lib/api/wallet";

export default function CreateBountyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletLoading, setWalletLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    category: "Characters",
    difficulty: "medium" as "easy" | "medium" | "hard",
    requirements: [""],
    has_milestones: false,
    max_revisions: 3,
  });

  const [milestones, setMilestones] = useState<MilestoneCreate[]>([
    { title: "", description: "", amount: 0, deadline: "", order: 1 }
  ]);

  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const categories = [
    "Characters", "Vehicles", "Weapons", "Environments", 
    "Props", "Creatures", "Architecture", "UI Elements", "Other"
  ];

  // Debug: Check authentication and fetch wallet on mount
  useEffect(() => {
    const token = getAccessToken();
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
    console.log('=== BOUNTY CREATE DEBUG ===');
    console.log('Token present:', !!token);
    console.log('Token preview:', token ? token.substring(0, 30) + '...' : 'MISSING');
    console.log('User data present:', !!userStr);
    console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL || 'default (/api/v1)');
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('User:', { id: user.id, username: user.username, email: user.email });
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
    
    // Try to decode JWT token
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log('Token payload:', payload);
          const expiryDate = new Date(payload.exp * 1000);
          const isExpired = Date.now() > payload.exp * 1000;
          console.log('Token expires:', expiryDate.toLocaleString());
          console.log('Token expired:', isExpired);
          console.log('User ID from token:', payload.sub || payload.user_id || 'unknown');
          
          if (isExpired) {
            console.error('⚠️ TOKEN IS EXPIRED! User needs to login again.');
            setError("Your session has expired. Please login again.");
            setIsAuthenticated(false);
            showNotification("error", "Session Expired", "Please login again to continue");
            setTimeout(() => router.push('/auth'), 2000);
          } else {
            setIsAuthenticated(true);
            // Fetch wallet balance
            fetchWalletBalance();
          }
        }
      } catch (e) {
        console.log('Token is not a JWT or invalid format');
        setIsAuthenticated(false);
        setWalletLoading(false);
      }
    } else {
      console.warn('⚠️ NO TOKEN FOUND - User may not be authenticated!');
      setError("You must be logged in to create a bounty.");
      setIsAuthenticated(false);
      showNotification("error", "Authentication Required", "Please login to create a bounty");
      setWalletLoading(false);
    }
    console.log('=========================');
  }, [router]);

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    try {
      const walletData = await getWalletBalance();
      setWallet(walletData);
      console.log('Wallet balance:', walletData);
    } catch (error: any) {
      console.error('Failed to fetch wallet:', error);
      // Don't show error notification here, wallet might not exist yet
    } finally {
      setWalletLoading(false);
    }
  };

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message });
    setTimeout(() => setNotification(prev => ({ ...prev, isOpen: false })), 3000);
  };

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

  const handleAddMilestone = () => {
    setMilestones(prev => [
      ...prev,
      { title: "", description: "", amount: 0, deadline: "", order: prev.length + 1 }
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== index).map((m, i) => ({ ...m, order: i + 1 })));
  };

  const handleMilestoneChange = (index: number, field: keyof MilestoneCreate, value: any) => {
    setMilestones(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
  };

  const validateMilestones = () => {
    if (!formData.has_milestones) return true;

    if (milestones.length === 0) {
      setError("Please add at least one milestone");
      return false;
    }

    const totalAmount = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
    const budget = parseFloat(formData.budget);

    if (Math.abs(totalAmount - budget) > 0.01) {
      setError(`Total milestone amount ($${totalAmount}) must equal bounty budget ($${budget})`);
      return false;
    }

    for (const milestone of milestones) {
      if (!milestone.title || !milestone.description || !milestone.deadline || milestone.amount <= 0) {
        setError("All milestone fields are required");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug: Check token before submission
    const token = getAccessToken();
    console.log('=== SUBMITTING BOUNTY ===');
    console.log('Token present:', !!token);
    
    if (!token) {
      setError("You must be logged in to create a bounty. Please login and try again.");
      showNotification("error", "Authentication Required", "Please login to create a bounty");
      setTimeout(() => router.push('/auth'), 2000);
      return;
    }
    
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

    if (!validateMilestones()) {
      return;
    }

    // Check wallet balance
    const bountyAmount = parseFloat(formData.budget);
    if (wallet && Number(wallet.available_balance) < bountyAmount) {
      const shortfall = bountyAmount - Number(wallet.available_balance);
      setError(`Insufficient wallet balance. You need $${shortfall.toFixed(2)} more. Available: $${Number(wallet.available_balance).toFixed(2)}`);
      showNotification(
        "error", 
        "Insufficient Funds", 
        `You need $${shortfall.toFixed(2)} more to create this bounty. Please deposit funds to your wallet.`
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const bountyData: any = {
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        deadline: formData.deadline,
        category: formData.category,
        difficulty: formData.difficulty,
        requirements: filteredRequirements,
        has_milestones: formData.has_milestones,
        max_revisions: formData.max_revisions,
      };

      if (formData.has_milestones) {
        bountyData.milestones = milestones;
      }

      console.log('Bounty data to submit:', bountyData);
      console.log('Making API call...');

      const result = await createBounty(bountyData);
      
      console.log('✅ Bounty created successfully:', result);

      showNotification("success", "Bounty Created!", "Your bounty has been posted successfully.");
      setTimeout(() => router.push("/bounties/my-posted"), 1500);
    } catch (err: any) {
      console.error('❌ BOUNTY CREATE ERROR:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      console.error('Error headers:', err.response?.headers);
      
      let errorMessage = "Failed to create bounty";
      
      if (err.response?.status === 403) {
        errorMessage = "Permission denied. You may not have access to create bounties. Please contact support.";
        console.error('🔒 403 FORBIDDEN - Possible causes:');
        console.error('1. Token is invalid or expired');
        console.error('2. User lacks permission to create bounties');
        console.error('3. Backend endpoint requires specific role');
        console.error('4. CORS or authentication middleware issue');
      } else if (err.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again.";
        setTimeout(() => router.push('/auth'), 2000);
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      showNotification("error", "Error", errorMessage);
    } finally {
      setLoading(false);
      console.log('=========================');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
              <span className="text-white font-bold text-lg">SD</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Create Bounty
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-auto">
            <Link href="/bounties" className="flex-1 sm:flex-none text-center text-sm sm:text-base text-orange-400 hover:text-orange-300 transition">
              Back to Bounties
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-2 sm:mb-3">
            💼 Post a New <span className="text-orange-500">Bounty</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Describe your project and budget. Artists will apply, and you choose who gets the job.
          </p>
        </div>

        {/* Wallet Balance Display */}
        {!walletLoading && wallet && (
          <div className="mb-6 p-4 sm:p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-xl">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl">
                  💳
                </div>
                <div>
                  <div className="text-sm text-green-300">Wallet Balance</div>
                  <div className="text-2xl font-black text-white">
                    ${Number(wallet.available_balance).toFixed(2)}
                  </div>
                  {Number(wallet.held_balance) > 0 && (
                    <div className="text-xs text-slate-400">
                      (${Number(wallet.held_balance).toFixed(2)} held in escrow)
                    </div>
                  )}
                </div>
              </div>
              <Link
                href="/dashboard/wallet"
                className="px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition font-semibold text-sm"
              >
                Manage Wallet
              </Link>
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <div className="mb-6 p-4 sm:p-6 bg-red-500/10 border-2 border-red-500/50 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="text-red-400 font-bold text-base sm:text-lg mb-2">Authentication Required</h3>
                <p className="text-red-300 text-sm sm:text-base mb-3">
                  You must be logged in to create a bounty. Please login or register to continue.
                </p>
                <Link
                  href="/auth"
                  className="inline-block px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="text-red-400 text-sm sm:text-base mb-2">{error}</p>
                {error.includes("Insufficient wallet balance") && (
                  <Link
                    href="/dashboard/wallet"
                    className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-sm"
                  >
                    💰 Deposit Funds
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Title */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 sm:p-6 backdrop-blur">
            <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
              Bounty Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Cyberpunk Character Model"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm sm:text-base placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Description */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 sm:p-6 backdrop-blur">
            <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what you need in detail..."
              rows={6}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm sm:text-base placeholder-slate-500 focus:border-orange-500 focus:outline-none transition resize-none"
              required
            />
          </div>

          {/* Budget & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 sm:p-6 backdrop-blur">
              <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                Budget (USD) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="200"
                  min="10"
                  step="10"
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm sm:text-base placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 sm:p-6 backdrop-blur">
              <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                Deadline <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm sm:text-base focus:border-orange-500 focus:outline-none transition"
                required
              />
            </div>
          </div>

          {/* Category & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 sm:p-6 backdrop-blur">
              <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm sm:text-base focus:border-orange-500 focus:outline-none transition"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 sm:p-6 backdrop-blur">
              <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                Difficulty <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm sm:text-base focus:border-orange-500 focus:outline-none transition"
                required
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Max Revisions */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 sm:p-6 backdrop-blur">
            <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
              Maximum Revisions <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={formData.max_revisions}
              onChange={(e) => setFormData(prev => ({ ...prev, max_revisions: parseInt(e.target.value) }))}
              min="0"
              max="10"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm sm:text-base focus:border-orange-500 focus:outline-none transition"
              required
            />
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Number of times you can request changes (0-10, recommended: 2-3)
            </p>
          </div>

          {/* Milestone Toggle */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl p-4 sm:p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.has_milestones}
                onChange={(e) => setFormData(prev => ({ ...prev, has_milestones: e.target.checked }))}
                className="w-5 h-5 mt-0.5 rounded border-purple-500 text-purple-500 focus:ring-purple-500 flex-shrink-0"
              />
              <div>
                <span className="text-white font-bold text-sm sm:text-base">Use Milestone-Based Payments</span>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Break your project into multiple deliverables with individual payments (recommended for projects over $500)
                </p>
              </div>
            </label>
          </div>

          {/* Milestones Section */}
          {formData.has_milestones && (
            <div className="bg-slate-900/50 border border-purple-500/30 rounded-xl p-4 sm:p-6 backdrop-blur space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-base sm:text-lg">Project Milestones</h3>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-3 sm:px-4 py-2 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-500/30 transition font-semibold text-xs sm:text-sm"
                >
                  + Add Milestone
                </button>
              </div>

              {milestones.map((milestone, index) => (
                <div key={index} className="bg-slate-950/50 border border-slate-700 rounded-lg p-3 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-bold text-sm sm:text-base">Milestone {index + 1}</span>
                    {milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(index)}
                        className="text-red-400 hover:text-red-300 text-xs sm:text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                    placeholder="Milestone title"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                    required
                  />

                  <textarea
                    value={milestone.description}
                    onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                    placeholder="Milestone description"
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:border-purple-500 focus:outline-none resize-none"
                    required
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Amount ($)</label>
                      <input
                        type="number"
                        value={milestone.amount || ''}
                        onChange={(e) => handleMilestoneChange(index, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        min="1"
                        step="10"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Deadline</label>
                      <input
                        type="date"
                        value={milestone.deadline}
                        onChange={(e) => handleMilestoneChange(index, 'deadline', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        max={formData.deadline}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 sm:p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Total Milestone Amount:</span>
                  <span className="text-purple-400 font-bold">
                    ${milestones.reduce((sum, m) => sum + (m.amount || 0), 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-slate-300">Bounty Budget:</span>
                  <span className="text-white font-bold">${parseFloat(formData.budget || '0').toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Requirements */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 sm:p-6 backdrop-blur">
            <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
              Requirements <span className="text-red-400">*</span>
            </label>
            <p className="text-xs sm:text-sm text-slate-400 mb-4">List specific requirements for the model</p>
            
            <div className="space-y-3">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    placeholder="e.g., Game-ready topology"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm sm:text-base placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(index)}
                      className="px-3 sm:px-4 py-2 sm:py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition text-xs sm:text-sm whitespace-nowrap"
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
              className="mt-4 px-3 sm:px-4 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500/30 transition font-semibold text-xs sm:text-sm"
            >
              + Add Requirement
            </button>
          </div>

          {/* Escrow Notice */}
          <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-xl p-4 sm:p-6">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2 text-sm sm:text-base">
              <span>🔒</span>
              Escrow Protection
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-3">
              Your payment will be held in escrow until the artist delivers the work and you approve it. 
              {formData.has_milestones && " For milestone-based projects, payment is released per milestone completion."}
              {" "}This protects both parties and ensures quality delivery.
            </p>
            {formData.budget && parseFloat(formData.budget) > 0 && (
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Bounty Amount:</span>
                  <span className="text-white font-semibold">${parseFloat(formData.budget).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Platform Fee (7.5%):</span>
                  <span className="text-orange-400 font-semibold">${(parseFloat(formData.budget) * 0.075).toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-700 pt-2 flex justify-between text-sm">
                  <span className="text-slate-300 font-semibold">Artist Receives:</span>
                  <span className="text-green-400 font-bold">${(parseFloat(formData.budget) * 0.925).toFixed(2)}</span>
                </div>
                {wallet && (
                  <div className="border-t border-slate-700 pt-2 flex justify-between text-sm">
                    <span className="text-slate-300">Your Balance After:</span>
                    <span className={`font-bold ${
                      Number(wallet.available_balance) >= parseFloat(formData.budget) 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      ${(Number(wallet.available_balance) - parseFloat(formData.budget)).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/bounties"
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition font-semibold text-sm sm:text-base text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !isAuthenticated}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition font-semibold text-sm sm:text-base shadow-lg shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : !isAuthenticated ? "Login Required" : "Post Bounty"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
