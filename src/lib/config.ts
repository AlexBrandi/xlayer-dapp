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

// Contract addresses from deployment
export const CONTRACT_ADDRESSES = {
  FUEL_TOKEN: '0xe80312d9F235ac2f816D5f63C4f06941F2c0d687' as `0x${string}`,
  SHIP_NFT: '0x41aA73453681fa67D42F35162C20998C60e4459F' as `0x${string}`,
  GEM_NFT: '0xB2971910A111412043318D1C31C66c5610eFf441' as `0x${string}`,
  GAME_CONTROLLER: '0x958253CbAc08F33Fcb672eA8400f384a10fd737C' as `0x${string}`,
} as const

export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID) || 196