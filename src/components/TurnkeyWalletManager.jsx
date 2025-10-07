import { useState } from "react";
import { useTurnkey, AuthState } from "@turnkey/react-wallet-kit";
import "../styles/TurnkeyWalletManager.css";

export function TurnkeyWalletManager() {
  const {
    authState,
    user,
    handleLogin,
    createWallet,
    wallets,
    refreshWallets,
    handleImportWallet,
    handleExportWallet,
    createWalletAccounts,
  } = useTurnkey();

  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  const handleCreateWallet = async () => {
    setIsCreatingWallet(true);
    try {
      const walletId = await createWallet({
        walletName: "PinPeer Wallet",
        accounts: ["ADDRESS_FORMAT_ETHEREUM", "ADDRESS_FORMAT_SOLANA"],
      });
      console.log("Wallet created:", walletId);
      await refreshWallets();
    } catch (error) {
      console.error("Error creating wallet:", error);
      alert("Failed to create wallet. Please try again.");
    } finally {
      setIsCreatingWallet(false);
    }
  };

  const handleAddAccount = async (walletId) => {
    try {
      await createWalletAccounts({
        walletId,
        accounts: ["ADDRESS_FORMAT_ETHEREUM"],
      });
      await refreshWallets();
      console.log("Account added successfully");
    } catch (error) {
      console.error("Error adding account:", error);
      alert("Failed to add account. Please try again.");
    }
  };

  if (authState !== AuthState.Authenticated) {
    return (
      <div className="turnkey-container">
        <div className="turnkey-card">
          <h2>Turnkey Embedded Wallet</h2>
          <p>Sign in to manage your embedded wallets</p>
          <button onClick={handleLogin} className="turnkey-button primary">
            Login / Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="turnkey-container">
      <div className="turnkey-card">
        <div className="turnkey-header">
          <h2>Turnkey Embedded Wallet</h2>
          <p className="user-info">Welcome, {user?.userName || "User"}!</p>
        </div>

        <div className="wallet-actions">
          <button
            onClick={handleCreateWallet}
            disabled={isCreatingWallet}
            className="turnkey-button primary"
          >
            {isCreatingWallet ? "Creating..." : "Create New Wallet"}
          </button>
          <button onClick={handleImportWallet} className="turnkey-button">
            Import Wallet
          </button>
          <button onClick={refreshWallets} className="turnkey-button">
            Refresh Wallets
          </button>
        </div>

        {wallets.length > 0 && (
          <div className="wallets-list">
            <h3>Your Wallets ({wallets.length})</h3>
            {wallets.map((wallet) => (
              <div key={wallet.walletId} className="wallet-item">
                <div className="wallet-info">
                  <h4>{wallet.walletName}</h4>
                  <p className="wallet-id">ID: {wallet.walletId}</p>
                  {wallet.accounts && wallet.accounts.length > 0 && (
                    <div className="wallet-accounts">
                      <p className="accounts-label">
                        Accounts: {wallet.accounts.length}
                      </p>
                      {wallet.accounts.map((account, idx) => (
                        <div key={idx} className="account-item">
                          <span className="account-address">
                            {account.address?.substring(0, 10)}...
                            {account.address?.substring(account.address.length - 8)}
                          </span>
                          <span className="account-format">
                            {account.addressFormat}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="wallet-actions-inline">
                  <button
                    onClick={() => handleAddAccount(wallet.walletId)}
                    className="turnkey-button small"
                  >
                    Add Account
                  </button>
                  <button
                    onClick={() =>
                      handleExportWallet({ walletId: wallet.walletId })
                    }
                    className="turnkey-button small"
                  >
                    Export
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {wallets.length === 0 && (
          <div className="no-wallets">
            <p>No wallets found. Create or import a wallet to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
