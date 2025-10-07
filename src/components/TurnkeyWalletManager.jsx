import { useState, useEffect } from "react";
import { useTurnkey, AuthState } from "@turnkey/react-wallet-kit";
import { SigningManager } from "./SigningManager";
import { StacksTransactionTester } from "./StacksTransactionTester";
import "../styles/TurnkeyWalletManager.css";

export function TurnkeyWalletManager() {
  console.log("TurnkeyWalletManager component rendering");

  const turnkeyHook = useTurnkey();
  console.log("Turnkey hook result:", turnkeyHook);

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
    handleConnectExternalWallet,
    fetchWalletProviders,
    connectWalletAccount,
    disconnectWalletAccount,
  } = turnkeyHook;

  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [externalProviders, setExternalProviders] = useState([]);
  const [showExternalWallets, setShowExternalWallets] = useState(false);
  const [showSigningManager, setShowSigningManager] = useState(false);
  const [showStacksTester, setShowStacksTester] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("TurnkeyWalletManager - authState:", authState);
    console.log("TurnkeyWalletManager - user:", user);
    console.log("TurnkeyWalletManager - wallets:", wallets);
  }, [authState, user, wallets]);

  // Fetch available external wallet providers
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const providers = await fetchWalletProviders();
        setExternalProviders(providers);
      } catch (error) {
        console.error("Error fetching wallet providers:", error);
      }
    };
    if (authState === AuthState.Authenticated) {
      loadProviders();
    }
  }, [authState, fetchWalletProviders]);

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

  const handleConnectExternal = async (provider) => {
    try {
      await connectWalletAccount(provider);
      await refreshWallets();
      console.log("External wallet connected:", provider);
    } catch (error) {
      console.error("Error connecting external wallet:", error);
      alert("Failed to connect external wallet. Please try again.");
    }
  };

  const handleDisconnectExternal = async (provider) => {
    try {
      await disconnectWalletAccount(provider);
      await refreshWallets();
      console.log("External wallet disconnected:", provider);
    } catch (error) {
      console.error("Error disconnecting external wallet:", error);
      alert("Failed to disconnect external wallet. Please try again.");
    }
  };

  // Show loading state while authentication is in progress
  if (authState === AuthState.Authenticating) {
    return (
      <div className="turnkey-container">
        <div className="turnkey-card">
          <h2>Turnkey Embedded Wallet</h2>
          <p>Authenticating...</p>
          <div className="loading-spinner">⏳</div>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (authState !== AuthState.Authenticated) {
    return (
      <div className="turnkey-container">
        <div className="turnkey-card">
          <h2>Turnkey Embedded Wallet</h2>
          <p>Sign in to manage your embedded wallets</p>
          <p className="auth-instructions">
            Click below to create an account or log in using email, passkey, or
            social login.
          </p>
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
          <button
            onClick={handleConnectExternalWallet}
            className="turnkey-button primary"
          >
            Connect External Wallet
          </button>
          <button
            onClick={() => setShowExternalWallets(!showExternalWallets)}
            className="turnkey-button"
          >
            {showExternalWallets ? "Hide" : "Show"} External Wallets
          </button>
          <button onClick={refreshWallets} className="turnkey-button">
            Refresh Wallets
          </button>
          <button
            onClick={() => setShowSigningManager(!showSigningManager)}
            className="turnkey-button"
          >
            {showSigningManager ? "Hide" : "Show"} Signing Interface
          </button>
          <button
            onClick={() => setShowStacksTester(!showStacksTester)}
            className="turnkey-button primary"
          >
            {showStacksTester ? "Hide" : "Show"} Stacks Tester
          </button>
        </div>

        {/* Stacks Transaction Tester */}
        {showStacksTester && (
          <div style={{ marginBottom: "2rem" }}>
            <StacksTransactionTester />
          </div>
        )}

        {/* Signing Manager */}
        {showSigningManager && (
          <div style={{ marginBottom: "2rem" }}>
            <SigningManager />
          </div>
        )}

        {showExternalWallets && externalProviders.length > 0 && (
          <div className="wallets-list">
            <h3>Available External Wallets ({externalProviders.length})</h3>
            {externalProviders.map((provider, index) => (
              <div key={index} className="wallet-item">
                <div className="wallet-info">
                  <h4>{provider.name || "Unknown Provider"}</h4>
                  <p className="wallet-id">
                    Type: {provider.type || "External"}
                  </p>
                  {provider.connectedAddresses &&
                    provider.connectedAddresses.length > 0 && (
                      <div className="wallet-accounts">
                        <p className="accounts-label">
                          Connected: {provider.connectedAddresses.length}{" "}
                          address(es)
                        </p>
                        {provider.connectedAddresses.map((address, idx) => (
                          <div key={idx} className="account-item">
                            <span className="account-address">
                              {address.substring(0, 10)}...
                              {address.substring(address.length - 8)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
                <div className="wallet-actions-inline">
                  {provider.connectedAddresses &&
                  provider.connectedAddresses.length > 0 ? (
                    <button
                      onClick={() => handleDisconnectExternal(provider)}
                      className="turnkey-button small"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnectExternal(provider)}
                      className="turnkey-button small primary"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {wallets.length > 0 && (
          <div className="wallets-list">
            <h3>Your Embedded Wallets ({wallets.length})</h3>
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
                            {account.address?.substring(
                              account.address.length - 8,
                            )}
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
