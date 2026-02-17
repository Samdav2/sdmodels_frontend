"use client";

import Link from "next/link";

export default function PurchaseSuccessPage() {
  const orderDetails = {
    orderId: "ORD-2024-001234",
    date: new Date().toLocaleDateString(),
    items: [
      { title: "Cyberpunk Character Pack", price: 29.99, downloadUrl: "/downloads/model1" },
      { title: "Sci-Fi Weapon Collection", price: 19.99, downloadUrl: "/downloads/model2" },
      { title: "Fantasy Environment Assets", price: 39.99, downloadUrl: "/downloads/model3" },
    ],
    total: 96.72,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-6 animate-bounce">
            <span className="text-5xl">✓</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-4">
            Purchase <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Successful!</span>
          </h1>
          <p className="text-xl text-gray-300">
            Thank you for your purchase. Your models are ready to download!
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-slate-900/50 border border-green-500/20 rounded-xl p-8 mb-6">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-700">
            <div>
              <p className="text-gray-400 text-sm">Order Number</p>
              <p className="text-white font-bold text-lg">{orderDetails.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Date</p>
              <p className="text-white font-bold">{orderDetails.date}</p>
            </div>
          </div>

          <h3 className="text-white font-bold text-lg mb-4">📦 Your Models</h3>
          <div className="space-y-3">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex-1">
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-gray-400 text-sm">${item.price.toFixed(2)}</p>
                </div>
                <Link
                  href={item.downloadUrl}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-sm"
                >
                  📥 Download
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700 flex justify-between text-xl">
            <span className="text-white font-bold">Total Paid</span>
            <span className="text-green-400 font-black">${orderDetails.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Link
            href="/dashboard/inventory"
            className="block py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition"
          >
            View in Library
          </Link>
          <Link
            href="/marketplace"
            className="block py-4 bg-slate-800 border border-slate-700 text-white text-center rounded-xl font-bold hover:bg-slate-700 transition"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Receipt Email */}
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-center">
          <p className="text-blue-400 text-sm">
            📧 A receipt has been sent to your email address
          </p>
        </div>
      </div>
    </div>
  );
}
