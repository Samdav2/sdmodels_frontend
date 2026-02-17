"use client";

import Link from "next/link";
import { useState } from "react";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
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

  const plans = [
    {
      name: "Free",
      icon: "🆓",
      description: "Perfect for getting started",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        "Upload up to 5 models",
        "Basic 3D viewer",
        "Community access",
        "7.5% platform fee",
        "Standard support",
      ],
      limitations: [
        "No priority listing",
        "No analytics",
        "Limited file size (50MB)",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      icon: "⭐",
      description: "For serious creators",
      monthlyPrice: 19,
      yearlyPrice: 190,
      features: [
        "Unlimited model uploads",
        "Advanced 3D viewer with IDE features",
        "Priority listing in marketplace",
        "Detailed analytics dashboard",
        "5% platform fee (save 2.5%)",
        "Priority support",
        "Custom branding",
        "Larger file sizes (500MB)",
      ],
      limitations: [],
      cta: "Start Pro Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      icon: "🚀",
      description: "For teams and studios",
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        "Everything in Pro",
        "Team collaboration tools",
        "White-label options",
        "3% platform fee (save 4.5%)",
        "Dedicated account manager",
        "Custom integrations",
        "API access",
        "Unlimited file size (2GB)",
        "Custom contracts",
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message });
    setTimeout(() => setNotification(prev => ({ ...prev, isOpen: false })), 3000);
  };

  const handleSelectPlan = (planName: string) => {
    showNotification("success", "Plan Selected!", `You selected the ${planName} plan. Redirecting to checkout...`);
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
              href="/marketplace"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-semibold"
            >
              🛒 Marketplace
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4">
            💎 Pricing Plans
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Choose the perfect plan for your needs
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-slate-900/50 border border-orange-500/20 rounded-xl p-2">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                billingCycle === "monthly"
                  ? "bg-orange-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                billingCycle === "yearly"
                  ? "bg-orange-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-slate-900/50 rounded-2xl overflow-hidden ${
                plan.popular
                  ? "border-2 border-orange-500 shadow-xl shadow-orange-500/20"
                  : "border border-orange-500/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1 text-sm font-bold">
                  MOST POPULAR
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">{plan.icon}</div>
                  <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-6 pb-6 border-b border-slate-700">
                  <div className="text-5xl font-black text-white mb-2">
                    ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                  </div>
                  <div className="text-gray-400 text-sm">
                    per {billingCycle === "monthly" ? "month" : "year"}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">✗</span>
                      <span className="text-gray-500 text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.name)}
                  className={`w-full py-4 rounded-xl font-bold transition ${
                    plan.popular
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90"
                      : "bg-slate-800 border border-slate-700 text-gray-400 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold mb-2">Can I change plans later?</h3>
              <p className="text-gray-300">Yes, you can upgrade or downgrade at any time. Changes take effect immediately.</p>
            </div>
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-300">We accept all major credit cards, PayPal, and cryptocurrency.</p>
            </div>
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold mb-2">Is there a free trial?</h3>
              <p className="text-gray-300">Yes! Pro plan includes a 14-day free trial. No credit card required.</p>
            </div>
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-300">Absolutely. Cancel anytime with no penalties. Your plan remains active until the end of the billing period.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
