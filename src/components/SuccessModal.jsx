import { useState, useEffect } from "react";
import {
  monitorTransaction,
  getExplorerUrl,
} from "../utils/transactionMonitor";
import "../styles/SuccessModal.css";

export function SuccessModal({ isOpen, onClose, transactionData }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [txStatus, setTxStatus] = useState({
    status: "pending",
    message: "Transaction submitted...",
  });

  useEffect(() => {
    if (isOpen && transactionData?.txId) {
      setShowConfetti(true);

      // Start monitoring transaction
      monitorTransaction(
        transactionData.txId,
        (update) => {
          setTxStatus(update);
        },
        60, // max attempts
        5000, // poll every 5 seconds
      );

      // Auto close after 15 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 15000);

      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
      setTxStatus({
        status: "pending",
        message: "Transaction submitted...",
      });
    }
  }, [isOpen, onClose, transactionData]);

  if (!isOpen) return null;

  const explorerUrl = transactionData?.txId
    ? getExplorerUrl(transactionData.txId, "testnet")
    : null;

  const getStatusColor = () => {
    switch (txStatus.status) {
      case "confirmed":
        return "#22c55e";
      case "failed":
        return "#ef4444";
      case "pending":
        return "#facc15";
      default:
        return "#a855f7";
    }
  };

  const getStatusIcon = () => {
    switch (txStatus.status) {
      case "confirmed":
        return "✅";
      case "failed":
        return "❌";
      case "pending":
        return "⏳";
      default:
        return "🔍";
    }
  };

  return (
    <>
      {showConfetti && <ConfettiAnimation />}
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="success-header">
            <div className="success-icon">🎉</div>
            <h2 className="success-title">Congratulations!</h2>
            <p className="success-subtitle">
              You've successfully pinned a peer
            </p>
          </div>

          <div className="receipt-container">
            <div className="receipt-row">
              <span className="receipt-label">Creator</span>
              <span className="receipt-value">
                {transactionData?.creatorName}
              </span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Amount</span>
              <span className="receipt-value">
                {transactionData?.amount} STX
              </span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Transaction ID</span>
              <span className="receipt-value receipt-txid">
                {transactionData?.txId?.substring(0, 8)}...
                {transactionData?.txId?.substring(
                  transactionData.txId.length - 8,
                )}
              </span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Network</span>
              <span className="receipt-value">Stacks Testnet</span>
            </div>
            <div className="receipt-row status-row">
              <span className="receipt-label">Status</span>
              <span
                className="receipt-value status-badge"
                style={{ color: getStatusColor() }}
              >
                {getStatusIcon()} {txStatus.message}
              </span>
            </div>
            {txStatus.status === "confirmed" && txStatus.blockHeight && (
              <div className="receipt-row">
                <span className="receipt-label">Block Height</span>
                <span className="receipt-value">#{txStatus.blockHeight}</span>
              </div>
            )}
          </div>

          <div className="modal-actions">
            {explorerUrl && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="explorer-button"
              >
                View on Explorer
              </a>
            )}
            <button className="close-modal-button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function ConfettiAnimation() {
  const emojis = ["🎉", "🎊", "⭐", "✨", "💫", "🌟", "💛", "🏆"];
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    left: Math.random() * 100,
    animationDuration: 2 + Math.random() * 3,
    animationDelay: Math.random() * 2,
  }));

  return (
    <div className="confetti-container">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            animationDuration: `${piece.animationDuration}s`,
            animationDelay: `${piece.animationDelay}s`,
          }}
        >
          {piece.emoji}
        </div>
      ))}
    </div>
  );
}
