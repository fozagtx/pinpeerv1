# Stacks Integration with Turnkey

Complete guide to using Turnkey's embedded wallets with Stacks blockchain in PinPeer.

## Overview

PinPeer now includes full Stacks blockchain support using Turnkey's secp256k1 signing capabilities. This integration enables:

- **Address Derivation**: Generate Stacks addresses from Turnkey wallets
- **Transaction Signing**: Sign STX transfers and contract calls
- **Message Signing**: Sign arbitrary messages for authentication
- **Balance Queries**: Fetch account balances from Stacks network

## Why Stacks + Turnkey?

### Stacks Benefits
- **Bitcoin Security**: Stacks transactions settle on Bitcoin L1
- **Smart Contracts**: Write contracts in Clarity language
- **Native Bitcoin Assets**: sBTC brings Bitcoin to DeFi

### Turnkey Benefits
- **Secure Key Management**: Private keys never leave Turnkey's infrastructure
- **secp256k1 Support**: Same curve as Bitcoin and Stacks
- **Embedded Wallets**: No browser extension required
- **Policy Controls**: Custom approval workflows

## Architecture

### Components

```
┌─────────────────────────────────────────────────────┐
│                   PinPeer App                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────┐   │
│  │     TurnkeyWalletManager                   │   │
│  │  - Wallet creation & management            │   │
│  │  - Account selection                       │   │
│  └─────────────┬──────────────────────────────┘   │
│                │                                     │
│  ┌─────────────▼──────────────────────────────┐   │
│  │     StacksTransactionTester                │   │
│  │  - Address display                         │   │
│  │  - Balance checking                        │   │
│  │  - Transaction testing                     │   │
│  └─────────────┬──────────────────────────────┘   │
│                │                                     │
│  ┌─────────────▼──────────────────────────────┐   │
│  │     useTurnkeyDonation Hook                │   │
│  │  - STX transfers                           │   │
│  │  - Contract calls                          │   │
│  │  - Message signing                         │   │
│  └─────────────┬──────────────────────────────┘   │
│                │                                     │
│  ┌─────────────▼──────────────────────────────┐   │
│  │     StacksSigner Utility                   │   │
│  │  - Transaction construction                │   │
│  │  - Turnkey signing integration             │   │
│  │  - Network broadcasting                    │   │
│  └─────────────┬──────────────────────────────┘   │
│                │                                     │
└────────────────┼─────────────────────────────────┘
                 │
    ┌────────────▼────────────┐
    │   @stacks/transactions  │
    │   - Build transactions  │
    │   - Serialize for chain │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │    Turnkey SDK          │
    │    - secp256k1 signing  │
    │    - Key management     │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │    Stacks Network       │
    │    - Broadcast tx       │
    │    - Query state        │
    └─────────────────────────┘
```

## Implementation Details

### 1. Address Derivation

Stacks uses secp256k1 (same as Bitcoin). Turnkey supports two address formats:

```javascript
// Compressed address (default, recommended)
ADDRESS_FORMAT_COMPRESSED   // ST... (testnet) or SP... (mainnet)

// Uncompressed address (legacy)
ADDRESS_FORMAT_UNCOMPRESSED
```

**Creating a Stacks wallet:**

```javascript
import { useTurnkey } from "@turnkey/react-wallet-kit";

const { createWallet } = useTurnkey();

await createWallet({
  walletName: "My Stacks Wallet",
  accounts: ["ADDRESS_FORMAT_STACKS"], // Or ADDRESS_FORMAT_COMPRESSED
});
```

### 2. Transaction Signing

The `StacksSigner` utility handles transaction construction and signing:

**File:** `src/utils/StacksSigner.js`

Key features:
- Builds unsigned transactions using `@stacks/transactions`
- Serializes transactions for signing
- Uses Turnkey to sign with secp256k1
- Broadcasts signed transactions to network

**Example: STX Transfer**

```javascript
import { createStacksSigner } from "../utils/StacksSigner";

const stacksSigner = createStacksSigner(turnkeyClient, "testnet");

const signedTx = await stacksSigner.createSTXTransfer({
  recipient: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  amount: 1000000, // 1 STX in microSTX
  memo: "Hello Stacks!",
  walletAccount: turnkeyWalletAccount,
});

const result = await stacksSigner.broadcastTransaction(signedTx);
console.log("TX ID:", result.txid);
```

### 3. Contract Calls

Call Stacks smart contracts with Turnkey signing:

```javascript
import { uintCV, stringAsciiCV } from "@stacks/transactions";

const signedTx = await stacksSigner.createContractCall({
  contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  contractName: "my-contract",
  functionName: "transfer",
  functionArgs: [
    uintCV(100),
    stringAsciiCV("recipient-address"),
  ],
  walletAccount: turnkeyWalletAccount,
  postConditions: [], // Add post-conditions for safety
});

const result = await stacksSigner.broadcastTransaction(signedTx);
```

### 4. Message Signing

Sign arbitrary messages for authentication:

```javascript
const signature = await stacksSigner.signMessage(
  "Sign in to PinPeer",
  walletAccount
);

console.log("Signature:", signature.signature);
console.log("Address:", signature.address);
```

## Using the Stacks Tester

The `StacksTransactionTester` component provides a UI for testing:

### Access the Tester

1. Navigate to **"Embedded Wallet"** tab
2. Login to Turnkey
3. Create a wallet with Stacks support
4. Click **"Show Stacks Tester"**

### Test Flow

1. **Select Account**: Choose a Stacks wallet account
2. **View Address**: See your Stacks address (ST... for testnet)
3. **Check Balance**: Fetch STX balance from network
4. **Send STX**: Transfer STX to another address
5. **Sign Message**: Sign arbitrary messages

### Getting Testnet STX

To test transactions, you need testnet STX:

1. Copy your Stacks address from the tester
2. Visit: https://explorer.hiro.so/sandbox/faucet?chain=testnet
3. Paste your address and request testnet STX
4. Wait ~10 minutes for confirmation
5. Refresh balance in the tester

## Integration with Donations

### Current Flow (Stacks Connect)

```javascript
// Uses @stacks/connect (browser wallets)
import { openSTXTransfer } from "@stacks/connect";

await openSTXTransfer({
  recipient: creatorAddress,
  amount: amount * 1000000,
  memo: `Pinning ${creatorName}`,
  network: STACKS_TESTNET,
});
```

### New Flow (Turnkey)

```javascript
// Uses Turnkey embedded wallets
import { useTurnkeyDonation } from "./components/DonationHelper";

const { sendSTXWithTurnkey, getStacksAccounts } = useTurnkeyDonation();

const stacksAccounts = getStacksAccounts();
const walletAccount = stacksAccounts[0];

const txid = await sendSTXWithTurnkey({
  recipientAddress: creatorAddress,
  amount: amount, // In STX (auto-converts to microSTX)
  memo: `Pinning ${creatorName} on PinPeer`,
  walletAccount,
});

console.log("Donation sent! TX:", txid);
```

## Code Examples

### Complete Donation Component

```jsx
import { useState } from "react";
import { useTurnkeyDonation } from "./components/DonationHelper";

function DonateWithTurnkey({ creatorAddress, creatorName }) {
  const { sendSTXWithTurnkey, getStacksAccounts } = useTurnkeyDonation();
  const [amount, setAmount] = useState("");
  const [txid, setTxid] = useState(null);

  const handleDonate = async () => {
    const accounts = getStacksAccounts();
    
    if (accounts.length === 0) {
      alert("No Stacks wallets available");
      return;
    }

    try {
      const result = await sendSTXWithTurnkey({
        recipientAddress: creatorAddress,
        amount: parseFloat(amount),
        memo: `Supporting ${creatorName}!`,
        walletAccount: accounts[0],
      });

      setTxid(result);
      alert(`Donation sent! TX: ${result}`);
    } catch (error) {
      console.error("Donation failed:", error);
      alert(`Failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h3>Donate to {creatorName}</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount (STX)"
      />
      <button onClick={handleDonate}>
        Donate with Turnkey
      </button>
      {txid && (
        <a 
          href={`https://explorer.hiro.so/txid/${txid}?chain=testnet`}
          target="_blank"
        >
          View Transaction
        </a>
      )}
    </div>
  );
}
```

### Balance Display

```jsx
import { useState, useEffect } from "react";
import { useTurnkeyDonation } from "./components/DonationHelper";

function StacksBalance({ walletAccount }) {
  const { fetchBalance } = useTurnkeyDonation();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const loadBalance = async () => {
      const bal = await fetchBalance(walletAccount);
      setBalance(bal);
    };
    loadBalance();
  }, [walletAccount]);

  if (!balance) return <div>Loading balance...</div>;

  return (
    <div>
      <p>Available: {(balance.stx.balance / 1000000).toFixed(6)} STX</p>
      <p>Locked: {(balance.stx.locked / 1000000).toFixed(6)} STX</p>
      <p>Total: {(balance.stx.total / 1000000).toFixed(6)} STX</p>
    </div>
  );
}
```

## Network Configuration

### Testnet (Default)

```javascript
import { StacksTestnet } from "@stacks/network";

const network = new StacksTestnet();
// API: https://api.testnet.hiro.so
// Explorer: https://explorer.hiro.so/?chain=testnet
```

### Mainnet

```javascript
import { StacksMainnet } from "@stacks/network";

const network = new StacksMainnet();
// API: https://api.hiro.so
// Explorer: https://explorer.hiro.so
```

**To switch networks:**

```javascript
const { sendSTXWithTurnkey } = useTurnkeyDonation("mainnet"); // or "testnet"
```

## Transaction Fees

Stacks transactions require fees in STX:

- **STX Transfer**: ~200 microSTX (default)
- **Contract Call**: ~500 microSTX (default)
- **Complex Contracts**: Estimate dynamically

The StacksSigner automatically estimates fees, or you can specify:

```javascript
await stacksSigner.createSTXTransfer({
  recipient: address,
  amount: 1000000,
  memo: "Custom fee",
  walletAccount,
  fee: 300, // Custom fee in microSTX
});
```

## Post-Conditions

Post-conditions protect users from unexpected behavior:

```javascript
import { 
  makeStandardSTXPostCondition,
  FungibleConditionCode 
} from "@stacks/transactions";

const postConditions = [
  makeStandardSTXPostCondition(
    senderAddress,
    FungibleConditionCode.LessEqual,
    1000000 // Max 1 STX can be transferred
  )
];

await stacksSigner.createContractCall({
  // ... other params
  postConditions,
});
```

## Error Handling

### Common Errors

**1. Insufficient Balance**
```javascript
try {
  await sendSTXWithTurnkey({...});
} catch (error) {
  if (error.message.includes("insufficient funds")) {
    alert("Not enough STX in your wallet");
  }
}
```

**2. Invalid Address**
```javascript
if (!recipient.startsWith("ST") && !recipient.startsWith("SP")) {
  throw new Error("Invalid Stacks address");
}
```

**3. Network Issues**
```javascript
try {
  await stacksSigner.broadcastTransaction(tx);
} catch (error) {
  if (error.message.includes("network")) {
    alert("Network error. Please try again.");
  }
}
```

## Security Best Practices

1. **Always use Post-Conditions** for contract calls
2. **Validate addresses** before sending transactions
3. **Test on testnet first** before mainnet
4. **Show transaction details** to users before signing
5. **Handle errors gracefully** with user-friendly messages

## Roadmap

### Current Features ✅
- [x] Address derivation
- [x] STX transfers
- [x] Contract calls
- [x] Message signing
- [x] Balance queries
- [x] Testnet support

### Planned Features 🚧
- [ ] Mainnet deployment
- [ ] sBTC integration
- [ ] BNS name resolution
- [ ] Multi-sig support
- [ ] Hardware wallet integration
- [ ] Transaction batching

## Resources

**Stacks**:
- [Stacks Docs](https://docs.stacks.co)
- [Stacks.js](https://github.com/hirosystems/stacks.js)
- [Explorer](https://explorer.hiro.so)
- [Testnet Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)

**Turnkey**:
- [Turnkey Docs](https://docs.turnkey.com)
- [Stacks Example](https://github.com/tkhq/sdk/tree/main/examples/with-stacks)
- [secp256k1 Support](https://docs.turnkey.com/concepts/curves)

**PinPeer**:
- [GitHub Repository](https://github.com/your-repo/pinpeer)
- [Issues](https://github.com/your-repo/pinpeer/issues)

## Troubleshooting

### Stacks Tester Shows No Wallets

**Problem**: "No Stacks Wallets Found" message

**Solution**: Create a wallet with Stacks support
```javascript
await createWallet({
  walletName: "Stacks Wallet",
  accounts: ["ADDRESS_FORMAT_STACKS"],
});
```

### Transaction Fails with "BadNonce"

**Problem**: Nonce error when broadcasting

**Solution**: The nonce is auto-fetched. If issues persist:
```javascript
const nonce = await stacksSigner.fetchNonce(address);
console.log("Current nonce:", nonce);
```

### Balance Shows 0 STX

**Problem**: No testnet STX available

**Solution**:
1. Use faucet: https://explorer.hiro.so/sandbox/faucet?chain=testnet
2. Wait ~10 minutes for confirmation
3. Refresh balance

## Support

For issues or questions:
- Check browser console for detailed errors
- Review the StacksSigner implementation
- Create an issue on GitHub
- Join the Stacks Discord

---

**Built with ❤️ for the Stacks and Turnkey communities**
