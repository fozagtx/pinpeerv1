# Quick Start Guide

Get PinPeer up and running in 5 minutes!

## Prerequisites ✓

- ✅ Node.js 16+ installed
- ✅ npm or yarn installed
- ✅ Turnkey account (free at app.turnkey.com)

## Step 1: Install Dependencies (1 min)

```bash
npm install
```

## Step 2: Configure Environment (2 min)

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Get Turnkey credentials:**
   - Go to https://app.turnkey.com
   - Sign up / Log in
   - Create organization if needed
   - Go to "Wallet Kit" section
   - Enable Auth Proxy
   - Copy Organization ID
   - Copy Auth Proxy Config ID

3. **Add to .env file:**
   ```env
   VITE_ORGANIZATION_ID=your_org_id_here
   VITE_AUTH_PROXY_CONFIG_ID=your_config_id_here
   ```

4. **(Optional) Get WalletConnect ID:**
   - Go to https://cloud.walletconnect.com
   - Create project
   - Copy Project ID
   - Add to .env:
   ```env
   VITE_WALLETCONNECT_PROJECT_ID=your_wc_project_id
   ```

## Step 3: Start the App (1 min)

```bash
npm run dev
```

Open http://localhost:5173 in your browser!

## Step 4: Try It Out (1 min)

### Test Stacks Connect (Default Flow)

1. Click **"Connect Wallet"**
2. Install Hiro Wallet extension if needed
3. Approve connection
4. Browse creators
5. Select amount and donate!

### Test Embedded Wallets

1. Click **"Embedded Wallet"** tab
2. Click **"Login / Sign Up"**
3. Choose auth method (email/passkey/OAuth)
4. Click **"Create New Wallet"**
5. Your wallet is ready! 🎉

### Test External Wallet Connection

1. In Embedded Wallet view
2. Click **"Connect External Wallet"**
3. Choose wallet:
   - MetaMask (Ethereum)
   - Phantom (Solana)
   - WalletConnect (mobile)
4. Approve in your wallet
5. Connected! ✅

### Test Message Signing

1. In Embedded Wallet view
2. Click **"Show Signing Interface"**
3. Select any wallet account
4. Enter message: `Hello PinPeer!`
5. Click **"Sign Message"**
6. Copy your signature! 📝

## Common Issues & Quick Fixes

### Issue: Blank Embedded Wallet Page
**Fix:** Check browser console (F12) for errors
- Verify .env variables are correct
- Restart dev server after changing .env

### Issue: "Organization not found"
**Fix:** Double-check your Organization ID
- Make sure you copied the full ID
- No extra spaces or quotes

### Issue: WalletConnect not showing
**Fix:** Add Project ID to .env
- This is optional but recommended
- Without it, only browser extensions work

### Issue: "Cannot find module"
**Fix:** Reinstall dependencies
```bash
rm -rf node_modules
npm install
```

## Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Maintenance
npm run lint            # Check code quality
```

## Next Steps

📖 **Read the docs:**
- [WALLET_INTEGRATION.md](./WALLET_INTEGRATION.md) - Wallet connection guide
- [SIGNING_GUIDE.md](./SIGNING_GUIDE.md) - Signing implementation
- [README.md](./README.md) - Full project documentation

🧪 **Test features:**
- Connect different wallets
- Try message signing
- Test transaction signing
- Use external wallets

💻 **Start coding:**
- Check `src/components/SigningManager.jsx` for examples
- See `src/components/DonationHelper.jsx` for utilities
- Review `src/App.jsx` for integration

## Feature Overview

| Feature | Status | Location |
|---------|--------|----------|
| Stacks Connect | ✅ Working | Header.jsx |
| Embedded Wallets | ✅ Working | TurnkeyWalletManager.jsx |
| External Wallets | ✅ Working | TurnkeyWalletManager.jsx |
| Message Signing | ✅ Working | SigningManager.jsx |
| Transaction Signing | ✅ Working | SigningManager.jsx |
| Stacks Support | ✅ Configured | main.jsx |

## Supported Wallets

### Browser Extensions
- ✅ MetaMask (Ethereum)
- ✅ Phantom (Ethereum & Solana)
- ✅ Hiro Wallet (Stacks)
- ✅ Leather (Stacks)

### Mobile Wallets (via WalletConnect)
- ✅ Rainbow
- ✅ Trust Wallet
- ✅ Coinbase Wallet
- ✅ Many more...

### Embedded Wallets (Turnkey)
- ✅ Ethereum accounts
- ✅ Solana accounts
- ✅ Stacks accounts (configured)

## Environment Setup Checklist

- [ ] Node.js 16+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created
- [ ] Turnkey Organization ID added
- [ ] Turnkey Auth Proxy Config ID added
- [ ] WalletConnect Project ID added (optional)
- [ ] Dev server started (`npm run dev`)
- [ ] Browser opened to localhost:5173

## Testing Checklist

- [ ] App loads without errors
- [ ] Stacks Connect wallet works
- [ ] Can create embedded wallet
- [ ] Can connect MetaMask
- [ ] Can sign messages
- [ ] Can view transaction history
- [ ] UI is responsive on mobile

## Resources

**Official Documentation:**
- Turnkey: https://docs.turnkey.com
- Stacks: https://docs.stacks.co
- WalletConnect: https://docs.walletconnect.com

**Support:**
- GitHub Issues: [Your repo]
- Discord: [Your discord]
- Email: [Your email]

## Success! 🎉

If you made it here, you should have:
- ✅ PinPeer running locally
- ✅ Turnkey embedded wallets working
- ✅ External wallet connection ready
- ✅ Signing functionality available

**Start building amazing features!** 🚀

---

Need help? Check the [README.md](./README.md) or create an issue.
