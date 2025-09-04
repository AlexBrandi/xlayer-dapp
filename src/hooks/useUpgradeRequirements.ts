import { useContracts } from './useContracts'
import { formatEther } from 'viem'

export function useUpgradeRequirements() {
  const { useUpgradeCost } = useContracts()
  
  // Fetch costs for levels 1-4 (upgrading to 2-5)
  const level1 = useUpgradeCost(1)
  const level2 = useUpgradeCost(2)
  const level3 = useUpgradeCost(3)
  const level4 = useUpgradeCost(4)

  const formatCost = (data: readonly [bigint, bigint, bigint, bigint] | undefined) => {
    if (!data) return null
    const [tokenCost, gem1Cost, gem2Cost, gem3Cost] = data
    return {
      fuel: formatEther(tokenCost),
      sapphire: gem1Cost.toString(),
      sunstone: gem2Cost.toString(),
      lithium: gem3Cost.toString()
    }
  }

  return {
    level1to2: formatCost(level1.data),
    level2to3: formatCost(level2.data),
    level3to4: formatCost(level3.data),
    level4to5: formatCost(level4.data),
    isLoading: level1.isLoading || level2.isLoading || level3.isLoading || level4.isLoading
  }
}