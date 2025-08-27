import { createConfig, http } from 'wagmi'
import { defineChain } from 'viem'
import { metaMask, walletConnect, injected } from '@wagmi/connectors'

// OKX X-Layer Mainnet configuration
export const xlayer = defineChain({
  id: 196,
  name: 'X-Layer',
  nativeCurrency: {
    decimals: 18,
    name: 'OKB',
    symbol: 'OKB',
  },
  rpcUrls: {
    default: { http: ['https://rpc.xlayer.tech'] },
    public: { http: ['https://rpc.xlayer.tech'] },
  },
  blockExplorers: {
    default: { name: 'OKX Explorer', url: 'https://www.okx.com/explorer/xlayer' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 0,
    },
  },
})

export const wagmiConfig = createConfig({
  chains: [xlayer],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: '1234567890abcdef', // Replace with your actual project ID
    }),
  ],
  transports: {
    [xlayer.id]: http(import.meta.env.VITE_RPC_URL || 'https://rpc.xlayer.tech'),
  },
})

// Contract addresses from environment
export const CONTRACT_ADDRESSES = {
  FUEL_TOKEN: import.meta.env.VITE_FUEL as `0x${string}`,
  SHIP_NFT: import.meta.env.VITE_SHIP as `0x${string}`,
  REWARD_CONTROLLER: import.meta.env.VITE_CTRL as `0x${string}`,
} as const

export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID) || 196