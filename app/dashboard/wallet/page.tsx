"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";
import { 
  getWalletBalance, 
  getWalletTransactions, 
  createDeposit, 
  createWithdrawal,
  Wallet,
  WalletTransaction 
} from "@/lib/api/wallet";

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [depositMethod, setDepositMethod] = useState<'paystack' | 'crypto'>('paystack');
  const [withdrawMethod, setWithdrawMethod] = useState<'paystack' | 'crypto'>('paystack');
  const [cryptoCurrency, setCryptoCurrency] = useState('btc');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [page, setPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);

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

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message });
  };

  // Fetch wallet balance
  const fetchWallet = async () => {
    try {
      const data = await getWalletBalance();
      setWallet(data);
    } catch (error: any) {
      console.error("Failed to fetch wallet:", error);
      showNotification("error", "Error", "Failed to load wallet balance");
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions
  const fetchTransactions = async (pageNum: number = 1) => {
    try {
      setTransactionsLoading(true);
      const data = await getWalletTransactions({ limit: 20, page: pageNum });
      setTransactions(data.transactions || []);
      setTotalTransactions(data.total || 0);
    } catch (error: any) {
      console.error("Failed to fetch transactions:", error);
      showNotification("error", "Error", "Failed to load transactions");
    } finally {
      setTransactionsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  // Handle deposit
  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      showNotification("error", "Invalid Amount", "Please enter a valid amount");
      return;
    }

    if (amount < 10) {
      showNotification("error", "Minimum Deposit", "Minimum deposit amount is $10");
      return;
    }

    try {
      setProcessing(true);

      // Step 1: Initialize deposit with backend
      const response = await createDeposit({
        amount,
        payment_method: depositMethod,
        currency: depositMethod === 'paystack' ? 'NGN' : cryptoCurrency.toUpperCase(),
        callback_url: `${window.location.origin}/dashboard/wallet`
      });

      if (depositMethod === 'paystack' && response.authorization_url) {
        // Get user email from localStorage
        const userStr = localStorage.getItem('user');
        const userEmail = userStr ? JSON.parse(userStr).email : 'user@example.com';

        // Step 2: Configure Paystack Popup
        const config = {
          reference: response.reference || '',
          email: userEmail,
          amount: amount * 100, // Convert to kobo (NGN smallest unit)
          publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        };

        // Step 3: Initialize Paystack Payment using PaystackButton approach
        const PaystackPop = (window as any).PaystackPop;
        
        if (PaystackPop) {
          const handler = PaystackPop.setup({
            key: config.publicKey,
            email: config.email,
            amount: config.amount,
            ref: config.reference,
            onClose: function() {
              showNotification("info", "Payment Cancelled", 
                "You cancelled the payment");
              setProcessing(false);
            },
            callback: function(response: any) {
              // Step 4: Verify payment with backend (PUBLIC ENDPOINT - no auth needed)
              fetch(
                `http://localhost:8000/api/v1/wallet/verify/${response.reference}`,
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              )
              .then(res => {
                if (!res.ok) {
                  throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
                return res.json();
              })
              .then(result => {
                console.log('Verification result:', result); // Debug log
                
                if (result.status === 'success') {
                  // Update wallet state immediately if backend returns wallet data
                  if (result.wallet_balance) {
                    setWallet(result.wallet_balance);
                  }
                  
                  showNotification("success", "Payment Successful", 
                    `₦${amount.toFixed(2)} has been added to your wallet`);

                  // Close modal
                  setShowDepositModal(false);
                  setDepositAmount("");
                  setProcessing(false);

                  // Refresh data to ensure consistency
                  setTimeout(() => {
                    fetchWallet();
                    fetchTransactions();
                  }, 500);
                } else {
                  showNotification("error", "Payment Failed", 
                    "Payment verification failed. Please contact support if amount was deducted.");
                  setProcessing(false);
                }
              })
              .catch(error => {
                console.error('Verification error:', error);
                showNotification("error", "Verification Error", 
                  `Could not verify payment: ${error.message}. Please check your wallet balance or contact support.`);
                setProcessing(false);
              });
            }
          });
          
          handler.openIframe();
        } else {
          // Fallback to redirect if Paystack inline is not available
          window.location.href = response.authorization_url;
        }

      } else if (depositMethod === 'crypto' && response.invoice_url) {
        // Open crypto payment in new tab
        window.open(response.invoice_url, '_blank');
        showNotification("info", "Payment Initiated", 
          "Complete the payment in the new tab. Your balance will update automatically.");
        setShowDepositModal(false);
        setDepositAmount("");
        setProcessing(false);
      }

    } catch (error: any) {
      console.error("Deposit failed:", error);
      showNotification("error", "Deposit Failed", 
        error.response?.data?.detail || "Failed to deposit funds");
      setProcessing(false);
    }
  };

  // Handle withdrawal
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      showNotification("error", "Invalid Amount", "Please enter a valid amount");
      return;
    }

    if (wallet && amount > Number(wallet.available_balance)) {
      showNotification("error", "Insufficient Funds", `You only have $${Number(wallet.available_balance).toFixed(2)} available`);
      return;
    }

    if (amount < 20) {
      showNotification("error", "Minimum Withdrawal", "Minimum withdrawal amount is $20");
      return;
    }

    // Validate withdrawal method fields
    if (withdrawMethod === 'paystack') {
      if (!bankCode || !accountNumber || !accountName) {
        showNotification("error", "Missing Information", "Please provide bank details");
        return;
      }
    } else if (withdrawMethod === 'crypto') {
      if (!cryptoAddress || !cryptoCurrency) {
        showNotification("error", "Missing Information", "Please provide crypto address and currency");
        return;
      }
    }

    try {
      setProcessing(true);
      await createWithdrawal({
        amount,
        withdrawal_method: withdrawMethod,
        bank_code: withdrawMethod === 'paystack' ? bankCode : undefined,
        account_number: withdrawMethod === 'paystack' ? accountNumber : undefined,
        account_name: withdrawMethod === 'paystack' ? accountName : undefined,
        crypto_address: withdrawMethod === 'crypto' ? cryptoAddress : undefined,
        crypto_currency: withdrawMethod === 'crypto' ? cryptoCurrency.toUpperCase() : undefined
      });
      
      showNotification("success", "Withdrawal Requested", `${amount.toFixed(2)} withdrawal is being processed`);
      setWithdrawAmount("");
      setCryptoAddress("");
      setAccountNumber("");
      setAccountName("");
      setBankCode("");
      setShowWithdrawModal(false);
      
      showNotification("success", "Withdrawal Requested", `$${amount.toFixed(2)} withdrawal is being processed`);
      setWithdrawAmount("");
      setShowWithdrawModal(false);
      
      // Refresh data
      await fetchWallet();
      await fetchTransactions();
    } catch (error: any) {
      console.error("Withdrawal failed:", error);
      showNotification("error", "Withdrawal Failed", error.response?.data?.detail || "Failed to withdraw funds");
    } finally {
      setProcessing(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit": return "💰";
      case "withdrawal": return "🏦";
      case "bounty_escrow": return "🔒";
      case "bounty_payment": return "✅";
      case "bounty_refund": return "↩️";
      case "platform_fee": return "💼";
      case "milestone_escrow": return "🎯";
      case "milestone_payment": return "🎉";
      default: return "💳";
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
      case "bounty_payment":
      case "bounty_refund":
      case "milestone_payment":
        return "text-green-400";
      case "withdrawal":
      case "bounty_escrow":
      case "platform_fee":
      case "milestone_escrow":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 sm:mb-3">
            💳 My <span className="text-orange-500">Wallet</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Manage your funds, deposits, and withdrawals
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Available Balance */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center text-2xl">
                💵
              </div>
              <div>
                <div className="text-sm text-green-300">Available Balance</div>
                <div className="text-3xl font-black text-white">
                  ${wallet ? Number(wallet.available_balance).toFixed(2) : "0.00"}
                </div>
              </div>
            </div>
            <p className="text-xs text-green-200/70">
              Funds you can use or withdraw
            </p>
          </div>

          {/* Held Balance */}
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-500/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-orange-500/30 rounded-xl flex items-center justify-center text-2xl">
                🔒
              </div>
              <div>
                <div className="text-sm text-orange-300">Held in Escrow</div>
                <div className="text-3xl font-black text-white">
                  ${wallet ? Number(wallet.held_balance).toFixed(2) : "0.00"}
                </div>
              </div>
            </div>
            <p className="text-xs text-orange-200/70">
              Locked for active bounties
            </p>
          </div>

          {/* Total Balance */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center text-2xl">
                💎
              </div>
              <div>
                <div className="text-sm text-purple-300">Total Balance</div>
                <div className="text-3xl font-black text-white">
                  ${wallet ? Number(wallet.total_balance).toFixed(2) : "0.00"}
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-200/70">
              Available + Held
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => setShowDepositModal(true)}
            className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-xl hover:border-green-500 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                ➕
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg">Deposit Funds</div>
                <div className="text-sm text-slate-400">Add money to your wallet</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/50 rounded-xl hover:border-blue-500 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                🏦
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg">Withdraw Funds</div>
                <div className="text-sm text-slate-400">Transfer to your bank</div>
              </div>
            </div>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-1">Total Deposited</div>
            <div className="text-2xl font-bold text-white">
              ${wallet ? Number(wallet.total_deposited).toFixed(2) : "0.00"}
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-1">Total Withdrawn</div>
            <div className="text-2xl font-bold text-white">
              ${wallet ? Number(wallet.total_withdrawn).toFixed(2) : "0.00"}
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-1">Total Earned</div>
            <div className="text-2xl font-bold text-green-400">
              ${wallet ? Number(wallet.total_earned).toFixed(2) : "0.00"}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Transaction History</h2>

          {transactionsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📜</div>
              <h3 className="text-xl font-bold text-white mb-2">No Transactions Yet</h3>
              <p className="text-slate-400">Your transaction history will appear here</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-slate-950/50 border border-slate-700 rounded-lg p-4 hover:border-orange-500/50 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="text-3xl flex-shrink-0">
                          {getTransactionIcon(tx.transaction_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white mb-1">
                            {tx.description}
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                            <span className="px-2 py-1 bg-slate-800 rounded">
                              {tx.transaction_type.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded ${
                              tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {tx.status.toUpperCase()}
                            </span>
                            <span>{new Date(tx.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`text-xl font-bold ${getTransactionColor(tx.transaction_type)}`}>
                          {['deposit', 'bounty_payment', 'bounty_refund', 'milestone_payment'].includes(tx.transaction_type) ? '+' : '-'}
                          ${Number(tx.amount).toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-500">
                          Balance: ${Number(tx.balance_after).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalTransactions > 20 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => {
                      const newPage = page - 1;
                      setPage(newPage);
                      fetchTransactions(newPage);
                    }}
                    disabled={page === 1}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-slate-400">
                    Page {page} of {Math.ceil(totalTransactions / 20)}
                  </span>
                  <button
                    onClick={() => {
                      const newPage = page + 1;
                      setPage(newPage);
                      fetchTransactions(newPage);
                    }}
                    disabled={page >= Math.ceil(totalTransactions / 20)}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-green-500/50 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-4">💰 Deposit Funds</h3>
            <p className="text-slate-400 text-sm mb-6">
              Add funds to your wallet. Minimum deposit: $10
            </p>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-3">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDepositMethod('paystack')}
                  className={`p-4 rounded-lg border-2 transition ${
                    depositMethod === 'paystack'
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className="text-2xl mb-2">💳</div>
                  <div className="text-sm font-semibold text-white">Paystack</div>
                  <div className="text-xs text-slate-400">NGN (Naira)</div>
                </button>
                <button
                  onClick={() => setDepositMethod('crypto')}
                  className={`p-4 rounded-lg border-2 transition ${
                    depositMethod === 'crypto'
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className="text-2xl mb-2">₿</div>
                  <div className="text-sm font-semibold text-white">Crypto</div>
                  <div className="text-xs text-slate-400">BTC, ETH, USDT</div>
                </button>
              </div>
            </div>

            {/* Crypto Currency Selection */}
            {depositMethod === 'crypto' && (
              <div className="mb-6">
                <label className="block text-white font-semibold mb-2">Cryptocurrency</label>
                <select
                  value={cryptoCurrency}
                  onChange={(e) => setCryptoCurrency(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
                >
                  <option value="btc">Bitcoin (BTC)</option>
                  <option value="eth">Ethereum (ETH)</option>
                  <option value="usdt">Tether (USDT)</option>
                  <option value="bnb">Binance Coin (BNB)</option>
                  <option value="ltc">Litecoin (LTC)</option>
                </select>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">
                Amount ({depositMethod === 'paystack' ? 'NGN' : cryptoCurrency.toUpperCase()})
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {depositMethod === 'paystack' ? '₦' : cryptoCurrency === 'btc' ? '₿' : '$'}
                </span>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder={depositMethod === 'paystack' ? '5000' : '100'}
                  min="10"
                  step={depositMethod === 'paystack' ? '100' : '10'}
                  className="w-full pl-8 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-green-500 focus:outline-none"
                />
              </div>
              {depositMethod === 'paystack' && (
                <p className="text-xs text-slate-500 mt-2">
                  Minimum: ₦5,000 (~$10 USD)
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDepositModal(false);
                  setDepositAmount("");
                }}
                disabled={processing}
                className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                disabled={processing}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-400 hover:to-emerald-400 transition font-semibold disabled:opacity-50 shadow-lg shadow-green-500/50"
              >
                {processing ? "Processing..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-blue-500/50 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-4">🏦 Withdraw Funds</h3>
            <p className="text-slate-400 text-sm mb-2">
              Transfer funds to your account. Minimum withdrawal: $20
            </p>
            <p className="text-green-400 text-sm mb-6">
              Available: ${wallet ? Number(wallet.available_balance).toFixed(2) : "0.00"}
            </p>

            {/* Withdrawal Method Selection */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-3">Withdrawal Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setWithdrawMethod('paystack')}
                  className={`p-4 rounded-lg border-2 transition ${
                    withdrawMethod === 'paystack'
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className="text-2xl mb-2">🏦</div>
                  <div className="text-sm font-semibold text-white">Bank Account</div>
                  <div className="text-xs text-slate-400">Paystack (NGN)</div>
                </button>
                <button
                  onClick={() => setWithdrawMethod('crypto')}
                  className={`p-4 rounded-lg border-2 transition ${
                    withdrawMethod === 'crypto'
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className="text-2xl mb-2">₿</div>
                  <div className="text-sm font-semibold text-white">Crypto Wallet</div>
                  <div className="text-xs text-slate-400">BTC, ETH, USDT</div>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="50"
                  min="20"
                  max={wallet ? Number(wallet.available_balance) : 0}
                  step="10"
                  className="w-full pl-8 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Bank Account Fields (Paystack) */}
            {withdrawMethod === 'paystack' && (
              <>
                <div className="mb-4">
                  <label className="block text-white font-semibold mb-2">Bank</label>
                  <select
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select Bank</option>
                    <option value="044">Access Bank</option>
                    <option value="063">Access Bank (Diamond)</option>
                    <option value="050">Ecobank Nigeria</option>
                    <option value="070">Fidelity Bank</option>
                    <option value="011">First Bank of Nigeria</option>
                    <option value="214">First City Monument Bank</option>
                    <option value="058">Guaranty Trust Bank</option>
                    <option value="030">Heritage Bank</option>
                    <option value="301">Jaiz Bank</option>
                    <option value="082">Keystone Bank</option>
                    <option value="526">Parallex Bank</option>
                    <option value="076">Polaris Bank</option>
                    <option value="101">Providus Bank</option>
                    <option value="221">Stanbic IBTC Bank</option>
                    <option value="068">Standard Chartered Bank</option>
                    <option value="232">Sterling Bank</option>
                    <option value="100">Suntrust Bank</option>
                    <option value="032">Union Bank of Nigeria</option>
                    <option value="033">United Bank For Africa</option>
                    <option value="215">Unity Bank</option>
                    <option value="035">Wema Bank</option>
                    <option value="057">Zenith Bank</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-white font-semibold mb-2">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="0123456789"
                    maxLength={10}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-2">Account Name</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            {/* Crypto Wallet Fields */}
            {withdrawMethod === 'crypto' && (
              <>
                <div className="mb-4">
                  <label className="block text-white font-semibold mb-2">Cryptocurrency</label>
                  <select
                    value={cryptoCurrency}
                    onChange={(e) => setCryptoCurrency(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="btc">Bitcoin (BTC)</option>
                    <option value="eth">Ethereum (ETH)</option>
                    <option value="usdt">Tether (USDT)</option>
                    <option value="bnb">Binance Coin (BNB)</option>
                    <option value="ltc">Litecoin (LTC)</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-2">Wallet Address</label>
                  <input
                    type="text"
                    value={cryptoAddress}
                    onChange={(e) => setCryptoAddress(e.target.value)}
                    placeholder="Enter your crypto wallet address"
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none font-mono text-sm"
                  />
                  <p className="text-xs text-yellow-400 mt-2">
                    ⚠️ Double-check your address. Crypto transactions cannot be reversed.
                  </p>
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount("");
                  setCryptoAddress("");
                  setAccountNumber("");
                  setAccountName("");
                  setBankCode("");
                }}
                disabled={processing}
                className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={processing}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-400 hover:to-cyan-400 transition font-semibold disabled:opacity-50 shadow-lg shadow-blue-500/50"
              >
                {processing ? "Processing..." : "Withdraw"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
