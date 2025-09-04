import { useMemo } from 'react'
import { useContracts } from './useContracts'
import { formatEther } from 'viem'
import type { GemBalance } from '../types'
import { GemType } from '../types'

export function useGems() {
  const { 
    useGemBalances,
    useGemPrices,
    useBuyGems,
    useFuelBalance,
    useIsApprovedForAllGems,
    useApproveGems
  } = useContracts()

  const gemBalances = useGemBalances()
  const gemPrices = useGemPrices()
  const { data: fuelBalance } = useFuelBalance()
  const { data: isApprovedForAll } = useIsApprovedForAllGems()
  const { approveAll: approveGems, isPending: isApprovePending } = useApproveGems()
  const { buyGems, isPending: isBuyPending } = useBuyGems()

  // Get gem balances
  const balances: GemBalance = useMemo(() => {
    return {
      sapphire: (gemBalances.sapphire.data as bigint) || 0n,
      sunstone: (gemBalances.sunstone.data as bigint) || 0n,
      lithium: (gemBalances.lithium.data as bigint) || 0n,
    }
  }, [gemBalances])

  // Get gem prices in FUEL
  const prices = useMemo(() => {
    return {
      sapphire: gemPrices.sapphire.data as bigint || 0n,
      sunstone: gemPrices.sunstone.data as bigint || 0n,
      lithium: gemPrices.lithium.data as bigint || 0n,
    }
  }, [gemPrices])

  // Get gem prices formatted
  const pricesFormatted = useMemo(() => {
    return {
      sapphire: formatEther(prices.sapphire),
      sunstone: formatEther(prices.sunstone),
      lithium: formatEther(prices.lithium),
    }
  }, [prices])

  // Check if user can afford gems
  const canAfford = useMemo(() => {
    const balance = fuelBalance || 0n
    return {
      sapphire: balance >= prices.sapphire,
      sunstone: balance >= prices.sunstone,
      lithium: balance >= prices.lithium,
    }
  }, [fuelBalance, prices])

  // Buy gems helper
  const purchaseGems = async (gemType: keyof typeof GemType, amount: number) => {
    const gemId = GemType[gemType.toUpperCase() as keyof typeof GemType]
    await buyGems(gemId, BigInt(amount))
  }

  // Get gem metadata
  const gemMetadata = {
    [GemType.SAPPHIRE]: {
      name: 'Sapphire',
      symbol: 'SAP',
      color: '#0066ff',
      description: 'Rare blue gem used for ship upgrades'
    },
    [GemType.SUNSTONE]: {
      name: 'Sunstone',
      symbol: 'SUN',
      color: '#ff9900',
      description: 'Radiant gem that powers ship systems'
    },
    [GemType.LITHIUM]: {
      name: 'Lithium',
      symbol: 'LIT',
      color: '#cc99ff',
      description: 'Essential mineral for advanced upgrades'
    }
  }

  return {
    balances,
    prices,
    pricesFormatted,
    canAfford,
    purchaseGems,
    gemMetadata,
    isApprovedForAll: isApprovedForAll as boolean || false,
    approveGems,
    isApprovePending,
    isBuyPending
  }
}