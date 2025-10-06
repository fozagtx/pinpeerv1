import "../styles/TransactionHistory.css";

export function TransactionHistory({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="transaction-history">
        <div className="empty-state">
          <h2>No Transaction History</h2>
          <p>Your donation transactions will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-history">
      <h2 className="history-title">Transaction History</h2>
      <div className="transactions-list">
        {transactions.map((tx, index) => (
          <div key={index} className="transaction-card">
            <div className="transaction-header">
              <h3>{tx.creatorName}</h3>
              <span className="transaction-amount">{tx.amount} STX</span>
            </div>
            <div className="transaction-details">
              <div className="transaction-row">
                <span className="label">Recipient:</span>
                <span className="value recipient-address">{tx.recipient}</span>
              </div>
              <div className="transaction-row">
                <span className="label">Date:</span>
                <span className="value">
                  {new Date(tx.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="transaction-row">
                <span className="label">Proof:</span>
                <a
                  href={`https://explorer.hiro.so/txid/${tx.txId}?chain=testnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-link"
                >
                  View on Explorer →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
