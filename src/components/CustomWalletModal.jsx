import { useState } from "react";
import { useModal, useTurnkey } from "@turnkey/react-wallet-kit";
import "../styles/CustomWalletModal.css";

/**
 * Custom modal for wallet selection and quick actions
 * Uses Turnkey's useModal hook for consistent styling
 */
export function CustomWalletModal() {
  const { pushPage } = useModal();

  const openWalletSelectionModal = () => {
    pushPage({
      key: "wallet-selection",
      content: <WalletSelectionContent />,
    });
  };

  return (
    <button onClick={openWalletSelectionModal} className="custom-modal-trigger">
      Select Wallet
    </button>
  );
}

function WalletSelectionContent() {
  const { pushPage } = useModal();
  const { wallets, handleConnectExternalWallet, createWallet } = useTurnkey();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateWallet = async () => {
    setIsCreating(true);
    try {
      await createWallet({
        walletName: `PinPeer Wallet ${wallets.length + 1}`,
        accounts: [
          "ADDRESS_FORMAT_ETHEREUM",
          "ADDRESS_FORMAT_SOLANA",
          "ADDRESS_FORMAT_STACKS",
        ],
      });
    } catch (error) {
      console.error("Error creating wallet:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const openWalletDetails = (wallet) => {
    pushPage({
      key: `wallet-details-${wallet.walletId}`,
      content: <WalletDetailsContent wallet={wallet} />,
    });
  };

  return (
    <div className="custom-wallet-modal">
      <h2>Your Wallets</h2>

      {wallets.length === 0 ? (
        <div className="no-wallets">
          <p>No wallets yet. Create or connect one to get started!</p>
        </div>
      ) : (
        <div className="wallet-list">
          {wallets.map((wallet) => (
            <button
              key={wallet.walletId}
              onClick={() => openWalletDetails(wallet)}
              className="wallet-item"
            >
              <div className="wallet-icon">💼</div>
              <div className="wallet-info">
                <div className="wallet-name">{wallet.walletName}</div>
                <div className="wallet-accounts">
                  {wallet.accounts?.length || 0} account(s)
                </div>
              </div>
              <div className="wallet-arrow">→</div>
            </button>
          ))}
        </div>
      )}

      <div className="wallet-actions">
        <button
          onClick={handleCreateWallet}
          disabled={isCreating}
          className="action-button primary"
        >
          {isCreating ? "Creating..." : "➕ Create New Wallet"}
        </button>
        <button
          onClick={handleConnectExternalWallet}
          className="action-button secondary"
        >
          🔗 Connect External Wallet
        </button>
      </div>
    </div>
  );
}

function WalletDetailsContent({ wallet }) {
  const { pushPage } = useModal();
  const { signMessage } = useTurnkey();

  const handleQuickSign = async (account) => {
    try {
      const message = `Hello from PinPeer!\nWallet: ${wallet.walletName}\nAccount: ${account.address}`;
      const signature = await signMessage({
        walletAccount: account,
        message,
      });

      pushPage({
        key: "signature-result",
        content: (
          <div className="signature-result-modal">
            <h3>✅ Message Signed!</h3>
            <div className="signature-box">
              <pre>{signature}</pre>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(signature)}
              className="action-button primary"
            >
              Copy Signature
            </button>
          </div>
        ),
      });
    } catch (error) {
      console.error("Signing failed:", error);
    }
  };

  return (
    <div className="wallet-details-modal">
      <h2>{wallet.walletName}</h2>
      <div className="wallet-source-badge">
        {wallet.source === "embedded" ? "🔐 Embedded" : "🔗 Connected"}
      </div>

      {wallet.accounts && wallet.accounts.length > 0 ? (
        <div className="accounts-section">
          <h3>Accounts</h3>
          {wallet.accounts.map((account, idx) => (
            <div key={idx} className="account-card">
              <div className="account-header">
                <span className="account-format">
                  {account.addressFormat.replace("ADDRESS_FORMAT_", "")}
                </span>
              </div>
              <div className="account-address">
                {account.address.substring(0, 12)}...
                {account.address.substring(account.address.length - 10)}
              </div>
              <button
                onClick={() => handleQuickSign(account)}
                className="quick-action-button"
              >
                ✍️ Quick Sign
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-accounts">
          <p>No accounts in this wallet</p>
        </div>
      )}
    </div>
  );
}

export default CustomWalletModal;
