import { createConfig, http } from 'wagmi'
import { bsc } from 'viem/chains'
import { metaMask, walletConnect, injected } from '@wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [bsc],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: '1234567890abcdef', // Replace with your actual project ID
    }),
  ],
  transports: {
    [bsc.id]: http(import.meta.env.VITE_RPC_URL || 'https://bsc-dataseed1.binance.org'),
  },
})

// Contract addresses from deployment on BNB Chain
export const CONTRACT_ADDRESSES = {
  SHIP_NFT: '0xe80312d9F235ac2f816D5f63C4f06941F2c0d687' as `0x${string}`,
  FUEL_TOKEN: '0x41aA73453681fa67D42F35162C20998C60e4459F' as `0x${string}`,
  GEM_NFT: '0x152De2380eBb164173E855D2feFe09d98dC965dc' as `0x${string}`,
  GAME_CONTROLLER: '0xC7616b62aFb1E9Edbd1aA4F932342db829E4e1Fc' as `0x${string}`,
} as const

export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID) || 56