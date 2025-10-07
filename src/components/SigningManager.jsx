import { useState } from "react";
import { useTurnkey, WalletSource } from "@turnkey/react-wallet-kit";
import "../styles/SigningManager.css";

export function SigningManager() {
  const {
    wallets,
    signMessage,
    handleSignMessage,
    signTransaction,
    signAndSendTransaction,
  } = useTurnkey();

  const [selectedWallet, setSelectedWallet] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [messageToSign, setMessageToSign] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [transactionData, setTransactionData] = useState("");
  const [signedTransaction, setSignedTransaction] = useState("");
  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const [isSigningTransaction, setIsSigningTransaction] = useState(false);
  const [activeTab, setActiveTab] = useState("message"); // 'message' or 'transaction'

  // Group wallets by source
  const embeddedWallets = wallets.filter(
    (w) => w.source === WalletSource.Embedded
  );
  const connectedWallets = wallets.filter(
    (w) => w.source === WalletSource.Connected
  );

  const handleWalletSelect = (wallet, account) => {
    setSelectedWallet(wallet);
    setSelectedAccount(account);
    setSignedMessage("");
    setSignedTransaction("");
  };

  const handleSignMessageClick = async (useModal = false) => {
    if (!selectedAccount) {
      alert("Please select a wallet account first");
      return;
    }

    if (!messageToSign.trim()) {
      alert("Please enter a message to sign");
      return;
    }

    setIsSigningMessage(true);
    try {
      const signFunction = useModal ? handleSignMessage : signMessage;
      const signature = await signFunction({
        walletAccount: selectedAccount,
        message: messageToSign,
      });

      setSignedMessage(signature);
      console.log("Message signed successfully:", signature);
    } catch (error) {
      console.error("Error signing message:", error);
      alert(`Failed to sign message: ${error.message}`);
    } finally {
      setIsSigningMessage(false);
    }
  };

  const handleSignTransactionClick = async () => {
    if (!selectedAccount) {
      alert("Please select a wallet account first");
      return;
    }

    if (!transactionData.trim()) {
      alert("Please enter transaction data to sign");
      return;
    }

    setIsSigningTransaction(true);
    try {
      // Determine transaction type based on account format
      let transactionType;
      if (selectedAccount.addressFormat === "ADDRESS_FORMAT_ETHEREUM") {
        transactionType = "TRANSACTION_TYPE_ETHEREUM";
      } else if (selectedAccount.addressFormat === "ADDRESS_FORMAT_SOLANA") {
        transactionType = "TRANSACTION_TYPE_SOLANA";
      } else {
        transactionType = "TRANSACTION_TYPE_STACKS";
      }

      const signature = await signTransaction({
        walletAccount: selectedAccount,
        unsignedTransaction: transactionData,
        transactionType,
      });

      setSignedTransaction(signature);
      console.log("Transaction signed successfully:", signature);
    } catch (error) {
      console.error("Error signing transaction:", error);
      alert(`Failed to sign transaction: ${error.message}`);
    } finally {
      setIsSigningTransaction(false);
    }
  };

  const handleSignAndSendClick = async () => {
    if (!selectedAccount) {
      alert("Please select a wallet account first");
      return;
    }

    if (!transactionData.trim()) {
      alert("Please enter transaction data to sign and send");
      return;
    }

    setIsSigningTransaction(true);
    try {
      // Determine transaction type based on account format
      let transactionType;
      if (selectedAccount.addressFormat === "ADDRESS_FORMAT_ETHEREUM") {
        transactionType = "TRANSACTION_TYPE_ETHEREUM";
      } else if (selectedAccount.addressFormat === "ADDRESS_FORMAT_SOLANA") {
        transactionType = "TRANSACTION_TYPE_SOLANA";
      } else {
        transactionType = "TRANSACTION_TYPE_STACKS";
      }

      const txHash = await signAndSendTransaction({
        walletAccount: selectedAccount,
        unsignedTransaction: transactionData,
        transactionType,
      });

      setSignedTransaction(`Transaction Hash: ${txHash}`);
      console.log("Transaction sent successfully:", txHash);
      alert(`Transaction sent! Hash: ${txHash}`);
    } catch (error) {
      console.error("Error signing and sending transaction:", error);
      alert(`Failed to sign and send transaction: ${error.message}`);
    } finally {
      setIsSigningTransaction(false);
    }
  };

  return (
    <div className="signing-container">
      <div className="signing-card">
        <h2>Sign Messages & Transactions</h2>

        {wallets.length === 0 ? (
          <div className="no-wallets-message">
            <p>No wallets available. Create or connect a wallet first.</p>
          </div>
        ) : (
          <>
            {/* Wallet Selection */}
            <div className="wallet-selection">
              <h3>Select Wallet Account</h3>

              {embeddedWallets.length > 0 && (
                <div className="wallet-group">
                  <h4>Embedded Wallets</h4>
                  {embeddedWallets.map((wallet) => (
                    <div key={wallet.walletId} className="wallet-section">
                      <div className="wallet-name">{wallet.walletName}</div>
                      {wallet.accounts?.map((account) => (
                        <button
                          key={account.walletAccountId}
                          onClick={() => handleWalletSelect(wallet, account)}
                          className={`account-button ${
                            selectedAccount?.walletAccountId ===
                            account.walletAccountId
                              ? "selected"
                              : ""
                          }`}
                        >
                          <span className="account-format">
                            {account.addressFormat.replace(
                              "ADDRESS_FORMAT_",
                              ""
                            )}
                          </span>
                          <span className="account-address">
                            {account.address.substring(0, 10)}...
                            {account.address.substring(
                              account.address.length - 8
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {connectedWallets.length > 0 && (
                <div className="wallet-group">
                  <h4>Connected External Wallets</h4>
                  {connectedWallets.map((wallet) => (
                    <div key={wallet.walletId} className="wallet-section">
                      <div className="wallet-name">{wallet.walletName}</div>
                      {wallet.accounts?.map((account) => (
                        <button
                          key={account.walletAccountId}
                          onClick={() => handleWalletSelect(wallet, account)}
                          className={`account-button ${
                            selectedAccount?.walletAccountId ===
                            account.walletAccountId
                              ? "selected"
                              : ""
                          }`}
                        >
                          <span className="account-format">
                            {account.addressFormat.replace(
                              "ADDRESS_FORMAT_",
                              ""
                            )}
                          </span>
                          <span className="account-address">
                            {account.address.substring(0, 10)}...
                            {account.address.substring(
                              account.address.length - 8
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Signing Interface */}
            {selectedAccount && (
              <div className="signing-interface">
                <div className="selected-account-info">
                  <strong>Selected Account:</strong>{" "}
                  {selectedWallet?.walletName} -{" "}
                  {selectedAccount.addressFormat.replace(
                    "ADDRESS_FORMAT_",
                    ""
                  )}{" "}
                  ({selectedAccount.address.substring(0, 10)}...
                  {selectedAccount.address.substring(
                    selectedAccount.address.length - 8
                  )})
                </div>

                {/* Tabs */}
                <div className="signing-tabs">
                  <button
                    onClick={() => setActiveTab("message")}
                    className={`tab-button ${
                      activeTab === "message" ? "active" : ""
                    }`}
                  >
                    Sign Message
                  </button>
                  <button
                    onClick={() => setActiveTab("transaction")}
                    className={`tab-button ${
                      activeTab === "transaction" ? "active" : ""
                    }`}
                  >
                    Sign Transaction
                  </button>
                </div>

                {/* Message Signing */}
                {activeTab === "message" && (
                  <div className="signing-section">
                    <label>Message to Sign:</label>
                    <textarea
                      value={messageToSign}
                      onChange={(e) => setMessageToSign(e.target.value)}
                      placeholder="Enter your message here..."
                      rows={4}
                      className="signing-input"
                    />

                    <div className="signing-actions">
                      <button
                        onClick={() => handleSignMessageClick(false)}
                        disabled={isSigningMessage}
                        className="sign-button primary"
                      >
                        {isSigningMessage ? "Signing..." : "Sign Message"}
                      </button>
                      <button
                        onClick={() => handleSignMessageClick(true)}
                        disabled={isSigningMessage}
                        className="sign-button"
                      >
                        {isSigningMessage
                          ? "Signing..."
                          : "Sign with Modal"}
                      </button>
                    </div>

                    {signedMessage && (
                      <div className="signature-result">
                        <label>Signature:</label>
                        <pre>{signedMessage}</pre>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(signedMessage)
                          }
                          className="copy-button"
                        >
                          Copy Signature
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Transaction Signing */}
                {activeTab === "transaction" && (
                  <div className="signing-section">
                    <label>Transaction Data (Hex):</label>
                    <textarea
                      value={transactionData}
                      onChange={(e) => setTransactionData(e.target.value)}
                      placeholder="Enter unsigned transaction data (hex format)..."
                      rows={4}
                      className="signing-input"
                    />

                    <div className="signing-actions">
                      <button
                        onClick={handleSignTransactionClick}
                        disabled={isSigningTransaction}
                        className="sign-button primary"
                      >
                        {isSigningTransaction
                          ? "Signing..."
                          : "Sign Transaction"}
                      </button>
                      <button
                        onClick={handleSignAndSendClick}
                        disabled={isSigningTransaction}
                        className="sign-button"
                      >
                        {isSigningTransaction
                          ? "Signing..."
                          : "Sign & Send"}
                      </button>
                    </div>

                    {signedTransaction && (
                      <div className="signature-result">
                        <label>Result:</label>
                        <pre>{signedTransaction}</pre>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(signedTransaction)
                          }
                          className="copy-button"
                        >
                          Copy Result
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
