import { CreatorCard } from "./CreatorCard";
import "../styles/CreatorsGrid.css";

export function CreatorsGrid({
  creators,
  onDonate,
  connected,
  selectedCard,
  onAmountSelect,
  pinnedPeers,
  isPeersView = false,
}) {
  return (
    <div className="creators-container">
      <div className="creators-header">
        <h1 className="creators-title">
          {isPeersView ? "My Pinned Peers" : "Support Amazing Creators"}
        </h1>
        <p className="creators-subtitle">
          {isPeersView
            ? "Creators you have supported with STX donations"
            : "Pin your favorite peers and support their work with STX"}
        </p>
      </div>
      <div className="creators-grid">
        {creators.length === 0 && isPeersView ? (
          <div className="empty-peers">
            <p>You haven't pinned any peers yet!</p>
            <p className="empty-peers-subtitle">
              Support creators to see them here
            </p>
          </div>
        ) : (
          creators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onDonate={onDonate}
              connected={connected}
              selectedAmount={
                selectedCard?.creatorId === creator.id
                  ? selectedCard.amount
                  : null
              }
              onAmountSelect={(amount) => onAmountSelect(creator.id, amount)}
              isPinned={pinnedPeers?.some((p) => p.id === creator.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
