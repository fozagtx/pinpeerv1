# Signing Messages & Transactions Guide

This guide explains how to sign messages and transactions in PinPeer using Turnkey's Embedded Wallets or external browser wallets.

## Overview

PinPeer now includes comprehensive signing functionality that supports:
- **Message Signing**: Sign arbitrary messages with any wallet
- **Transaction Signing**: Sign blockchain transactions (Ethereum, Solana, Stacks)
- **Sign & Send**: Sign and broadcast transactions in one step
- **Multi-Wallet Support**: Use both embedded and external wallets

## Features

### 1. Message Signing

Sign any text message with your wallet:
- Plain text messages
- Structured data
- Authentication challenges

**Two signing modes:**
- **Direct Signing**: Sign immediately without confirmation modal
- **Modal Signing**: Show confirmation UI before signing

### 2. Transaction Signing

Sign blockchain transactions for:
- **Ethereum**: EVM-compatible transactions
- **Solana**: Solana program instructions
- **Stacks**: STX transfers and contract calls

**Options:**
- **Sign Only**: Get the signature without broadcasting
- **Sign & Send**: Sign and broadcast to the network

### 3. Multi-Wallet Support

Use any available wallet:
- **Embedded Wallets**: Turnkey-managed wallets
- **External Wallets**: MetaMask, Phantom, Hiro, Leather, etc.

## Using the Signing Manager

### Accessing the Signing Interface

1. Click **"Embedded Wallet"** in the header
2. Log in to your Turnkey account
3. Click **"Show Signing Interface"** button
4. Select a wallet account to use

### Signing a Message

1. **Select Wallet Account**:
   - Choose from embedded or connected external wallets
   - Each account shows its chain type (Ethereum, Solana, Stacks)

2. **Enter Your Message**:
   - Type any message in the text area
   - Can be plain text or structured data

3. **Choose Signing Method**:
   - **"Sign Message"**: Direct signing without modal
   - **"Sign with Modal"**: Shows confirmation UI first

4. **Copy the Signature**:
   - Signature appears in the result section
   - Click "Copy Signature" to copy to clipboard

### Signing a Transaction

1. **Select Wallet Account**:
   - Choose the account matching your transaction's chain

2. **Enter Transaction Data**:
   - Paste unsigned transaction hex data
   - Must be properly formatted for the chain

3. **Choose Action**:
   - **"Sign Transaction"**: Get signature only
   - **"Sign & Send"**: Sign and broadcast immediately

4. **Get the Result**:
   - For "Sign Transaction": Shows the signature
   - For "Sign & Send": Shows the transaction hash

## Code Examples

### Basic Message Signing

```jsx
import { useTurnkey } from "@turnkey/react-wallet-kit";

function MyComponent() {
  const { signMessage, wallets } = useTurnkey();

  const handleSignMessage = async () => {
    try {
      // Get the first account of the first wallet
      const walletAccount = wallets[0]?.accounts[0];
      const message = "Hello, PinPeer!";

      const signature = await signMessage({
        walletAccount,
        message,
      });
      
      console.log("Signature:", signature);
    } catch (error) {
      console.error("Signing failed:", error);
    }
  };

  return <button onClick={handleSignMessage}>Sign Message</button>;
}
```

### Message Signing with Modal

```jsx
import { useTurnkey } from "@turnkey/react-wallet-kit";

function MyComponent() {
  const { handleSignMessage, wallets } = useTurnkey();

  const handleSignWithModal = async () => {
    try {
      const walletAccount = wallets[0]?.accounts[0];
      const message = "Please confirm this action";

      // Shows a modal for user confirmation
      const signature = await handleSignMessage({
        walletAccount,
        message,
      });
      
      console.log("Signature:", signature);
    } catch (error) {
      console.error("Signing cancelled or failed:", error);
    }
  };

  return <button onClick={handleSignWithModal}>Sign with Modal</button>;
}
```

### Transaction Signing

```jsx
import { useTurnkey } from "@turnkey/react-wallet-kit";

function MyComponent() {
  const { signTransaction, wallets } = useTurnkey();

  const handleSignTransaction = async () => {
    try {
      const walletAccount = wallets[0]?.accounts[0];
      const unsignedTx = "0x..."; // Your unsigned transaction hex

      // Determine transaction type based on account
      let transactionType;
      if (walletAccount.addressFormat === "ADDRESS_FORMAT_ETHEREUM") {
        transactionType = "TRANSACTION_TYPE_ETHEREUM";
      } else if (walletAccount.addressFormat === "ADDRESS_FORMAT_SOLANA") {
        transactionType = "TRANSACTION_TYPE_SOLANA";
      } else {
        transactionType = "TRANSACTION_TYPE_STACKS";
      }

      const signature = await signTransaction({
        walletAccount,
        unsignedTransaction: unsignedTx,
        transactionType,
      });
      
      console.log("Transaction signed:", signature);
    } catch (error) {
      console.error("Transaction signing failed:", error);
    }
  };

  return <button onClick={handleSignTransaction}>Sign Transaction</button>;
}
```

### Sign and Send Transaction

```jsx
import { useTurnkey } from "@turnkey/react-wallet-kit";

function MyComponent() {
  const { signAndSendTransaction, wallets } = useTurnkey();

  const handleSignAndSend = async () => {
    try {
      const walletAccount = wallets[0]?.accounts[0];
      const unsignedTx = "0x...";

      let transactionType;
      if (walletAccount.addressFormat === "ADDRESS_FORMAT_ETHEREUM") {
        transactionType = "TRANSACTION_TYPE_ETHEREUM";
      } else if (walletAccount.addressFormat === "ADDRESS_FORMAT_SOLANA") {
        transactionType = "TRANSACTION_TYPE_SOLANA";
      } else {
        transactionType = "TRANSACTION_TYPE_STACKS";
      }

      // Signs and broadcasts the transaction
      const txHash = await signAndSendTransaction({
        walletAccount,
        unsignedTransaction: unsignedTx,
        transactionType,
      });
      
      console.log("Transaction sent! Hash:", txHash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return <button onClick={handleSignAndSend}>Sign & Send</button>;
}
```

### Using External Wallets

```jsx
import { useTurnkey, WalletSource } from "@turnkey/react-wallet-kit";

function MyComponent() {
  const { handleSignMessage, wallets } = useTurnkey();

  const signWithExternalWallet = async () => {
    try {
      // Find external wallets (MetaMask, Phantom, etc.)
      const externalWallet = wallets.find(
        (wallet) => wallet.source === WalletSource.Connected
      );

      if (!externalWallet) {
        throw new Error("No external wallet connected");
      }

      const walletAccount = externalWallet.accounts[0];
      const message = "Sign with external wallet";

      // User's external wallet will prompt for confirmation
      const signature = await handleSignMessage({
        walletAccount,
        message,
      });
      
      console.log("Signed with external wallet:", signature);
    } catch (error) {
      console.error("External wallet signing failed:", error);
    }
  };

  return <button onClick={signWithExternalWallet}>Sign with MetaMask</button>;
}
```

### Filter Wallets by Chain

```jsx
import { useTurnkey } from "@turnkey/react-wallet-kit";

function ChainSpecificSigning() {
  const { wallets, signMessage } = useTurnkey();

  // Get only Ethereum accounts
  const ethereumAccounts = wallets
    .flatMap((w) => w.accounts || [])
    .filter((acc) => acc.addressFormat === "ADDRESS_FORMAT_ETHEREUM");

  // Get only Solana accounts
  const solanaAccounts = wallets
    .flatMap((w) => w.accounts || [])
    .filter((acc) => acc.addressFormat === "ADDRESS_FORMAT_SOLANA");

  // Get only Stacks accounts
  const stacksAccounts = wallets
    .flatMap((w) => w.accounts || [])
    .filter((acc) => acc.addressFormat === "ADDRESS_FORMAT_STACKS");

  const signWithEthereum = async () => {
    if (ethereumAccounts.length === 0) {
      alert("No Ethereum accounts available");
      return;
    }

    const signature = await signMessage({
      walletAccount: ethereumAccounts[0],
      message: "Hello from Ethereum",
    });
    
    console.log("Ethereum signature:", signature);
  };

  return (
    <div>
      <p>Ethereum accounts: {ethereumAccounts.length}</p>
      <p>Solana accounts: {solanaAccounts.length}</p>
      <p>Stacks accounts: {stacksAccounts.length}</p>
      <button onClick={signWithEthereum}>Sign with Ethereum</button>
    </div>
  );
}
```

## Integrating with Stacks Donations

The `DonationHelper` component provides utilities for signing STX transactions with Turnkey:

```jsx
import { useTurnkeyDonation } from "./components/DonationHelper";

function DonationFlow() {
  const { getStacksAccounts, sendSTXWithTurnkey, hasStacksWallets } = useTurnkeyDonation();

  const handleDonate = async () => {
    if (!hasStacksWallets) {
      alert("No Stacks wallets available");
      return;
    }

    const stacksAccounts = getStacksAccounts();
    const walletAccount = stacksAccounts[0]; // Use first Stacks account

    try {
      const txHash = await sendSTXWithTurnkey({
        recipientAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        amount: 1.5, // STX amount
        memo: "Supporting your work!",
        walletAccount,
      });

      console.log("Donation sent! TX:", txHash);
    } catch (error) {
      console.error("Donation failed:", error);
    }
  };

  return <button onClick={handleDonate}>Donate with Turnkey</button>;
}
```

## Transaction Types

### Ethereum Transactions

```javascript
transactionType: "TRANSACTION_TYPE_ETHEREUM"
```

- Format: Hex-encoded RLP transaction
- Used for: EVM chains (Ethereum, Polygon, BSC, etc.)

### Solana Transactions

```javascript
transactionType: "TRANSACTION_TYPE_SOLANA"
```

- Format: Base64-encoded serialized transaction
- Used for: Solana blockchain

### Stacks Transactions

```javascript
transactionType: "TRANSACTION_TYPE_STACKS"
```

- Format: Hex-encoded Clarity transaction
- Used for: Stacks blockchain (Bitcoin L2)

## Best Practices

### 1. Always Check Wallet Availability

```jsx
if (wallets.length === 0) {
  return <p>Please connect or create a wallet first</p>;
}
```

### 2. Handle Errors Gracefully

```jsx
try {
  const signature = await signMessage({...});
} catch (error) {
  if (error.message.includes("User rejected")) {
    console.log("User cancelled signing");
  } else {
    console.error("Signing failed:", error);
  }
}
```

### 3. Validate Account Format

```jsx
const isValidForChain = (account, requiredFormat) => {
  return account.addressFormat === requiredFormat;
};

if (!isValidForChain(walletAccount, "ADDRESS_FORMAT_ETHEREUM")) {
  throw new Error("Invalid account for Ethereum transaction");
}
```

### 4. Show Clear UI Feedback

```jsx
const [isSigning, setIsSigning] = useState(false);

const handleSign = async () => {
  setIsSigning(true);
  try {
    await signMessage({...});
  } finally {
    setIsSigning(false);
  }
};

return (
  <button disabled={isSigning}>
    {isSigning ? "Signing..." : "Sign Message"}
  </button>
);
```

### 5. Use Modal for Important Actions

For critical operations (large transfers, contract interactions), always use the modal:

```jsx
// Good for important actions
await handleSignMessage({ walletAccount, message });

// Good for routine operations
await signMessage({ walletAccount, message });
```

## Security Considerations

### Message Signing

- Never sign messages you don't understand
- Verify the message content before signing
- Be cautious of signing structured data (EIP-712)

### Transaction Signing

- Always review transaction details before signing
- Verify recipient addresses carefully
- Check transaction amounts and fees
- Use testnets for development and testing

### External Wallets

- External wallets show their own confirmation UI
- Users must approve each signature request
- Rejections are treated as errors in your code

## Troubleshooting

### "No wallets available"

**Solution**: Create or connect a wallet first
- Click "Create New Wallet" for embedded wallet
- Click "Connect External Wallet" for browser wallets

### "Invalid wallet account"

**Solution**: Ensure the account matches the transaction type
- Use Ethereum accounts for Ethereum transactions
- Use Solana accounts for Solana transactions
- Use Stacks accounts for Stacks transactions

### "User rejected request"

**Solution**: User cancelled the signing operation
- This is normal behavior
- Implement proper error handling for cancellations

### "Transaction failed"

**Possible causes**:
- Insufficient balance
- Invalid transaction format
- Network issues
- Gas estimation failure

**Solution**: Check transaction parameters and network status

## Component Reference

### SigningManager

Main UI component for signing operations.

**Location**: `src/components/SigningManager.jsx`

**Features**:
- Wallet/account selection
- Message signing interface
- Transaction signing interface
- Result display and copy functionality

### useTurnkeyDonation

Hook for Stacks donation signing.

**Location**: `src/components/DonationHelper.jsx`

**Methods**:
- `getStacksAccounts()`: Get all Stacks wallet accounts
- `sendSTXWithTurnkey()`: Send STX with Turnkey wallet
- `hasStacksWallets`: Boolean indicating Stacks wallet availability

## Next Steps

- Explore [UI Customization](./WALLET_INTEGRATION.md#ui-components) to customize the signing modals
- Check [External Wallet Integration](./WALLET_INTEGRATION.md) for wallet connection
- Review [Turnkey Documentation](https://docs.turnkey.com) for advanced features

## Support

For issues or questions:
- Check browser console for detailed error messages
- Review Turnkey SDK documentation
- Create an issue in the GitHub repository
