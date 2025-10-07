import { useState, useEffect } from "react";
import { connect, disconnect, isConnected } from "@stacks/connect";
import { DarkModeToggle } from "./DarkModeToggle";
import "../styles/Header.css";

export function Header({
  connected,
  onConnectionChange,
  currentView,
  onViewChange,
  showTurnkeyWallet,
  onToggleTurnkeyWallet,
  onDarkModeChange,
}) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [, setUserAddress] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      if (connected && isConnected()) {
        try {
          const userData = localStorage.getItem("blockstack-session");
          if (userData) {
            const parsedData = JSON.parse(userData);
            const address = parsedData?.userData?.profile?.stxAddress?.testnet;
            if (address) {
              setUserAddress(address);
              fetchBalance(address);
            }
          }
        } catch (error) {
          console.error("Error getting user data:", error);
        }
      } else {
        setUserAddress(null);
        setBalance(null);
      }
    };
    getUserData();
  }, [connected]);

  const fetchBalance = async (address) => {
    if (!address) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.testnet.hiro.so/extended/v1/address/${address}/balances`,
      );
      const data = await response.json();
      const stxBalance = (data.stx.balance / 1000000).toFixed(2);
      setBalance(stxBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("0.00");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      console.log("Attempting to connect wallet...");
      await connect({
        appDetails: {
          name: "PinPeer",
          icon: window.location.origin + "/vite.svg",
        },
        onFinish: () => {
          console.log("Wallet connected successfully");
          setTimeout(() => {
            onConnectionChange(true);
          }, 100);
        },
        onCancel: () => {
          console.log("User cancelled wallet connection");
        },
      });
    } catch (error) {
      console.error("Connection failed:", error);
      alert(
        "🔌 Oops! We couldn't connect to your wallet.\n\n💡 Make sure you have a Stacks wallet installed (Hiro Wallet or Leather).\n\n✨ Once installed, give it another try!",
      );
    }
  };

  const handleDisconnectWallet = () => {
    disconnect();
    onConnectionChange(false);
    setBalance(null);
    setUserAddress(null);
  };

  return (
    <div className="header-container">
      <div className="header-wrapper">
        <div className="header-left">
          <div className="logo-container">
            <span className="logo-text">pinpeer</span>
          </div>
        </div>
        <nav className="header-nav">
          {!showTurnkeyWallet && connected && (
            <div className="header-tabs">
              <button
                className={`tab-button ${currentView === "creators" ? "active" : ""}`}
                onClick={() => onViewChange("creators")}
              >
                Creators
              </button>
              <button
                className={`tab-button ${currentView === "peers" ? "active" : ""}`}
                onClick={() => onViewChange("peers")}
              >
                My Peers
              </button>
              <button
                className={`tab-button ${currentView === "history" ? "active" : ""}`}
                onClick={() => onViewChange("history")}
              >
                History
              </button>
            </div>
          )}
          <button
            className={`tab-button ${showTurnkeyWallet ? "active" : ""}`}
            onClick={onToggleTurnkeyWallet}
          >
            Embedded Wallet
          </button>
          {connected && balance !== null && !showTurnkeyWallet && (
            <div className="balance-display">
              <span className="balance-label">Balance:</span>
              <span className="balance-amount">
                {loading ? "..." : `${balance} STX`}
              </span>
            </div>
          )}
          <DarkModeToggle onToggle={onDarkModeChange} />
          {!connected ? (
            <button
              className="connect-wallet-button"
              onClick={handleConnectWallet}
            >
              Connect Wallet
            </button>
          ) : (
            <button
              className="disconnect-wallet-button"
              onClick={handleDisconnectWallet}
            >
              Disconnect
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
