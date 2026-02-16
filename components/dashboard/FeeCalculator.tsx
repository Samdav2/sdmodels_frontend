"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const PLATFORM_FEE = 0.075; // 7.5%

export default function FeeCalculator() {
  const [price, setPrice] = useState<string>("29.99");

  const numericPrice = parseFloat(price) || 0;
  const platformFee = numericPrice * PLATFORM_FEE;
  const yourEarnings = numericPrice - platformFee;

  return (
    <div className="space-y-6">
      {/* Price Input */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Model Price
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-bold">
            $
          </span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            min="0"
            className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border-2 border-slate-700/50 rounded-lg text-white text-lg font-mono focus:outline-none focus:border-orange-500 transition"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3 p-4 rounded-lg bg-slate-950/30 border border-slate-700/50">
        {/* Platform Fee */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Platform Fee (7.5%)</span>
          <span className="text-sm font-mono text-red-400">
            -${platformFee.toFixed(2)}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700/50" />

        {/* Your Earnings */}
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-white">Your Earnings</span>
          <motion.span
            key={yourEarnings}
            initial={{ scale: 1.2, color: "#ff6b35" }}
            animate={{ scale: 1, color: "#10b981" }}
            transition={{ duration: 0.3 }}
            className="text-xl font-bold font-mono text-green-400"
          >
            ${yourEarnings.toFixed(2)}
          </motion.span>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-orange-400 mb-1">
              Transparent Pricing
            </h4>
            <p className="text-xs text-slate-300">
              We charge a flat 7.5% fee on all sales. No hidden costs, no surprises. You keep 92.5% of every sale.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <div className="text-xs text-slate-400 mb-2">Quick Presets</div>
        <div className="grid grid-cols-3 gap-2">
          {["9.99", "29.99", "49.99"].map((preset) => (
            <button
              key={preset}
              onClick={() => setPrice(preset)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                price === preset
                  ? "bg-orange-500/20 border-2 border-orange-500 text-orange-400"
                  : "bg-slate-900/50 border-2 border-slate-700/50 text-slate-300 hover:border-orange-500/50"
              }`}
            >
              ${preset}
            </button>
          ))}
        </div>
      </div>

      {/* Earnings Projection */}
      <div className="p-4 rounded-lg bg-slate-950/30 border border-slate-700/50">
        <div className="text-xs text-slate-400 mb-3">If you sell...</div>
        <div className="space-y-2">
          {[10, 50, 100].map((quantity) => {
            const totalEarnings = yourEarnings * quantity;
            return (
              <div key={quantity} className="flex justify-between items-center">
                <span className="text-sm text-slate-300">{quantity} copies</span>
                <span className="text-sm font-mono text-green-400">
                  ${totalEarnings.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
