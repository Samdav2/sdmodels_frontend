"use client";

import Link from "next/link";
import { useState } from "react";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";

export default function CartPage() {
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

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      modelId: 123,
      title: "Cyberpunk Character Pack",
      creator: "Alex Chen",
      thumbnail: "🎨",
      price: 29.99,
      formats: ["GLB", "FBX", "OBJ"],
      polyCount: 45000,
    },
    {
      id: 2,
      modelId: 456,
      title: "Sci-Fi Weapon Collection",
      creator: "Sarah Miller",
      thumbnail: "🚀",
      price: 19.99,
      formats: ["GLB", "FBX"],
      polyCount: 32000,
    },
    {
      id: 3,
      modelId: 789,
      title: "Fantasy Environment Assets",
      creator: "Mike Johnson",
      thumbnail: "🏰",
      price: 39.99,
      formats: ["GLB", "FBX", "OBJ", "BLEND"],
      polyCount: 78000,
    },
  ]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const platformFee = subtotal * 0.075; // 7.5%
  const discount = appliedCoupon ? subtotal * 0.1 : 0; // 10% discount
  const total = subtotal + platformFee - discount;

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    showNotification("info", "Item Removed", "Item has been removed from your cart.");
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode);
      showNotification("success", "Coupon Applied!", `${couponCode} - 10% discount applied.`);
    }
  };

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message });
    setTimeout(() => setNotification(prev => ({ ...prev, isOpen: false })), 3000);
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

      {/* Top Navigation */}
      <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link 
            href="/marketplace" 
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold">Continue Shopping</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold">{cartItems.length} Items</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-12 text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-black text-white mb-4">Your Cart is Empty</h2>
            <p className="text-gray-400 mb-8">Add some amazing 3D models to get started!</p>
            <Link
              href="/marketplace"
              className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left - Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
                <h1 className="text-3xl font-black text-white mb-6">Shopping Cart</h1>
                
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-orange-500/50 transition"
                    >
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                          {item.thumbnail}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/model/${item.modelId}`}
                            className="text-white font-bold text-lg hover:text-orange-400 transition mb-1 block"
                          >
                            {item.title}
                          </Link>
                          <p className="text-gray-400 text-sm mb-2">by {item.creator}</p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                            <span>📦 {item.formats.join(", ")}</span>
                            <span>•</span>
                            <span>🔺 {item.polyCount.toLocaleString()} polys</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-black text-orange-400">
                              ${item.price.toFixed(2)}
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition font-semibold text-sm"
                            >
                              🗑️ Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon Code */}
              <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-4">🎟️ Have a Coupon Code?</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || !!appliedCoupon}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-3 flex items-center justify-between bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                    <span className="text-green-400 font-semibold text-sm">✓ {appliedCoupon} applied</span>
                    <button
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponCode("");
                      }}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6 sticky top-6">
                <h2 className="text-2xl font-black text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-400">
                    <span>Platform Fee (7.5%)</span>
                    <span className="text-white font-semibold">${platformFee.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount (10%)</span>
                      <span className="font-semibold">-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-700 pt-4">
                    <div className="flex justify-between text-xl">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-orange-400 font-black">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center rounded-xl font-black text-lg hover:from-orange-600 hover:to-red-600 transition mb-4"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/marketplace"
                  className="block w-full py-3 bg-slate-800 border border-slate-700 text-gray-400 text-center rounded-lg hover:bg-slate-700 hover:text-white transition font-semibold"
                >
                  Continue Shopping
                </Link>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-2xl">🔒</span>
                    <div>
                      <div className="text-white font-semibold">Secure Checkout</div>
                      <div className="text-xs">256-bit SSL encryption</div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">We accept:</p>
                  <div className="flex gap-2">
                    <div className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-gray-400">
                      💳 Card
                    </div>
                    <div className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-gray-400">
                      PayPal
                    </div>
                    <div className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-gray-400">
                      ₿ Crypto
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
