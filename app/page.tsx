"use client";

import { useState, useEffect } from "react";
import SendTransaction from "./components/SendTransaction";

export default function Home() {
  const [balance, setBalance] = useState<string>("0");
  const [address, setAddress] = useState<string>("Loading...");
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [showFaucetSuccess, setShowFaucetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get wallet address on load
  useEffect(() => {
    fetchWalletInfo();
  }, []);

  const fetchWalletInfo = async () => {
    try {
      const res = await fetch("/api/wallet-info");
      const data = await res.json();
      if (data.address) {
        setAddress(data.address);
        setBalance(data.balance || "0");
      }
    } catch (e) {
      console.error("Failed to load wallet", e);
      setAddress("Error loading address");
    } finally {
      setLoadingWallet(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setSuccess("Address copied to clipboard!");
    setTimeout(() => setSuccess(null), 2000);
  };

  const claimFaucet = async () => {
    setLoading(true);
    setSuccess(null);

    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Failed to claim");
      }

      setShowFaucetSuccess(true);

      // Refresh balance after 30 seconds
      setTimeout(() => {
        fetchWalletInfo();
      }, 30000);
    } catch (e) {
      setSuccess(
        e instanceof Error ? e.message : "Failed to claim testnet STX",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-slate-blue/20 bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warm-orange to-soft-amber flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-deep-charcoal"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">
                  sBTC Wallet
                </h1>
                <p className="text-xs text-text-secondary">
                  Powered by Turnkey
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald/10 border border-emerald/20 rounded-lg">
                <div className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-emerald">
                  Testnet
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Sidebar - Wallet Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-surface to-deep-charcoal rounded-2xl shadow-2xl border border-slate-blue/20 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-text-secondary">
                    Total Balance
                  </span>
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                {loadingWallet ? (
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <span className="text-text-secondary text-sm">
                      Loading...
                    </span>
                  </div>
                ) : (
                  <div className="mb-6">
                    <p className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-warm-orange to-soft-amber mb-1">
                      {balance}
                    </p>
                    <p className="text-lg font-semibold text-text-secondary">
                      STX
                    </p>
                  </div>
                )}

                <div className="h-px bg-slate-blue/30 mb-4" />

                {/* Address Section */}
                <div>
                  <label className="text-xs font-semibold text-text-secondary mb-2 block">
                    Your Wallet Address
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={address}
                      readOnly
                      className="flex-1 px-3 py-2 bg-deep-charcoal border border-slate-blue/30 rounded-lg
                        text-xs font-mono text-text-primary
                        focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                    <button
                      onClick={copyAddress}
                      className="px-3 py-2 bg-slate-blue hover:bg-slate-blue/80 rounded-lg
                        transition-all duration-200 group"
                      title="Copy address"
                    >
                      <svg
                        className="w-4 h-4 text-text-primary group-hover:text-primary transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Faucet Button */}
                {parseFloat(balance) < 10 && (
                  <button
                    onClick={claimFaucet}
                    disabled={loading}
                    className="w-full mt-4 px-4 py-3 bg-emerald hover:bg-emerald/90
                      disabled:opacity-50 disabled:cursor-not-allowed
                      text-white font-semibold rounded-xl
                      transition-all duration-200
                      flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Claiming...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Get Testnet STX
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-surface rounded-2xl shadow-xl border border-slate-blue/20 p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4">
                Network Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Network</span>
                  <span className="text-xs font-semibold text-text-primary">
                    Stacks Testnet
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">
                    Fee Estimate
                  </span>
                  <span className="text-xs font-semibold text-text-primary">
                    0.000180 STX
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Status</span>
                  <span className="text-xs font-semibold text-emerald flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main - Send Transaction */}
          <div className="lg:col-span-2">
            <SendTransaction
              balance={balance}
              onTransactionComplete={fetchWalletInfo}
            />
          </div>
        </div>

        {/* Toast Notifications */}
        {success && (
          <div className="fixed bottom-6 right-6 max-w-sm animate-in slide-in-from-bottom duration-300">
            <div className="bg-surface border border-emerald/20 rounded-xl shadow-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-emerald"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-text-primary flex-1">
                {success}
              </p>
              <button
                onClick={() => setSuccess(null)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {showFaucetSuccess && (
          <div className="fixed bottom-6 right-6 max-w-md animate-in slide-in-from-bottom duration-300">
            <div className="bg-surface border border-emerald/20 rounded-xl shadow-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-emerald"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald mb-1">
                    Faucet Request Sent!
                  </p>
                  <p className="text-xs text-text-secondary">
                    Your testnet STX will arrive in ~30 seconds.
                  </p>
                </div>
                <button
                  onClick={() => setShowFaucetSuccess(false)}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-blue/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-text-secondary">
              Secured by Turnkey • Powered by Stacks
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://explorer.hiro.so/?chain=testnet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-text-secondary hover:text-primary transition-colors"
              >
                Block Explorer
              </a>
              <a
                href="https://www.hiro.so/wallet/install-web"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-text-secondary hover:text-primary transition-colors"
              >
                Get Hiro Wallet
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
