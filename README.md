# PinPeer - Support Creators on Stacks Blockchain

PinPeer is a decentralized application for supporting your favorite creators with STX donations, featuring Turnkey's embedded wallet infrastructure and comprehensive signing capabilities.

## 🚀 Features

### Core Functionality
- **Creator Discovery**: Browse and discover creators on the Stacks blockchain
- **STX Donations**: Send STX tokens to support creators
- **Transaction History**: Track all your donation history
- **Pinned Peers**: Save your favorite creators for quick access

### Wallet Integration
- **Embedded Wallets**: Turnkey-powered embedded wallets (no extension needed)
- **External Wallets**: Support for MetaMask, Phantom, Hiro Wallet, Leather
- **Multi-Chain**: Ethereum, Solana, and Stacks blockchain support
- **WalletConnect**: Connect mobile wallets via QR code

### Signing Capabilities
- **Message Signing**: Sign arbitrary messages with any wallet
- **Transaction Signing**: Sign and broadcast blockchain transactions
- **Modal Confirmations**: User-friendly signing confirmation UI
- **Multi-Wallet**: Use both embedded and external wallets

### Stacks Blockchain Integration
- **Full Transaction Support**: STX transfers and contract calls
- **Address Derivation**: Generate Stacks addresses from Turnkey wallets
- **Balance Queries**: Real-time balance checking on Stacks network
- **Message Signing**: Sign messages for authentication
- **Testnet Support**: Complete testing environment
- **Transaction Tester**: Built-in UI for testing Stacks transactions

## 📚 Documentation

- **[Wallet Integration Guide](./WALLET_INTEGRATION.md)**: Complete guide for external wallet connections
- **[Signing Guide](./SIGNING_GUIDE.md)**: Learn how to sign messages and transactions
- **[Stacks Integration](./STACKS_INTEGRATION.md)**: Full Stacks blockchain integration guide
- **[UI Customization](./UI_CUSTOMIZATION.md)**: Customize Turnkey modals and components
- **[Environment Setup](./.env.example)**: Configuration template

## 🛠️ Setup

### Prerequisites

- Node.js 16+ and npm
- Turnkey account ([Sign up](https://app.turnkey.com))
- WalletConnect Project ID (Optional, [Get one](https://cloud.walletconnect.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pinpeer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your credentials
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🔑 Environment Variables

```env
# Turnkey Configuration (Required)
VITE_ORGANIZATION_ID=your_turnkey_organization_id
VITE_AUTH_PROXY_CONFIG_ID=your_auth_proxy_config_id

# WalletConnect (Optional but recommended)
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### Getting Your Credentials

#### Turnkey Setup
1. Go to [app.turnkey.com](https://app.turnkey.com)
2. Create an organization
3. Navigate to "Wallet Kit" section
4. Enable Auth Proxy and configure auth methods
5. Copy your Organization ID and Auth Proxy Config ID

#### WalletConnect Setup
1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Create a new project
3. Copy your Project ID

## 🎯 Quick Start Guide

### Using Stacks Connect Wallets

1. Click **"Connect Wallet"** in the header
2. Install Hiro Wallet or Leather extension if needed
3. Approve the connection
4. Browse creators and send donations

### Using Embedded Wallets

1. Click **"Embedded Wallet"** in the header
2. Log in with email, passkey, or OAuth
3. Click **"Create New Wallet"**
4. Your wallet is ready to use!

### Connecting External Wallets

1. Navigate to **"Embedded Wallet"** section
2. Click **"Connect External Wallet"**
3. Choose from available providers:
   - MetaMask, Phantom (browser extensions)
   - WalletConnect (mobile wallets)
   - Hiro Wallet, Leather (Stacks wallets)

### Signing Messages & Transactions

1. Go to **"Embedded Wallet"** → **"Show Signing Interface"**
2. Select a wallet account
3. Choose **"Sign Message"** or **"Sign Transaction"**
4. Enter your data and click sign
5. Copy the signature/result

### Testing Stacks Transactions

1. Go to **"Embedded Wallet"** → **"Show Stacks Tester"**
2. Select a Stacks wallet account
3. View your Stacks address
4. Check balance (get testnet STX from faucet if needed)
5. Send STX transfers or sign messages
6. View transactions in Stacks Explorer

## 🔧 Tech Stack

- **Frontend**: React 19 + Vite
- **Blockchain**: Stacks (Bitcoin Layer 2)
- **Wallet SDK**: Turnkey React Wallet Kit
- **Stacks SDK**: @stacks/connect, @stacks/transactions
- **Styling**: CSS Modules
- **Icons**: React Icons

## 📁 Project Structure

```
pinpeer/
├── src/
│   ├── components/
│   │   ├── Header.jsx                 # App header with wallet connection
│   │   ├── CreatorCard.jsx            # Individual creator card
│   │   ├── CreatorsGrid.jsx           # Grid of creators
│   │   ├── LandingPage.jsx            # Landing page
│   │   ├── TransactionHistory.jsx     # Transaction history view
│   │   ├── TurnkeyWalletManager.jsx   # Turnkey wallet management
│   │   ├── SigningManager.jsx         # Message/transaction signing UI
│   │   └── DonationHelper.jsx         # Turnkey donation utilities
│   ├── styles/
│   │   ├── App.css
│   │   ├── Header.css
│   │   ├── CreatorCard.css
│   │   ├── TurnkeyWalletManager.css
│   │   └── SigningManager.css
│   ├── App.jsx                        # Main app component
│   ├── main.jsx                       # App entry point
│   └── mockData.js                    # Sample creator data
├── .env.example                       # Environment variables template
├── WALLET_INTEGRATION.md              # Wallet integration guide
├── SIGNING_GUIDE.md                   # Signing guide
└── README.md                          # This file
```

## 🌐 Supported Chains

### Ethereum (EVM)
- **Mainnet**: Chain ID `eip155:1`
- **Sepolia Testnet**: Chain ID `eip155:11155111`
- **Wallets**: MetaMask, Phantom, WalletConnect

### Solana
- **Mainnet**: Chain ID `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`
- **Devnet**: Chain ID `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`
- **Wallets**: Phantom, Solflare, WalletConnect

### Stacks (Bitcoin L2)
- **Mainnet**: Bitcoin-secured smart contracts
- **Testnet**: For development and testing
- **Wallets**: Hiro Wallet, Leather, Turnkey Embedded

## 🎨 Features Walkthrough

### 1. Wallet Management

**Embedded Wallets**:
- Create multi-chain wallets instantly
- No browser extension required
- Secure key management by Turnkey
- Email, passkey, or OAuth authentication

**External Wallets**:
- Connect existing browser wallets
- Support for mobile wallets via WalletConnect
- Switch between multiple connected wallets

### 2. Message Signing

**Use Cases**:
- Authentication challenges
- Proof of ownership
- Off-chain signatures

**Features**:
- Direct signing (no modal)
- Modal confirmation UI
- Copy signature to clipboard

### 3. Transaction Signing

**Capabilities**:
- Sign transactions for any supported chain
- Sign & send in one step
- Transaction hash tracking

**Supported Operations**:
- Token transfers
- Contract interactions
- Cross-chain transactions

### 4. Donation Flow

**Current Flow** (Stacks Connect):
1. Connect Hiro/Leather wallet
2. Select creator and amount
3. Confirm in wallet
4. Transaction sent!

**Future Flow** (Turnkey Integration):
1. Use embedded or external wallet
2. Sign STX transfer with Turnkey
3. Transaction broadcast
4. Confirmation and history tracking

## 🔐 Security Features

- **Non-Custodial**: Users control their keys
- **Turnkey Security**: Enterprise-grade key management
- **Transaction Confirmation**: Review before signing
- **External Wallet Control**: Users approve each action
- **Testnet Support**: Safe development environment

## 🚧 Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 🤝 Contributing

We welcome contributions! Areas for contribution:

1. **Stacks Support for Turnkey**: Help integrate Stacks signing into Turnkey SDK
2. **UI/UX Improvements**: Enhance the user interface
3. **Additional Chains**: Add support for more blockchains
4. **Testing**: Write unit and integration tests
5. **Documentation**: Improve guides and examples

### Stacks Support Contribution

The current implementation includes **unofficial Stacks support** that can be contributed to Turnkey's SDK:

- Stacks chain configuration
- `ADDRESS_FORMAT_STACKS` support
- Stacks transaction signing
- Integration with `@stacks/transactions`

See [WALLET_INTEGRATION.md](./WALLET_INTEGRATION.md#stacks-integration) for details.

## 📖 Additional Resources

- [Turnkey Documentation](https://docs.turnkey.com)
- [Stacks Documentation](https://docs.stacks.co)
- [WalletConnect Documentation](https://docs.walletconnect.com)
- [Hiro Wallet](https://wallet.hiro.so)
- [Leather Wallet](https://leather.io)

## 🐛 Known Issues

1. **Blank Embedded Wallet Page**: 
   - Solution: Check browser console for errors
   - Verify environment variables are set correctly
   - Ensure Turnkey organization is properly configured

2. **WalletConnect Not Working**:
   - Ensure `VITE_WALLETCONNECT_PROJECT_ID` is set
   - Check that project is active on WalletConnect dashboard

3. **Stacks Signing**:
   - Currently uses Stacks Connect (@stacks/connect)
   - Turnkey Stacks signing is in development

## 📝 License

[Add your license here]

## 👥 Team

Built with ❤️ for the Stacks and Web3 community

## 🙏 Acknowledgments

- Turnkey team for the amazing wallet infrastructure
- Stacks ecosystem for Bitcoin-secured smart contracts
- All the creators and supporters using PinPeer

---

**Need Help?** Check the documentation files:
- [WALLET_INTEGRATION.md](./WALLET_INTEGRATION.md)
- [SIGNING_GUIDE.md](./SIGNING_GUIDE.md)
- Or open an issue on GitHub
