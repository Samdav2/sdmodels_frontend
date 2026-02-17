"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";
import { useCart } from "@/lib/api/hooks/useCart";
import { useCheckout } from "@/lib/api/hooks/useCheckout";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, loading: cartLoading, error: cartError } = useCart();
  const { processCheckout, processing, error: checkoutError } = useCheckout();
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await processCheckout(paymentMethod);
      
      setNotification({
        isOpen: true,
        type: "success",
        title: "Payment Successful!",
        message: "Your purchase has been completed. Redirecting...",
      });

      setTimeout(() => {
        router.push(result.redirect_url || `/purchase/success?transaction_id=${result.transaction_id}`);
      }, 2000);
    } catch (error) {
      setNotification({
        isOpen: true,
        type: "error",
        title: "Payment Failed",
        message: checkoutError || "Please try again or contact support.",
      });
    }
  };

  if (cartLoading) return <LoadingSpinner />;
  if (cartError) return <ErrorMessage error={cartError} />;

  const subtotal = items.reduce((sum, item) => sum + item.model.price, 0);
  const platformFee = subtotal * 0.075; // 7.5% platform fee
  const total = subtotal + platformFee;

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
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-black text-white mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Payment Method</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "card", label: "Credit Card", icon: "💳" },
                    { value: "paypal", label: "PayPal", icon: "🅿️" },
                    { value: "crypto", label: "Crypto", icon: "₿" },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentMethod(method.value as any)}
                      className={`p-4 rounded-lg border-2 transition ${
                        paymentMethod === method.value
                          ? "border-orange-500 bg-orange-500/10"
                          : "border-slate-700 hover:border-orange-500/50"
                      }`}
                    >
                      <div className="text-3xl mb-2">{method.icon}</div>
                      <div className="text-sm font-semibold text-white">{method.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Details */}
              {paymentMethod === "card" && (
                <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Card Details</h2>
                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        required
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:from-orange-400 hover:to-red-500 transition disabled:opacity-50"
              >
                {processing ? "Processing..." : `Pay $${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Right - Order Summary */}
          <div>
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {items.length === 0 ? (
                  <div className="text-center py-4 text-slate-400">Cart is empty</div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-300">{item.model.title}</span>
                      <span className="text-white font-semibold">${item.model.price.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Platform Fee (7.5%)</span>
                  <span className="text-white">${platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-700">
                  <span className="text-white">Total</span>
                  <span className="text-orange-400">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
