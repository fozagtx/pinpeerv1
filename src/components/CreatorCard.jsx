import "../styles/CreatorCard.css";

export function CreatorCard({
  creator,
  onDonate,
  connected,
  selectedAmount,
  onAmountSelect,
  isPinned = false,
}) {
  const handlePinPeer = () => {
    if (selectedAmount && connected) {
      onDonate(creator.stacksAddress, selectedAmount, creator.name, creator.id);
    }
  };

  return (
    <div className={`creator-card ${isPinned ? "pinned" : ""}`}>
      {isPinned && (
        <div className="pinned-badge">
          <span className="badge-icon">⭐</span>
          <span className="badge-text">Pinned</span>
        </div>
      )}
      <div className="creator-avatar">
        <img src={creator.avatar} alt={creator.name} />
      </div>
      <div className="creator-info">
        <h3 className="creator-name">{creator.name}</h3>
        <h4 className="creator-project">{creator.project}</h4>
        <p className="creator-description">{creator.description}</p>
      </div>
      <div className="donation-section">
        <p className="donation-label">Choose amount (STX)</p>
        <div className="donation-amounts">
          {creator.donations.map((amount) => (
            <button
              key={amount}
              className={`amount-button ${selectedAmount === amount ? "selected" : ""}`}
              onClick={() => onAmountSelect(amount)}
            >
              {amount} STX
            </button>
          ))}
        </div>
        <button
          className="pin-peer-button"
          onClick={handlePinPeer}
          disabled={!selectedAmount || !connected}
        >
          {!connected ? "Connect Wallet First" : "Pin This Peer"}
        </button>
      </div>
    </div>
  );
}
