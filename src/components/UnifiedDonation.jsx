import { useState, useEffect } from "react";
import { openSTXTransfer, isConnected } from "@stacks/connect";
import { STACKS_TESTNET } from "@stacks/network";
import { useTurnkey, AuthState } from "@turnkey/react-wallet-kit";
import { useTurnkeyDonation } from "./DonationHelper";
import "../styles/UnifiedDonation.css";

/**
 * Unified Donation Component
 * Supports both Stacks Connect and Turnkey embedded wallets
 */
export function UnifiedDonation({
  creatorName,
  recipientAddress,
  amount,
  onSuccess,
  onCancel,
}) {
  const { authState } = useTurnkey();
  const { sendSTXWithTurnkey, getStacksAccounts } =
    useTurnkeyDonation("testnet");
  const [walletType, setWalletType] = useState("stacks-connect"); // 'stacks-connect' or 'turnkey'
  const [selectedTurnkeyAccount, setSelectedTurnkeyAccount] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const stacksConnectAvailable = isConnected();
  const turnkeyAuthenticated = authState === AuthState.Authenticated;
  const turnkeyAccounts = getStacksAccounts();
  const hasTurnkeyWallets = turnkeyAccounts.length > 0;

  // Determine available wallet options
  const canUseStacksConnect = stacksConnectAvailable;
  const canUseTurnkey = turnkeyAuthenticated && hasTurnkeyWallets;

  // Debug logging
  console.log("💰 UnifiedDonation - Wallet Detection:", {
    stacksConnectAvailable,
    turnkeyAuthenticated,
    turnkeyAccountsCount: turnkeyAccounts.length,
    canUseStacksConnect,
    canUseTurnkey,
    authState,
  });

  // Auto-select wallet type based on availability
  useEffect(() => {
    if (canUseTurnkey && !canUseStacksConnect) {
      setWalletType("turnkey");
      if (turnkeyAccounts.length > 0) {
        setSelectedTurnkeyAccount(turnkeyAccounts[0]);
      }
    }
  }, [canUseTurnkey, canUseStacksConnect, turnkeyAccounts]);

  const handleDonateWithStacksConnect = async () => {
    setIsSending(true);
    setError(null);

    try {
      await openSTXTransfer({
        recipient: recipientAddress,
        amount: (amount * 1000000).toString(),
        memo: `Pinning ${creatorName} on PinPeer`,
        network: STACKS_TESTNET,
        onFinish: (data) => {
          console.log("Transaction submitted:", data.txId);
          onSuccess?.({
            txId: data.txId,
            amount,
            creatorName,
            recipient: recipientAddress,
            walletType: "stacks-connect",
          });
          setIsSending(false);
        },
        onCancel: () => {
          console.log("Transaction cancelled");
          onCancel?.();
          setIsSending(false);
        },
      });
    } catch (error) {
      console.error("Error with Stacks Connect:", error);
      setError(error.message);
      setIsSending(false);
    }
  };

  const handleDonateWithTurnkey = async () => {
    if (!selectedTurnkeyAccount) {
      setError("Please select a Turnkey wallet");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const txid = await sendSTXWithTurnkey({
        recipientAddress,
        amount,
        memo: `Pinning ${creatorName} on PinPeer`,
        walletAccount: selectedTurnkeyAccount,
      });

      console.log("Turnkey transaction sent:", txid);
      onSuccess?.({
        txId: txid,
        amount,
        creatorName,
        recipient: recipientAddress,
        walletType: "turnkey",
      });
    } catch (error) {
      console.error("Error with Turnkey:", error);
      setError(error.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleDonate = async () => {
    if (walletType === "stacks-connect") {
      await handleDonateWithStacksConnect();
    } else {
      await handleDonateWithTurnkey();
    }
  };

  if (!canUseStacksConnect && !canUseTurnkey) {
    return (
      <div className="unified-donation no-wallet">
        <div className="no-wallet-message">
          <h4>No Wallet Available</h4>
          <p>Connect a Stacks wallet or create a Turnkey wallet to donate.</p>
          <div className="wallet-options">
            <button className="option-btn stacks">Connect Stacks Wallet</button>
            <button className="option-btn turnkey">
              Create Turnkey Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="unified-donation">
      <div className="donation-header">
        <h3>
          Donate {amount} STX to {creatorName}
        </h3>
        <p className="recipient-address">
          To: {recipientAddress.substring(0, 12)}...
          {recipientAddress.substring(recipientAddress.length - 8)}
        </p>
      </div>

      {/* Wallet Type Selection */}
      {canUseStacksConnect && canUseTurnkey && (
        <div className="wallet-type-selector">
          <p className="selector-label">Choose Wallet:</p>
          <div className="wallet-type-options">
            <button
              onClick={() => setWalletType("stacks-connect")}
              className={`wallet-type-btn ${
                walletType === "stacks-connect" ? "active" : ""
              }`}
            >
              <span className="wallet-icon">🔗</span>
              <span className="wallet-name">Stacks Connect</span>
              <span className="wallet-desc">Hiro/Leather</span>
            </button>
            <button
              onClick={() => setWalletType("turnkey")}
              className={`wallet-type-btn ${
                walletType === "turnkey" ? "active" : ""
              }`}
            >
              <span className="wallet-icon">🔐</span>
              <span className="wallet-name">Turnkey</span>
              <span className="wallet-desc">Embedded Wallet</span>
            </button>
          </div>
        </div>
      )}

      {/* Turnkey Account Selection */}
      {walletType === "turnkey" && turnkeyAccounts.length > 0 && (
        <div className="turnkey-account-selector">
          <p className="selector-label">Select Turnkey Account:</p>
          <div className="account-options">
            {turnkeyAccounts.map((account, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTurnkeyAccount(account)}
                className={`account-option ${
                  selectedTurnkeyAccount === account ? "active" : ""
                }`}
              >
                <span className="account-number">Account {idx + 1}</span>
                <span className="account-address-short">
                  {account.address?.substring(0, 8)}...
                  {account.address?.substring(account.address.length - 6)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="donation-error">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
        </div>
      )}

      {/* Donate Button */}
      <button
        onClick={handleDonate}
        disabled={
          isSending || (walletType === "turnkey" && !selectedTurnkeyAccount)
        }
        className="donate-btn"
      >
        {isSending ? (
          <>
            <span className="spinner">⏳</span>
            <span>Sending...</span>
          </>
        ) : (
          <>
            <span className="btn-icon">💝</span>
            <span>Donate {amount} STX</span>
          </>
        )}
      </button>

      <div className="donation-footer">
        <p className="network-info">🧪 Testnet Transaction</p>
        <p className="wallet-info">
          Using:{" "}
          {walletType === "stacks-connect"
            ? "Stacks Connect"
            : "Turnkey Embedded Wallet"}
        </p>
      </div>
    </div>
  );
}

export default UnifiedDonation;
