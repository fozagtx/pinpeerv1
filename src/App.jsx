import { useState, useEffect } from "react";
import { isConnected } from "@stacks/connect";
import { useTurnkey, AuthState } from "@turnkey/react-wallet-kit";
import { Header } from "./components/Header";
import { CreatorsGrid } from "./components/CreatorsGrid";
import { LandingPage } from "./components/LandingPage";
import { SuccessModal } from "./components/SuccessModal";
import { TransactionHistory } from "./components/TransactionHistory";
import { TurnkeyWalletManager } from "./components/TurnkeyWalletManager";
import { DonationModal } from "./components/DonationModal";
import { creatorsData } from "./mockData";
import "./styles/App.css";

function App({ onDarkModeChange }) {
  const { authState } = useTurnkey();
  const [connected, setConnected] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentView, setCurrentView] = useState("creators");
  const [showTurnkeyWallet, setShowTurnkeyWallet] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationParams, setDonationParams] = useState(null);
  const [pinnedPeers, setPinnedPeers] = useState(() => {
    const saved = localStorage.getItem("pinnedPeers");
    return saved ? JSON.parse(saved) : [];
  });
  const [transactionHistory, setTransactionHistory] = useState(() => {
    const saved = localStorage.getItem("transactionHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // Check if EITHER Stacks Connect OR Turnkey is connected
    const stacksConnected = isConnected();
    const turnkeyConnected = authState === AuthState.Authenticated;
    const anyWalletConnected = stacksConnected || turnkeyConnected;

    setConnected(anyWalletConnected);
  }, [authState]);

  useEffect(() => {
    const checkConnection = () => {
      const stacksConnected = isConnected();
      const turnkeyConnected = authState === AuthState.Authenticated;
      const anyWalletConnected = stacksConnected || turnkeyConnected;

      if (anyWalletConnected !== connected) {
        setConnected(anyWalletConnected);
      }
    };

    const intervalId = setInterval(checkConnection, 500);
    return () => clearInterval(intervalId);
  }, [connected, authState]);

  useEffect(() => {
    localStorage.setItem("pinnedPeers", JSON.stringify(pinnedPeers));
  }, [pinnedPeers]);

  useEffect(() => {
    localStorage.setItem(
      "transactionHistory",
      JSON.stringify(transactionHistory),
    );
  }, [transactionHistory]);

  const handleConnectionChange = (connectionStatus) => {
    setConnected(connectionStatus);
    if (!connectionStatus) {
      setCurrentView("creators");
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleAmountSelect = (creatorId, amount) => {
    setSelectedCard({ creatorId, amount });
  };

  const handleDonate = (recipientAddress, amount, creatorName, creatorId) => {
    console.log("🎯 handleDonate called:", {
      recipientAddress,
      amount,
      creatorName,
      creatorId,
    });

    // Open donation modal with UnifiedDonation component
    setDonationParams({
      recipientAddress,
      amount,
      creatorName,
      creatorId,
    });
    setShowDonationModal(true);

    console.log("✅ Donation modal should now be visible");
  };

  const handleDonationSuccess = (result) => {
    const txData = {
      txId: result.txId,
      amount: result.amount,
      creatorName: result.creatorName,
      recipient: result.recipient,
      timestamp: new Date().toISOString(),
      walletType: result.walletType,
    };

    setTransactionData(txData);

    // Add to transaction history
    setTransactionHistory((prev) => [txData, ...prev]);

    // Add to pinned peers if not already pinned
    const creator = creatorsData.find(
      (c) => c.id === donationParams?.creatorId,
    );
    if (
      creator &&
      !pinnedPeers.find((p) => p.id === donationParams?.creatorId)
    ) {
      setPinnedPeers((prev) => [
        ...prev,
        { ...creator, pinnedAt: new Date().toISOString() },
      ]);
    }

    // Close donation modal and show success modal
    setShowDonationModal(false);
    setShowSuccessModal(true);
    setSelectedCard(null);
  };

  const handleDonationCancel = () => {
    setShowDonationModal(false);
    setDonationParams(null);
  };

  return (
    <div className="App">
      <Header
        connected={connected}
        onConnectionChange={handleConnectionChange}
        currentView={currentView}
        onViewChange={handleViewChange}
        showTurnkeyWallet={showTurnkeyWallet}
        onToggleTurnkeyWallet={() => setShowTurnkeyWallet(!showTurnkeyWallet)}
        onDarkModeChange={onDarkModeChange}
      />
      {showTurnkeyWallet ? (
        <TurnkeyWalletManager />
      ) : !connected ? (
        <LandingPage
          onConnect={() => {
            document.querySelector(".connect-wallet-button")?.click();
          }}
        />
      ) : currentView === "creators" ? (
        <CreatorsGrid
          creators={creatorsData}
          onDonate={handleDonate}
          connected={connected}
          selectedCard={selectedCard}
          onAmountSelect={handleAmountSelect}
          pinnedPeers={pinnedPeers}
        />
      ) : currentView === "peers" ? (
        <CreatorsGrid
          creators={pinnedPeers}
          onDonate={handleDonate}
          connected={connected}
          selectedCard={selectedCard}
          onAmountSelect={handleAmountSelect}
          pinnedPeers={pinnedPeers}
          isPeersView={true}
        />
      ) : (
        <TransactionHistory transactions={transactionHistory} />
      )}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        transactionData={transactionData}
      />
      {showDonationModal && donationParams && (
        <DonationModal
          creatorName={donationParams.creatorName}
          recipientAddress={donationParams.recipientAddress}
          amount={donationParams.amount}
          onSuccess={handleDonationSuccess}
          onCancel={handleDonationCancel}
        />
      )}
    </div>
  );
}

export default App;
