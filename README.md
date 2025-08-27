# X-Layer Ship Fleet DApp

A decentralized application for managing ship NFTs on OKX X-Layer mainnet. Mint ships, send them on voyages, collect $FUEL rewards, and upgrade your fleet.

## Features

- **Dashboard**: View your ship fleet, monitor rewards, and manage voyages
- **Minting**: Mint new ship NFTs with varying rarities
- **Upgrade & Repair**: Level up your ships and maintain their durability
- **Market**: Trade $FUEL tokens via integrated DexScreener
- **Chain Support**: Automatic detection and switching to X-Layer mainnet

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS (dark theme with glassmorphism)
- Wagmi + Viem for Web3 integration
- React Router for navigation
- React Hot Toast for notifications

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.sample .env
```

3. Update `.env` with your contract addresses:
```
VITE_RPC_URL=https://rpc.xlayer.tech
VITE_CHAIN_ID=196
VITE_FUEL=0x... # FUEL token address
VITE_SHIP=0x... # Ship NFT address
VITE_CTRL=0x... # Reward Controller address
```

4. Start development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── Navigation.tsx    # Top navigation with wallet connection
│   ├── ShipCard.tsx      # Individual ship display card
│   └── Stat.tsx          # Reusable stat component
├── hooks/
│   ├── useContracts.ts   # Contract read/write hooks
│   ├── useShips.ts       # Ship data management
│   └── useRewards.ts     # Reward calculations
├── lib/
│   ├── abis.ts           # Contract ABIs
│   ├── config.ts         # Wagmi configuration
│   └── format.ts         # Utility formatters
├── pages/
│   ├── Dashboard.tsx     # Main fleet view
│   ├── Mint.tsx          # Ship minting
│   ├── UpgradeRepair.tsx # Ship upgrades/repairs
│   └── Market.tsx        # DexScreener integration
├── types/
│   └── index.ts          # TypeScript types
├── App.tsx               # Main app component
└── main.tsx              # App entry point
```

## Smart Contract Integration

The DApp interacts with three main contracts:

1. **FUEL Token (ERC20)**: Game currency for rewards and payments
2. **Ship NFT (ERC721)**: Ships with attributes and voyage functionality
3. **Reward Controller**: Manages rewards, upgrades, and repairs

## Ship Attributes

- **Rarity**: Common (60%), Rare (25%), Epic (12%), Legendary (3%)
- **Level**: Determines earning potential and upgrade costs
- **HP & Effective HP**: Ship stats
- **Durability**: Decreases during voyages, requires repair when low

## UI Features

- Dark sci-fi theme with glassmorphism effects
- Rarity-based color coding (gray/blue/purple/gold)
- Real-time reward estimation for voyaging ships
- Loading states and error handling with toast notifications
- Mobile responsive design

## Network Configuration

- **Chain**: OKX X-Layer Mainnet (Chain ID: 196)
- **RPC**: https://rpc.xlayer.tech (primary), https://xlayerrpc.okx.com (backup)
- **Block Explorer**: https://www.okx.com/explorer/xlayer

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Notes

- Ships cannot be upgraded or repaired while voyaging
- Low durability (<30%) prevents starting new voyages
- Reward estimation is frontend-only and marked as "estimated"
- All contract errors display raw revert messages via toast