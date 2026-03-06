import apiClient from './client';

export interface Wallet {
  wallet_id: string;
  user_id: string;
  available_balance: number;
  held_balance: number;
  total_balance: number;
  currency: string;
  total_deposited: number;
  total_withdrawn: number;
  total_earned: number;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  user_id: string;
  transaction_type: 'deposit' | 'withdrawal' | 'bounty_escrow' | 'bounty_payment' | 'bounty_refund' | 'platform_fee' | 'milestone_escrow' | 'milestone_payment';
  amount: number;
  balance_before: number;
  balance_after: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  reference_type?: string;
  reference_id?: string;
  metadata?: any;
  created_at: string;
}

export interface DepositData {
  amount: number;
  payment_method: 'paystack' | 'crypto';
  currency: string;
  callback_url?: string;
}

export interface WithdrawalData {
  amount: number;
  withdrawal_method: 'paystack' | 'crypto';
  // Paystack fields
  bank_code?: string;
  account_number?: string;
  account_name?: string;
  // Crypto fields
  crypto_address?: string;
  crypto_currency?: string;
  crypto_extra_id?: string;
}

export interface PaymentResponse {
  payment_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  // Paystack response
  authorization_url?: string;
  reference?: string;
  // Crypto response
  invoice_url?: string;
  pay_address?: string;
  pay_amount?: number;
  pay_currency?: string;
}

export interface Bank {
  id: number;
  name: string;
  slug: string;
  code: string;
  active: boolean;
  country: string;
  currency: string;
  type: string;
}

export interface CryptoEstimate {
  currency_from: string;
  amount_from: number;
  currency_to: string;
  estimated_amount: number;
}

// Get wallet balance
export const getWalletBalance = async () => {
  const response = await apiClient.get('/wallet/balance');
  return response.data;
};

// Get wallet transactions
export const getWalletTransactions = async (params?: {
  limit?: number;
  page?: number;
  transaction_type?: string;
}) => {
  const response = await apiClient.get('/wallet/transactions', { params });
  return response.data;
};

// Create deposit
export const createDeposit = async (data: DepositData): Promise<PaymentResponse> => {
  const response = await apiClient.post('/payments/deposit', data);
  return response.data;
};

// Create withdrawal
export const createWithdrawal = async (data: WithdrawalData) => {
  const response = await apiClient.post('/payments/withdraw', data);
  return response.data;
};

// Get available currencies
export const getAvailableCurrencies = async () => {
  const response = await apiClient.get('/payments/currencies');
  return response.data;
};

// Get banks (Paystack)
export const getBanks = async (country: string = 'nigeria') => {
  const response = await apiClient.get('/payments/banks', { params: { country } });
  return response.data;
};

// Resolve bank account (Paystack)
export const resolveBankAccount = async (accountNumber: string, bankCode: string) => {
  const response = await apiClient.get('/payments/paystack/resolve-account', {
    params: { account_number: accountNumber, bank_code: bankCode }
  });
  return response.data;
};

// Validate crypto address
export const validateCryptoAddress = async (address: string, currency: string, extraId?: string) => {
  const response = await apiClient.post('/payments/crypto/validate-address', {
    address,
    currency,
    extra_id: extraId
  });
  return response.data;
};

// Get crypto estimate
export const getCryptoEstimate = async (amount: number, currencyFrom: string, currencyTo: string): Promise<CryptoEstimate> => {
  const response = await apiClient.get('/payments/crypto/estimate', {
    params: {
      amount,
      currency_from: currencyFrom,
      currency_to: currencyTo
    }
  });
  return response.data;
};

// Get crypto minimum amount
export const getCryptoMinimum = async (currencyFrom: string, currencyTo: string) => {
  const response = await apiClient.get('/payments/crypto/minimum', {
    params: {
      currency_from: currencyFrom,
      currency_to: currencyTo
    }
  });
  return response.data;
};

// Verify Paystack payment
export const verifyPaystackPayment = async (reference: string) => {
  const response = await apiClient.get(`/wallet/verify/${reference}`);
  return response.data;
};

// Get wallet statistics
export const getWalletStats = async () => {
  const response = await apiClient.get('/wallet/stats');
  return response.data;
};
