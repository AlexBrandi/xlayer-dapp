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

  // Debug info hidden
  // console.log('useShips Debug:', {
  //   userTokens,
  //   userImageIds,
  //   userStatus,
  //   stakedShips: userStatus?.stakedNFTs,
  //   unstakedShips: userStatus?.unstakedNFTs,
  //   hasTokens: !!userTokens,
  //   hasImageIds: !!userImageIds,
  //   hasStatus: !!userStatus
  // })

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
      
      // console.log('Computing ship details:', {
      //   tokens: tokens.map(t => t.toString()),
      //   stakedShips: stakedShips.map(t => t.toString()),
      //   imageIds
      // })
      
      return tokens.map((tokenId, index) => {
        const isStaked = stakedShips.includes(tokenId)
        // For now, default level to 1. We can improve this later.
        const level = 1
        // console.log(`Ship ${tokenId.toString()}: isStaked=${isStaked}`)
        return {
          tokenId,
          imageId: imageIds[index] || 0,
          isStaked,
          level,
        }
      })
    }, [userTokens, userImageIds, stakedShips])

    return shipsDetails
  }

  // Total fleet count including staked ships
  const totalFleetCount = useMemo(() => {
    if (!userStatus?.allNFTs) return 0
    return userStatus.allNFTs.length
  }, [userStatus])

  return {
    allShips,
    stakedShips,
    unstakedShips,
    totalFleetCount,
    userImageIds: userImageIds as number[] | undefined,
    useShipDetails,
    useAllShipsDetails,
  }
}