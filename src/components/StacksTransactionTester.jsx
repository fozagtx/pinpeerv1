import { useState } from "react";
import { useTurnkeyDonation } from "./DonationHelper";
import "../styles/StacksTransactionTester.css";

/**
 * Stacks Transaction Tester Component
 *
 * Test Stacks transaction signing with Turnkey embedded wallets
 * Demonstrates:
 * - Address derivation
 * - Balance fetching
 * - STX transfers
 * - Message signing
 */
export function StacksTransactionTester() {
  const {
    getStacksAccounts,
    getStacksAddress,
    fetchBalance,
    sendSTXWithTurnkey,
    signStacksMessage,
    hasStacksWallets,
  } = useTurnkeyDonation("testnet");

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountAddress, setAccountAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Transfer state
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [txResult, setTxResult] = useState(null);

  // Message signing state
  const [messageToSign, setMessageToSign] = useState("");
  const [signedMessage, setSignedMessage] = useState(null);
  const [isSigning, setIsSigning] = useState(false);

  const stacksAccounts = getStacksAccounts();

  const handleAccountSelect = async (account) => {
    setSelectedAccount(account);
    setAccountAddress("");
    setBalance(null);
    setTxResult(null);
    setSignedMessage(null);

    // Get address
    try {
      const address = await getStacksAddress(account);
      setAccountAddress(address);
    } catch (error) {
      console.error("Error getting address:", error);
    }
  };

  const handleFetchBalance = async () => {
    if (!selectedAccount) return;

    setIsLoadingBalance(true);
    try {
      const balanceData = await fetchBalance(selectedAccount);
      setBalance(balanceData);
    } catch (error) {
      console.error("Error fetching balance:", error);
      alert("Failed to fetch balance. Make sure you're on testnet.");
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handleSendSTX = async () => {
    if (!selectedAccount || !recipient || !amount) {
      alert("Please fill in all fields");
      return;
    }

    setIsSending(true);
    setTxResult(null);

    try {
      const txid = await sendSTXWithTurnkey({
        recipientAddress: recipient,
        amount: parseFloat(amount),
        memo,
        walletAccount: selectedAccount,
      });

      setTxResult({
        success: true,
        txid,
        explorerUrl: `https://explorer.hiro.so/txid/${txid}?chain=testnet`,
      });

      // Clear form
      setRecipient("");
      setAmount("");
      setMemo("");
    } catch (error) {
      console.error("Error sending STX:", error);
      setTxResult({
        success: false,
        error: error.message,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSignMessage = async () => {
    if (!selectedAccount || !messageToSign) {
      alert("Please enter a message to sign");
      return;
    }

    setIsSigning(true);
    setSignedMessage(null);

    try {
      const result = await signStacksMessage(messageToSign, selectedAccount);
      setSignedMessage(result);
    } catch (error) {
      console.error("Error signing message:", error);
      alert(`Failed to sign message: ${error.message}`);
    } finally {
      setIsSigning(false);
    }
  };

  if (!hasStacksWallets) {
    return (
      <div className="stacks-tester">
        <div className="no-stacks-wallet">
          <h3>No Stacks Wallets Found</h3>
          <p>Create a wallet with Stacks support to test transactions.</p>
          <p className="hint">
            Make sure to select ADDRESS_FORMAT_STACKS when creating a wallet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="stacks-tester">
      <h2>🔗 Stacks Transaction Tester</h2>
      <p className="testnet-badge">🧪 Testnet Mode</p>

      {/* Account Selection */}
      <div className="section">
        <h3>1. Select Stacks Account</h3>
        <div className="account-list">
          {stacksAccounts.map((account, idx) => (
            <button
              key={idx}
              onClick={() => handleAccountSelect(account)}
              className={`account-option ${
                selectedAccount === account ? "selected" : ""
              }`}
            >
              <span className="account-label">Account {idx + 1}</span>
              <span className="account-address-short">
                {account.address?.substring(0, 8)}...
                {account.address?.substring(account.address.length - 6)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedAccount && (
        <>
          {/* Address Display */}
          <div className="section">
            <h3>2. Stacks Address</h3>
            <div className="address-display">
              <code>{accountAddress || "Loading..."}</code>
              {accountAddress && (
                <button
                  onClick={() => navigator.clipboard.writeText(accountAddress)}
                  className="copy-btn"
                >
                  📋 Copy
                </button>
              )}
            </div>
            {accountAddress && (
              <a
                href={`https://explorer.hiro.so/address/${accountAddress}?chain=testnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="explorer-link"
              >
                View in Explorer →
              </a>
            )}
          </div>

          {/* Balance */}
          <div className="section">
            <h3>3. Check Balance</h3>
            <button
              onClick={handleFetchBalance}
              disabled={isLoadingBalance}
              className="action-btn"
            >
              {isLoadingBalance ? "Loading..." : "Fetch Balance"}
            </button>
            {balance && (
              <div className="balance-display">
                <div className="balance-item">
                  <span className="balance-label">Available:</span>
                  <span className="balance-value">
                    {(balance.stx.balance / 1000000).toFixed(6)} STX
                  </span>
                </div>
                <div className="balance-item">
                  <span className="balance-label">Locked:</span>
                  <span className="balance-value">
                    {(balance.stx.locked / 1000000).toFixed(6)} STX
                  </span>
                </div>
                <div className="balance-item total">
                  <span className="balance-label">Total:</span>
                  <span className="balance-value">
                    {(balance.stx.total / 1000000).toFixed(6)} STX
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* STX Transfer */}
          <div className="section">
            <h3>4. Send STX Transfer</h3>
            <div className="transfer-form">
              <input
                type="text"
                placeholder="Recipient Address (ST...)"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="form-input"
              />
              <input
                type="number"
                placeholder="Amount (STX)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.000001"
                min="0"
                className="form-input"
              />
              <input
                type="text"
                placeholder="Memo (optional)"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                maxLength={34}
                className="form-input"
              />
              <button
                onClick={handleSendSTX}
                disabled={isSending || !recipient || !amount}
                className="action-btn primary"
              >
                {isSending ? "Sending..." : "Send STX"}
              </button>
            </div>

            {txResult && (
              <div
                className={`tx-result ${txResult.success ? "success" : "error"}`}
              >
                {txResult.success ? (
                  <>
                    <div className="result-header">✅ Transaction Sent!</div>
                    <div className="result-content">
                      <p className="tx-id">
                        <strong>TX ID:</strong> {txResult.txid}
                      </p>
                      <a
                        href={txResult.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="explorer-link"
                      >
                        View in Explorer →
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="result-header">❌ Transaction Failed</div>
                    <div className="result-content">
                      <p className="error-message">{txResult.error}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Message Signing */}
          <div className="section">
            <h3>5. Sign Message</h3>
            <div className="signing-form">
              <textarea
                placeholder="Enter message to sign..."
                value={messageToSign}
                onChange={(e) => setMessageToSign(e.target.value)}
                rows={4}
                className="form-textarea"
              />
              <button
                onClick={handleSignMessage}
                disabled={isSigning || !messageToSign}
                className="action-btn"
              >
                {isSigning ? "Signing..." : "Sign Message"}
              </button>
            </div>

            {signedMessage && (
              <div className="signature-result">
                <div className="result-header">✅ Message Signed!</div>
                <div className="signature-data">
                  <div className="signature-field">
                    <label>Signature:</label>
                    <pre>{signedMessage.signature}</pre>
                  </div>
                  <div className="signature-field">
                    <label>Address:</label>
                    <code>{signedMessage.address}</code>
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(signedMessage.signature)
                  }
                  className="copy-btn"
                >
                  📋 Copy Signature
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default StacksTransactionTester;
