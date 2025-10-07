# Turnkey Embedded Wallet Setup Guide

## Overview
Your PinPeer app now has Turnkey embedded wallet functionality integrated alongside your existing Stacks wallet connection.

## Setup Steps

### 1. Create Turnkey Organization
1. Go to [Turnkey Dashboard](https://app.turnkey.com)
2. Create an account or sign in
3. Create a new organization

### 2. Configure Auth Proxy
1. Navigate to the **Wallet Kit** section in the dashboard
2. Enable **Auth Proxy**
3. Customize auth methods:
   - ✅ Email OTP
   - ✅ Passkeys
   - ✅ OAuth (Google, Apple, Facebook, X, Discord) - optional

### 3. Get Your Credentials
1. Copy your **Organization ID** from the dashboard
2. Copy your **Auth Proxy Config ID** from the Wallet Kit section
3. Update your `.env` file:

```bash
VITE_ORGANIZATION_ID=your_actual_organization_id
VITE_AUTH_PROXY_CONFIG_ID=your_actual_auth_proxy_config_id
```

### 4. Configure OAuth (Optional)
If you want to enable OAuth providers:

#### For Google, Apple, Facebook:
- Add client IDs in the Turnkey Dashboard under Wallet Kit → Authentication → SDK Configuration

#### For X, Discord (OAuth2.0):
1. Go to Wallet Kit → Socials tab
2. Click **Add provider**
3. Select the provider and fill in:
   - Client ID
   - Client Secret
   - Redirect URI
4. Go back to Authentication tab
5. Enable the provider under SDK Configuration

## Features Implemented

### 1. Turnkey Authentication
- Login/Sign up with email OTP and passkeys
- OAuth support (configurable)
- Automatic session management

### 2. Wallet Management
- **Create Wallet**: Create embedded wallets with multiple blockchain accounts (Ethereum, Solana, etc.)
- **Import Wallet**: Import existing wallets via secure iframe
- **Export Wallet**: Export wallets for backup via secure iframe
- **Add Accounts**: Add more blockchain accounts to existing wallets
- **View Wallets**: See all your embedded wallets and their accounts

### 3. UI Integration
- New "Embedded Wallet" tab in the header
- Toggles between Stacks wallet view and Turnkey wallet view
- Responsive design matching your app's style

## How to Use

### For Users:
1. Click the **"Embedded Wallet"** button in the header
2. Click **"Login / Sign Up"** to authenticate
3. Choose your authentication method:
   - Email OTP
   - Passkey
   - OAuth provider (if configured)
4. Once authenticated:
   - **Create New Wallet**: Creates a wallet with Ethereum and Solana accounts
   - **Import Wallet**: Import an existing wallet
   - **Add Account**: Add more accounts to existing wallets
   - **Export**: Backup your wallet securely

### Supported Blockchains:
- Ethereum (ADDRESS_FORMAT_ETHEREUM)
- Solana (ADDRESS_FORMAT_SOLANA)
- Cosmos (ADDRESS_FORMAT_COSMOS)
- Sei (ADDRESS_FORMAT_SEI)
- Sui (ADDRESS_FORMAT_SUI)
- And many more...

## Development

### Start the app:
```bash
npm run dev
```

### Test the integration:
1. Open http://localhost:5173
2. Click "Embedded Wallet" in the header
3. Complete authentication
4. Test wallet creation and management

## Security Notes
- Private keys are never exposed and remain encrypted in Turnkey's infrastructure
- Import/Export operations happen in a secure iframe
- All authentication is handled through Turnkey's Auth Proxy
- OAuth secrets are encrypted before uploading to Turnkey

## Troubleshooting

### "Auth Proxy Config ID" not found:
- Make sure you've enabled Auth Proxy in the Turnkey Dashboard
- Copy the config ID after saving your auth method settings

### OAuth not working:
- Verify redirect URI matches in both OAuth provider settings and Turnkey config
- For OAuth2.0 providers (X, Discord), ensure you've added them in the Socials tab first

### Wallet creation fails:
- Check browser console for errors
- Ensure user is authenticated (check authState)
- Verify Turnkey credentials in .env file

## Next Steps
- Configure your preferred authentication methods in Turnkey Dashboard
- Update .env with your credentials
- Test the embedded wallet functionality
- Optionally integrate transaction signing with Turnkey wallets

## Resources
- [Turnkey Documentation](https://docs.turnkey.com)
- [Turnkey Dashboard](https://app.turnkey.com)
- [React Wallet Kit Docs](https://docs.turnkey.com/sdks/react/getting-started)
