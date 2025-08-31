import { useMemo } from 'react'
import { useContracts } from './useContracts'
import type { ShipInfo } from '../types'

export function useShips() {
  const { 
    useTokensOfOwner, 
    useUserShipStatus, 
    useShipLevel, 
    useShipImageId, 
    usePendingReward 
  } = useContracts()

  const { data: userTokens } = useTokensOfOwner()
  const { data: userStatus } = useUserShipStatus()

  // Get all ships owned by the user
  const allShips = useMemo(() => {
    if (!userTokens) return []
    return userTokens as bigint[]
  }, [userTokens])

  // Get staked ships
  const stakedShips = useMemo(() => {
    if (!userStatus?.stakedNFTs) return []
    return userStatus.stakedNFTs
  }, [userStatus])

  // Get unstaked ships
  const unstakedShips = useMemo(() => {
    if (!userStatus?.unstakedNFTs) return []
    return userStatus.unstakedNFTs
  }, [userStatus])

  // Hook to get detailed info for a specific ship
  const useShipDetails = (tokenId: bigint | undefined) => {
    const { data: level } = useShipLevel(tokenId)
    const { data: imageId } = useShipImageId(tokenId)
    const { data: pendingReward } = usePendingReward(tokenId)

    const isStaked = tokenId ? stakedShips.includes(tokenId) : false

    const shipInfo: ShipInfo | undefined = tokenId ? {
      tokenId,
      level: Number(level || 1),
      imageId: Number(imageId || 0),
      isStaked,
      pendingReward: pendingReward as bigint | undefined,
    } : undefined

    return shipInfo
  }

  // Get all ships with their details
  const useAllShipsDetails = () => {
    const shipsDetails = useMemo(() => {
      return allShips.map(tokenId => {
        const isStaked = stakedShips.includes(tokenId)
        return {
          tokenId,
          isStaked,
          // Note: For performance, we don't fetch all details here
          // Use useShipDetails for individual ship details
        }
      })
    }, [allShips, stakedShips])

    return shipsDetails
  }

  return {
    allShips,
    stakedShips,
    unstakedShips,
    useShipDetails,
    useAllShipsDetails,
  }
}