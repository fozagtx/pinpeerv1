# External Wallet Integration Guide

This guide explains how to use the external wallet connection features in PinPeer, powered by Turnkey's embedded wallet infrastructure with support for Stacks blockchain.

## Overview

PinPeer now supports both **embedded wallets** (managed by Turnkey) and **external wallets** (like MetaMask, Phantom, Hiro Wallet, Leather, and WalletConnect).

### Supported Chains

- **Ethereum**: MetaMask, Phantom, WalletConnect (Mainnet, Sepolia Testnet)
- **Solana**: Phantom, Solflare, WalletConnect (Mainnet, Devnet)
- **Stacks**: Hiro Wallet, Leather (Mainnet, Testnet) 🎉

## Features

### 1. Embedded Wallets (Turnkey)
- Create new wallets directly in the app
- Import existing wallets
- Export wallet data
- Multi-chain support (Ethereum, Solana, Stacks)
- No browser extension required

### 2. External Wallet Connections
- Connect existing wallets from browser extensions
- WalletConnect support for mobile wallets
- Sign transactions and messages
- Switch between multiple connected wallets

## Setup Instructions

### Prerequisites

1. **Turnkey Account**
   - Sign up at [https://app.turnkey.com](https://app.turnkey.com)
   - Create an organization
   - Get your Organization ID and Auth Proxy Config ID

2. **WalletConnect Project** (Optional, but recommended)
   - Sign up at [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
   - Create a new project
   - Get your Project ID

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
VITE_ORGANIZATION_ID=your_turnkey_organization_id_here
VITE_AUTH_PROXY_CONFIG_ID=your_turnkey_auth_proxy_config_id_here
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

## Using External Wallets

### Connecting an External Wallet

1. Click the **"Embedded Wallet"** tab in the header
2. Log in with your Turnkey account (email/passkey)
3. Click **"Connect External Wallet"** button
4. Choose your preferred wallet from the modal:
   - **Browser Extension**: MetaMask, Phantom, Hiro, Leather
   - **WalletConnect**: Scan QR code with mobile wallet
5. Approve the connection in your wallet

### Managing Connected Wallets

- **View Connected Wallets**: Click "Show External Wallets" button
- **Disconnect Wallet**: Click "Disconnect" next to any connected wallet
- **Switch Chains**: The app automatically detects available chains

### Wallet States

When you authenticate with Turnkey using an external wallet, that wallet is:
- ✅ **Authenticated**: Used as a stamper for Turnkey activities
- ✅ **Connected**: Available for signing transactions in your app

This means you can use it both for Turnkey operations and your app's transaction signing.

## Code Architecture

### Configuration (`src/main.jsx`)

```jsx
const turnkeyConfig = {
  organizationId: import.meta.env.VITE_ORGANIZATION_ID,
  authProxyConfigId: import.meta.env.VITE_AUTH_PROXY_CONFIG_ID,
  walletConfig: {
    features: {
      connecting: true, // Enable external wallet connections
    },
    chains: {
      ethereum: {
        native: true, // Native browser extension support
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
        native: true, // Stacks support for Hiro/Leather
        networks: ["mainnet", "testnet"],
      },
    },
    walletConnect: {
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
      appMetadata: {
        name: "PinPeer",
        description: "Support your favorite creators on Stacks blockchain",
        url: window.location.origin,
        icons: [window.location.origin + "/vite.svg"],
      },
    },
  },
};
```

### Using the Turnkey Hook

```jsx
import { useTurnkey } from "@turnkey/react-wallet-kit";

function MyComponent() {
  const {
    // Authentication
    authState,
    user,
    handleLogin,
    
    // Embedded Wallets
    wallets,
    createWallet,
    refreshWallets,
    
    // External Wallets
    handleConnectExternalWallet,
    fetchWalletProviders,
    connectWalletAccount,
    disconnectWalletAccount,
    
    // Signing
    signMessage,
    signTransaction,
    signAndSendTransaction,
  } = useTurnkey();
  
  // Your component logic
}
```

### Available Hooks

| Hook | Purpose |
|------|---------|
| `handleConnectExternalWallet()` | Opens built-in modal to connect external wallet |
| `fetchWalletProviders()` | Gets list of available wallet providers |
| `connectWalletAccount(provider)` | Connects specific wallet provider |
| `disconnectWalletAccount(provider)` | Disconnects wallet provider |
| `signMessage(account, message)` | Signs a message with wallet |
| `signTransaction(account, tx)` | Signs a transaction |
| `signAndSendTransaction(account, tx)` | Signs and broadcasts transaction |

## Wallet Provider Structure

```typescript
interface WalletProvider {
  name: string;              // "MetaMask", "Phantom", etc.
  type: string;              // Provider type
  connectedAddresses: string[]; // Array of connected wallet addresses
}

interface Wallet {
  walletId: string;
  walletName: string;
  source: "embedded" | "connected";
  accounts: WalletAccount[];
}

interface WalletAccount {
  walletAccountId: string;
  address: string;
  addressFormat: "ADDRESS_FORMAT_ETHEREUM" | "ADDRESS_FORMAT_SOLANA" | "ADDRESS_FORMAT_STACKS";
  curve: "CURVE_SECP256K1" | "CURVE_ED25519";
  chainInfo: { namespace: string; chainId?: string };
  signMessage: (msg: string) => Promise<string>;
  signTransaction: (tx: any) => Promise<any>;
  signAndSendTransaction?: (tx: any) => Promise<string>;
}
```

## Stacks Integration

### Why Stacks Support Matters

PinPeer is built on the **Stacks blockchain**, which brings smart contracts to Bitcoin. By adding Stacks support to Turnkey, users can:

- Connect their Hiro Wallet or Leather wallet
- Sign Stacks transactions (STX transfers, contract calls)
- Interact with Bitcoin-secured smart contracts
- Use both embedded and external Stacks wallets

### Stacks Wallet Support

Currently supported Stacks wallets:
- **Hiro Wallet** (Browser extension)
- **Leather Wallet** (Browser extension)

### Contributing Stacks Support to Turnkey

This implementation includes **unofficial Stacks support** that can be contributed back to Turnkey's SDK. Key additions:

1. **Stacks Chain Configuration**
   ```jsx
   stacks: {
     native: true,
     networks: ["mainnet", "testnet"],
   }
   ```

2. **Address Format**: `ADDRESS_FORMAT_STACKS`
3. **Curve**: `CURVE_SECP256K1` (same as Bitcoin)
4. **Transaction Signing**: Compatible with `@stacks/transactions`

## UI Components

### Built-in Modal (`handleConnectExternalWallet`)

The SDK provides a styled modal that handles:
- Wallet provider selection
- Chain selection (Ethereum/Solana/Stacks)
- WalletConnect QR code display
- Connection status

### Custom UI

You can build your own UI using the low-level functions:

```jsx
const providers = await fetchWalletProviders();

// Show your custom UI with providers
{providers.map(provider => (
  <button onClick={() => connectWalletAccount(provider)}>
    Connect {provider.name}
  </button>
))}
```

## Troubleshooting

### WalletConnect Not Working

- Ensure `VITE_WALLETCONNECT_PROJECT_ID` is set
- Check that `walletConnectNamespaces` includes at least one chain
- Verify your WalletConnect project is active

### Stacks Wallet Not Detected

- Install Hiro Wallet or Leather extension
- Refresh the page after installing
- Check browser console for errors

### External Wallet Not Appearing in List

- Ensure the wallet extension is installed and unlocked
- Refresh the wallet provider list
- Check that `native: true` is set for the chain

## Best Practices

1. **Always check authentication state** before accessing wallet functions
2. **Refresh wallet list** after connecting/disconnecting
3. **Handle errors gracefully** - wallet connections can fail
4. **Provide clear UI feedback** during signing operations
5. **Test with testnet first** before using mainnet

## Security Considerations

- External wallets remain under user control
- Turnkey never stores external wallet private keys
- All signing operations happen in the user's wallet
- WalletConnect uses end-to-end encryption

## Resources

- [Turnkey Documentation](https://docs.turnkey.com)
- [WalletConnect Documentation](https://docs.walletconnect.com)
- [Stacks Documentation](https://docs.stacks.co)
- [Hiro Wallet](https://wallet.hiro.so)
- [Leather Wallet](https://leather.io)

## Support

For issues or questions:
- Turnkey: [support@turnkey.com](mailto:support@turnkey.com)
- PinPeer: Create an issue in the GitHub repository
