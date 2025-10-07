import { useState, useEffect } from "react";
import { TurnkeyProvider } from "@turnkey/react-wallet-kit";
import "@turnkey/react-wallet-kit/styles.css";
import App from "./App.jsx";

/**
 * Wrapper component to enable dynamic Turnkey UI configuration
 * Allows dark mode toggle for Turnkey modals
 */
export function TurnkeyWrapper() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Load saved preference
    const savedMode = localStorage.getItem("turnkey-dark-mode");
    if (savedMode !== null) {
      setDarkMode(savedMode === "true");
    }
  }, []);

  const turnkeyConfig = {
    organizationId: import.meta.env.VITE_ORGANIZATION_ID,
    authProxyConfigId: import.meta.env.VITE_AUTH_PROXY_CONFIG_ID,
    walletConfig: {
      features: {
        connecting: true,
      },
      chains: {
        ethereum: {
          native: true,
          walletConnectNamespaces: ["eip155:1", "eip155:11155111"],
        },
        solana: {
          native: true,
          walletConnectNamespaces: [
            "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
            "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
          ],
        },
        stacks: {
          native: true,
          networks: ["mainnet", "testnet"],
        },
      },
      walletConnect: {
        projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "",
        appMetadata: {
          name: "PinPeer",
          description: "Support your favorite creators on Stacks blockchain",
          url: window.location.origin,
          icons: [window.location.origin + "/vite.svg"],
        },
      },
    },
    ui: {
      // Dynamic dark mode that can be toggled
      darkMode: darkMode,
      colors: {
        light: {
          primary: "#facc15",
          secondary: "#fbbf24",
        },
        dark: {
          primary: "#facc15",
          secondary: "#fbbf24",
        },
      },
      borderRadius: "12px",
      backgroundBlur: "10px",
    },
  };

  const turnkeyCallbacks = {
    onError: (error) => {
      console.error("Turnkey error:", error);
    },
    onAuthenticationSuccess: ({ session }) => {
      console.log("User authenticated with Turnkey:", session);
    },
  };

  return (
    <TurnkeyProvider config={turnkeyConfig} callbacks={turnkeyCallbacks}>
      <App onDarkModeChange={setDarkMode} />
    </TurnkeyProvider>
  );
}

export default TurnkeyWrapper;
