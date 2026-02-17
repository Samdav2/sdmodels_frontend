"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";

export default function CheckoutPage() {
  const router = useRouter();
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

  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "crypto">("card");
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
    city: "",
    country: "",
    zipCode: "",
  });

  const orderItems = [
    { id: 1, title: "Cyberpunk Character Pack", price: 29.99 },
    { id: 2, title: "Sci-Fi Weapon Collection", price: 19.99 },
    { id: 3, title: "Fantasy Environment Assets", price: 39.99 },
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
  const platformFee = subtotal * 0.075;
  const total = subtotal + platformFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setProcessing(false);
    router.push("/purchase/success");
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
            href="/cart" 
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold">Back to Cart</span>
          </Link>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="text-green-400">✓</span>
            <span>Secure Checkout</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <h1 className="text-4xl font-black text-white mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left - Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
                <h2 className="text-2xl font-black text-white mb-6">Contact Information</h2>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email address"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              {/* Payment Method */}
              <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
                <h2 className="text-2xl font-black text-white mb-6">Payment Method</h2>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-xl border-2 transition ${
                      paymentMethod === "card"
                        ? "border-orange-500 bg-orange-500/20"
                        : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    }`}
                  >
                    <div className="text-3xl mb-2">💳</div>
                    <div className="text-white font-semibold text-sm">Card</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`p-4 rounded-xl border-2 transition ${
                      paymentMethod === "paypal"
                        ? "border-orange-500 bg-orange-500/20"
                        : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    }`}
                  >
                    <div className="text-3xl mb-2">🅿️</div>
                    <div className="text-white font-semibold text-sm">PayPal</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("crypto")}
                    className={`p-4 rounded-xl border-2 transition ${
                      paymentMethod === "crypto"
                        ? "border-orange-500 bg-orange-500/20"
                        : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    }`}
                  >
                    <div className="text-3xl mb-2">₿</div>
                    <div className="text-white font-semibold text-sm">Crypto</div>
                  </button>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      placeholder="Card number"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                      placeholder="Cardholder name"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        placeholder="MM/YY"
                        className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                        required
                      />
                      <input
                        type="text"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        placeholder="CVV"
                        className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">You will be redirected to PayPal to complete your purchase</p>
                    <div className="text-6xl">🅿️</div>
                  </div>
                )}

                {paymentMethod === "crypto" && (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Cryptocurrency payment will be processed securely</p>
                    <div className="text-6xl">₿</div>
                  </div>
                )}
              </div>

              {/* Billing Address */}
              <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
                <h2 className="text-2xl font-black text-white mb-6">Billing Address</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.billingAddress}
                    onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                    placeholder="Street address"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                    required
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="ZIP code"
                      className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Country"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6 sticky top-6">
                <h2 className="text-2xl font-black text-white mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-400 truncate pr-2">{item.title}</span>
                      <span className="text-white font-semibold">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-700 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Platform Fee</span>
                    <span className="text-white font-semibold">${platformFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-3">
                    <div className="flex justify-between text-xl">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-orange-400 font-black">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-black text-lg hover:from-orange-600 hover:to-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {processing ? "Processing..." : `Pay $${total.toFixed(2)}`}
                </button>

                <div className="text-center text-xs text-gray-500">
                  <p className="mb-2">🔒 Secure payment powered by Stripe</p>
                  <p>By completing this purchase, you agree to our Terms of Service</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
