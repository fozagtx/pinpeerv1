# How to Get Your Turnkey Wallet Account Address

## The Issue
You're getting error: `Could not find any resource to sign with. Addresses are case sensitive.`

This is because `TURNKEY_SIGNER_PUBLIC_KEY` should NOT be your API public key. It needs to be your **wallet account address**.

## Steps to Fix

### Option 1: Use the API endpoint (Easiest)

1. Start your dev server:
```bash
npm run dev
```

2. Visit: `http://localhost:3000/api/turnkey-wallets`

3. You'll see output like:
```json
{
  "wallets": [
    {
      "walletId": "...",
      "walletName": "...",
      "accounts": [
        {
          "address": "0x1a2b3c4d...",  // <-- THIS is what you need
          "addressFormat": "ADDRESS_FORMAT_ETHEREUM",
          "publicKey": "02932a..."
        }
      ]
    }
  ]
}
```

4. Copy the **address** from the Stacks account

5. Update your `.env` or `.env.local`:
```bash
# Keep the public key for constructing transactions
TURNKEY_SIGNER_PUBLIC_KEY="02932a213b530fb89b9404225114c731d552a9fff028bebc371562870d51e6ac5b"

# ADD THIS NEW LINE with the wallet account address
TURNKEY_WALLET_ACCOUNT_ADDRESS="<paste-address-here>"
```

### Option 2: From Turnkey Dashboard

1. Log into https://app.turnkey.com
2. Go to your organization
3. Click on "Wallets"
4. Select your wallet
5. Find the account with Stacks/Bitcoin support
6. Copy the **Account Address** (not the public key)
7. Add it to your `.env.local` as `TURNKEY_WALLET_ACCOUNT_ADDRESS`

## What Changed in the Code

- `app/api/turnkey/route.ts` - Now uses `TURNKEY_WALLET_ACCOUNT_ADDRESS` for `signWith`
- `utils/index.ts` - Same change for transaction signing
- `.env.example` - Added documentation for both variables

## Understanding the Variables

- `TURNKEY_SIGNER_PUBLIC_KEY` - Used to **construct** the Stacks transaction
- `TURNKEY_WALLET_ACCOUNT_ADDRESS` - Used to **sign** with Turnkey (the `signWith` parameter)
- `TURNKEY_API_PUBLIC_KEY` - Used for API authentication (different from signer key!)

## Restart After Adding

After adding `TURNKEY_WALLET_ACCOUNT_ADDRESS` to your `.env.local`, restart the dev server:
```bash
# Stop server (Ctrl+C)
npm run dev
```
