import { useMemo } from 'react'
import { useContracts } from './useContracts'
import { formatEther } from 'viem'

export function useRewards() {
  const { 
    useTotalPendingReward,
    usePendingReward,
    useClaimRewards,
    useUserShipStatus
  } = useContracts()

  const { data: totalPending } = useTotalPendingReward()
  const { data: userStatus } = useUserShipStatus()
  const { claim, claimBatch, claimAll, isPending: isClaimPending } = useClaimRewards()

  // Get total pending rewards formatted
  const totalPendingFormatted = useMemo(() => {
    if (!totalPending) return '0'
    return formatEther(totalPending as bigint)
  }, [totalPending])

  // Get pending rewards for a specific ship
  const useShipPendingReward = (tokenId: bigint | undefined) => {
    const { data: pending } = usePendingReward(tokenId)
    
    const pendingFormatted = useMemo(() => {
      if (!pending) return '0'
      return formatEther(pending as bigint)
    }, [pending])

    return {
      pending: pending as bigint | undefined,
      pendingFormatted
    }
  }

  // Get all staked ships with pending rewards
  const stakedShipsWithRewards = useMemo(() => {
    if (!userStatus?.stakedNFTs) return []
    return userStatus.stakedNFTs
  }, [userStatus])

  // Claim rewards for all staked ships
  const claimAllRewards = async () => {
    if (stakedShipsWithRewards.length === 0) {
      return
    }
    await claimAll()
  }

  // Claim rewards for specific ships
  const claimRewardsForShips = async (tokenIds: bigint[]) => {
    if (tokenIds.length === 0) return
    
    if (tokenIds.length === 1) {
      await claim(tokenIds[0])
    } else {
      await claimBatch(tokenIds)
    }
  }

  return {
    totalPending: totalPending as bigint | undefined,
    totalPendingFormatted,
    stakedShipsWithRewards,
    useShipPendingReward,
    claimAllRewards,
    claimRewardsForShips,
    isClaimPending
  }
}