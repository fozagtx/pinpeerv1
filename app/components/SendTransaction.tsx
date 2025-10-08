"use client";

import { useState } from "react";

interface SendTransactionProps {
  balance: string;
  onTransactionComplete?: () => void;
}

export default function SendTransaction({
  balance,
  onTransactionComplete
}: SendTransactionProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [txid, setTxid] = useState<string | null>(null);

  // Calculate estimated fee (180 microSTX = 0.00018 STX)
  const estimatedFee = "0.000180";
  const balanceNum = parseFloat(balance) || 0;
  const amountNum = parseFloat(amount) || 0;
  const feeNum = parseFloat(estimatedFee);
  const totalRequired = amountNum + feeNum;
  const hasInsufficientFunds = totalRequired > balanceNum;

  const handleSend = async () => {
    if (!recipient || !amount) {
      setError("Please enter both recipient address and amount");
      return;
    }

    if (hasInsufficientFunds) {
      setError("Insufficient balance for transaction");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setTxid(null);

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient, amount }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Failed to send transaction");
      }

      setSuccess("Transaction broadcast successfully!");
      setTxid(data.txid);
      setRecipient("");
      setAmount("");

      // Callback to refresh parent balance
      if (onTransactionComplete) {
        setTimeout(() => onTransactionComplete(), 2000);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send transaction");
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
    setTxid(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
          Send sBTC Transaction
        </h2>
        <p className="text-text-secondary text-sm">
          Transfer sBTC to any Stacks address on testnet
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-surface rounded-2xl shadow-2xl border border-slate-blue/20 overflow-hidden">
        {/* Card Content */}
        <div className="p-6 md:p-8">
          {/* Recipient Input */}
          <div className="mb-6">
            <label
              htmlFor="recipient"
              className="block text-sm font-semibold text-text-primary mb-3"
            >
              Recipient Address
            </label>
            <input
              id="recipient"
              type="text"
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                clearMessages();
              }}
              placeholder="ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
              className="w-full px-4 py-3.5 bg-deep-charcoal border-2 border-slate-blue/30 rounded-xl
                text-text-primary font-mono text-sm
                placeholder:text-text-secondary/40
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              spellCheck={false}
            />
            {recipient && !recipient.startsWith("ST") && (
              <p className="mt-2 text-xs text-soft-red flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Testnet addresses should start with "ST"
              </p>
            )}
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label
              htmlFor="amount"
              className="block text-sm font-semibold text-text-primary mb-3"
            >
              Amount (STX)
            </label>
            <div className="relative">
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  clearMessages();
                }}
                placeholder="0.000000"
                step="0.000001"
                min="0"
                className="w-full px-4 py-3.5 bg-deep-charcoal border-2 border-slate-blue/30 rounded-xl
                  text-text-primary font-mono text-lg
                  placeholder:text-text-secondary/40
                  focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => {
                  const maxAmount = Math.max(0, balanceNum - feeNum);
                  setAmount(maxAmount.toFixed(6));
                  clearMessages();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2
                  px-3 py-1.5 bg-slate-blue/50 hover:bg-slate-blue
                  text-text-primary text-xs font-semibold rounded-lg
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || balanceNum <= feeNum}
              >
                MAX
              </button>
            </div>
            {hasInsufficientFunds && amount && (
              <p className="mt-2 text-xs text-soft-red flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Insufficient balance
              </p>
            )}
          </div>

          {/* Transaction Summary */}
          <div className="mb-6 p-4 bg-deep-charcoal/50 rounded-xl border border-slate-blue/20">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Amount</span>
                <span className="text-sm font-mono font-semibold text-text-primary">
                  {amount || "0.000000"} STX
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Network Fee</span>
                <span className="text-sm font-mono font-semibold text-text-primary">
                  {estimatedFee} STX
                </span>
              </div>
              <div className="h-px bg-slate-blue/30 my-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-text-primary">Total</span>
                <span className="text-base font-mono font-bold text-primary">
                  {totalRequired.toFixed(6)} STX
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-secondary">Available Balance</span>
                <span className="text-xs font-mono text-text-secondary">
                  {balance} STX
                </span>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={loading || !recipient || !amount || hasInsufficientFunds}
            className="w-full py-4 px-6 rounded-xl font-bold text-base
              bg-gradient-to-r from-warm-orange to-soft-amber
              text-deep-charcoal
              hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02]
              active:scale-[0.98]
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
              transition-all duration-300
              flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Broadcasting Transaction...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Send Transaction</span>
              </>
            )}
          </button>
        </div>

        {/* Status Messages */}
        {(error || success) && (
          <div className="px-6 md:px-8 pb-6">
            {error && (
              <div className="p-4 bg-soft-red/10 border-l-4 border-soft-red rounded-lg
                flex items-start gap-3 animate-in slide-in-from-top duration-300">
                <svg className="w-5 h-5 text-soft-red flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-soft-red mb-1">Transaction Failed</p>
                  <p className="text-sm text-soft-red/90">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-soft-red/60 hover:text-soft-red transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald/10 border-l-4 border-emerald rounded-lg
                flex items-start gap-3 animate-in slide-in-from-top duration-300">
                <svg className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald mb-1">Success!</p>
                  <p className="text-sm text-emerald/90 mb-2">{success}</p>
                  {txid && (
                    <a
                      href={`https://explorer.hiro.so/txid/${txid}?chain=testnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald hover:text-emerald/80 transition-colors"
                    >
                      <span className="truncate max-w-[200px]">{txid}</span>
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSuccess(null);
                    setTxid(null);
                  }}
                  className="text-emerald/60 hover:text-emerald transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-slate-blue/10 border border-slate-blue/20 rounded-xl">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-text-secondary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-text-primary mb-1">Secure Transaction</p>
            <p className="text-xs text-text-secondary leading-relaxed">
              All transactions are signed using Turnkey's secure infrastructure.
              Double-check the recipient address before sending.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
