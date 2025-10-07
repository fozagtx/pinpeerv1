# Using ONLY Turnkey for All Stacks Transactions

## Current Capabilities

### ✅ Already Working
- STX transfers (send/receive)
- Smart contract calls  
- Message signing
- Testnet & Mainnet support
- Transaction broadcasting

## What You Can Do

### 1. Regular STX Transfers
```javascript
const txid = await sendSTXWithTurnkey({
  recipientAddress: "ST...",
  amount: 1.5,
  memo: "Payment for service",
  walletAccount: turnkeyAccount,
});
```

### 2. sBTC Transfers

Add to `DonationHelper.jsx`:

```javascript
const sendSBTCWithTurnkey = async ({
  recipientAddress,
  amount,
  memo = "",
  walletAccount,
}) => {
  const sbtcContractAddress = "SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR";
  const sbtcContractName = "sbtc-token";
  
  const functionArgs = [
    uintCV(amount * 100000000), // Convert to satoshis
    principalCV(walletAccount.address),
    principalCV(recipientAddress),
    someCV(bufferCV(Buffer.from(memo)))
  ];
  
  return await callContract({
    contractAddress: sbtcContractAddress,
    contractName: sbtcContractName,
    functionName: "transfer",
    functionArgs,
    walletAccount,
  });
};
```

### 3. sBTC Bridge (Deposit BTC → Get sBTC)

```javascript
const depositBTCForSBTC = async ({
  btcAmount,
  walletAccount,
}) => {
  const bridgeContractAddress = "SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR";
  const bridgeContractName = "sbtc-bridge";
  
  const functionArgs = [
    uintCV(btcAmount * 100000000),
  ];
  
  return await callContract({
    contractAddress: bridgeContractAddress,
    contractName: bridgeContractName,
    functionName: "deposit",
    functionArgs,
    walletAccount,
  });
};
```

### 4. Network Configuration

Testnet vs Mainnet is handled in `StacksSigner.js`:

```javascript
const signer = createStacksSigner(client, "testnet"); // or "mainnet"
```

Addresses are automatically formatted:
- Testnet: `ST...`
- Mainnet: `SP...`

## Required Dependencies

Add Clarity value builders for contract calls:

```bash
npm install @stacks/transactions
```

Import in files that need sBTC:

```javascript
import {
  uintCV,
  principalCV,
  someCV,
  bufferCV,
  noneCV,
} from "@stacks/transactions";
```

## Migration from Stacks Connect to Turnkey Only

### Remove:
1. `@stacks/connect` dependency
2. Stacks Connect "Connect Wallet" button
3. `isConnected()`, `connect()`, `disconnect()` calls

### Keep:
1. Turnkey authentication
2. All StacksSigner functionality
3. Wallet management in TurnkeyWalletManager

### Update:
1. Replace Header connect button with Turnkey login
2. Show Turnkey wallet balance instead of Stacks Connect balance
3. Use Turnkey accounts for all transactions

## Advantages of Turnkey Only

1. **No browser extension needed** - works on mobile/desktop
2. **Better UX** - no popup windows, signs in-app
3. **Multi-chain** - one wallet for Stacks, ETH, Solana
4. **Passkey auth** - more secure than passwords
5. **Simpler codebase** - one wallet system instead of two

## Limitations

None! Turnkey can do everything Stacks Connect can do.
