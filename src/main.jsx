import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TurnkeyProvider } from "@turnkey/react-wallet-kit";
import "@turnkey/react-wallet-kit/styles.css";
import "./index.css";
import App from "./App.jsx";

const turnkeyConfig = {
  organizationId: import.meta.env.VITE_ORGANIZATION_ID,
  authProxyConfigId: import.meta.env.VITE_AUTH_PROXY_CONFIG_ID,
};

const turnkeyCallbacks = {
  onError: (error) => {
    console.error("Turnkey error:", error);
  },
  onAuthenticationSuccess: ({ session }) => {
    console.log("User authenticated with Turnkey:", session);
  },
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TurnkeyProvider config={turnkeyConfig} callbacks={turnkeyCallbacks}>
      <App />
    </TurnkeyProvider>
  </StrictMode>,
);
