# sBTC Wallet

A secure, non-custodial Bitcoin wallet built with **Turnkey** for enterprise-grade key management and the **Stacks blockchain** for Bitcoin-secured transactions.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.14-38bdf8)

## 🌟 Features

- 🔐 **Secure Key Management** - Private keys stored in Turnkey's Hardware Security Modules (HSMs)
- ⛓️ **Stacks Integration** - Send STX transactions on Bitcoin-secured blockchain
- 💸 **Transaction Signing** - Non-custodial API-based signing with Turnkey
- 🎨 **Premium UI** - Modern fintech interface with Neo-Bitcoin dark theme
- 🧪 **Testnet Support** - Full development environment with faucet integration
- ⚡ **Real-time Updates** - Live balance and transaction status

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- A [Turnkey](https://turnkey.com) account
- Turnkey API credentials

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/fozagtx/pinpeerv1.git
cd pinpeerv1
```

2. **Install dependencies**
```bash
npm install
# or
bun install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your Turnkey credentials:
```env
# Turnkey Configuration
TURNKEY_BASE_URL=https://api.turnkey.com
TURNKEY_ORGANIZATION_ID=your-org-id-here
TURNKEY_API_PUBLIC_KEY=your-public-key-here
TURNKEY_API_PRIVATE_KEY=your-private-key-here
TURNKEY_SIGNER_PUBLIC_KEY=your-signer-public-key-here
TURNKEY_WALLET_ACCOUNT_ADDRESS=your-wallet-address-here

# Stacks Configuration
STACKS_NETWORK=testnet
STACKS_RECIPIENT_ADDRESS=ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG
```

4. **Run development server**
```bash
npm run dev
# or
bun dev
```

5. **Open your browser**
```
http://localhost:3000
```

## 🔑 Turnkey Setup

### 1. Create Turnkey Account

1. Visit [turnkey.com](https://turnkey.com) and sign up
2. Create a new organization
3. Generate API credentials in the dashboard

### 2. Create a Stacks Wallet

1. Navigate to **Wallets** in Turnkey dashboard
2. Click **Create Wallet**
3. Select **Stacks (STX)** blockchain
4. Save your wallet credentials:
   - Wallet Address (starts with `ST` for testnet)
   - Public Key
   - Wallet Account Address (for signing)

### 3. Get Testnet STX

Use the built-in faucet in the app or visit [Hiro Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)

## 📁 Project Structure

```
pinpeerv1/
├── app/
│   ├── api/
│   │   ├── send/              # POST /api/send - Send STX transactions
│   │   ├── wallet-info/       # GET /api/wallet-info - Get balance & address
│   │   ├── faucet/            # POST /api/faucet - Request testnet STX
│   │   ├── turnkey/           # Turnkey integration endpoints
│   │   └── turnkey-wallets/   # Wallet management
│   ├── components/
│   │   └── SendTransaction.tsx  # Main transaction UI component
│   ├── globals.css            # Global styles & Neo-Bitcoin theme
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Main wallet interface
├── utils/
│   └── index.ts               # Turnkey signing utilities
├── public/                    # Static assets
└── content/                   # Documentation (if added)
```

## 🛠️ API Endpoints

### Send Transaction
**POST** `/api/send`

Send STX to any Stacks address.

**Request:**
```json
{
  "recipient": "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG",
  "amount": "5.0"
}
```

**Response:**
```json
{
  "txid": "0x1234567890abcdef..."
}
```

### Get Wallet Info
**GET** `/api/wallet-info`

Retrieve current balance and address.

**Response:**
```json
{
  "address": "STBZT5DEF0MM560YWS04682P0S08M18P07HZJ7M9",
  "balance": "500.000000"
}
```

### Request Testnet Tokens
**POST** `/api/faucet`

Get free testnet STX for development.

**Response:**
```json
{
  "message": "Faucet request successful! STX will arrive in ~30 seconds",
  "txid": "0xabcdef...",
  "address": "STBZT5DEF0MM560YWS04682P0S08M18P07HZJ7M9"
}
```

## 🎨 UI Theme

The app uses a **Neo-Bitcoin Fintech** dark theme:

| Color | Hex | Usage |
|-------|-----|-------|
| Deep Charcoal | `#0D0E12` | Primary background |
| Warm Orange | `#F7931A` | Bitcoin accent |
| Soft Amber | `#FFC15E` | Secondary accent |
| Gunmetal Gray | `#1C1F25` | Surface/Cards |
| Emerald Green | `#2ECC71` | Success states |
| Soft Red | `#E74C3C` | Error states |

## 🔒 Security Features

### Private Key Management
- **Never exposed** - Private keys never leave Turnkey's HSMs
- **API-based signing** - Sign transactions via secure API calls
- **No local storage** - Keys are not stored in browser or application

### Transaction Security
1. Transaction created client-side
2. Unsigned transaction sent to Turnkey
3. Turnkey signs in HSM
4. Signed transaction returned and broadcast
5. Transaction confirmed on Bitcoin via Stacks PoX

## 🧪 Development

### Run Tests
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## 📊 Technology Stack

### Frontend
- **Next.js 15.5.4** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling

### Backend
- **Next.js API Routes** - Serverless functions
- **Turnkey SDK** - Wallet infrastructure
- **Stacks.js** - Blockchain integration

### Blockchain
- **Stacks** - Bitcoin layer for smart contracts
- **Proof of Transfer (PoX)** - Consensus mechanism
- **Bitcoin** - Final settlement layer

## 🌐 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fozagtx/pinpeerv1)

1. Click the button above or visit [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables in Production

Make sure to add all required environment variables in your Vercel project settings:
- `TURNKEY_BASE_URL`
- `TURNKEY_ORGANIZATION_ID`
- `TURNKEY_API_PUBLIC_KEY`
- `TURNKEY_API_PRIVATE_KEY`
- `TURNKEY_SIGNER_PUBLIC_KEY`
- `TURNKEY_WALLET_ACCOUNT_ADDRESS`
- `STACKS_NETWORK`

## 🐛 Troubleshooting

### "Resource exhausted" Error
**Problem:** Turnkey quota exceeded  
**Solution:** Upgrade to a paid Turnkey plan at [turnkey.com/pricing](https://turnkey.com/pricing)

### Transaction Failing
**Problem:** Insufficient balance or invalid address  
**Solution:** 
- Verify you have enough STX (amount + 0.000180 STX fee)
- Check recipient address starts with `ST` (testnet) or `SP` (mainnet)

### Faucet Not Working
**Problem:** Rate limit exceeded  
**Solution:** Wait 10-15 minutes before requesting again

## 📚 Learn More

- [Turnkey Documentation](https://docs.turnkey.com)
- [Stacks Documentation](https://docs.stacks.co)
- [Stacks.js Reference](https://stacks.js.org)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Turnkey](https://turnkey.com) - Secure wallet infrastructure
- [Stacks](https://stacks.co) - Bitcoin layer for smart contracts
- [Hiro](https://hiro.so) - Stacks development tools
- [Vercel](https://vercel.com) - Deployment platform

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/fozagtx/pinpeerv1/issues)
- **Turnkey Support:** help@turnkey.com
- **Stacks Discord:** [Join Server](https://discord.gg/stacks)

---

**Built with ❤️ using Turnkey + Stacks + Next.js**
