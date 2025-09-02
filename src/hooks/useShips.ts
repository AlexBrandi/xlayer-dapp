import { useMemo } from 'react'
import { useContracts } from './useContracts'
import type { ShipInfo } from '../types'

export function useShips() {
  const { 
    useTokensOfOwner, 
    useTokensOfOwnerImageIds,
    useUserShipStatus, 
    useShipLevel, 
    useShipImageId, 
    usePendingReward 
  } = useContracts()

  const { data: userTokens } = useTokensOfOwner()
  const { data: userImageIds } = useTokensOfOwnerImageIds()
  const { data: userStatus } = useUserShipStatus()

  // 调试信息
  console.log('useShips Debug:', {
    userTokens,
    userImageIds,
    userStatus,
    hasTokens: !!userTokens,
    hasImageIds: !!userImageIds,
    hasStatus: !!userStatus
  })

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
      if (!userTokens || !userImageIds) return []
      
      const tokens = userTokens as bigint[]
      const imageIds = userImageIds as number[]
      
      return tokens.map((tokenId, index) => {
        const isStaked = stakedShips.includes(tokenId)
        return {
          tokenId,
          imageId: imageIds[index] || 0,
          isStaked,
        }
      })
    }, [userTokens, userImageIds, stakedShips])

    return shipsDetails
  }

  return {
    allShips,
    stakedShips,
    unstakedShips,
    userImageIds: userImageIds as number[] | undefined,
    useShipDetails,
    useAllShipsDetails,
  }
}