import UnifiedDonation from "./UnifiedDonation";
import "../styles/DonationModal.css";

/**
 * Modal wrapper for UnifiedDonation component
 */
export function DonationModal({
  creatorName,
  recipientAddress,
  amount,
  onSuccess,
  onCancel,
}) {
  console.log("🎨 DonationModal rendering with:", {
    creatorName,
    recipientAddress,
    amount,
  });

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="donation-modal-backdrop" onClick={handleBackdropClick}>
      <div className="donation-modal">
        <button className="modal-close-btn" onClick={onCancel}>
          ✕
        </button>
        <UnifiedDonation
          creatorName={creatorName}
          recipientAddress={recipientAddress}
          amount={amount}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}

export default DonationModal;
