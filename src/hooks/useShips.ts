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

  // Debug: 检查数据获取是否正常
  console.log('=== useShips Debug ===')
  console.log('userTokens:', userTokens)
  console.log('userImageIds:', userImageIds)
  console.log('userStatus:', userStatus)
  console.log('hasTokens:', !!userTokens)
  console.log('hasImageIds:', !!userImageIds)
  console.log('hasStatus:', !!userStatus)
  if (userStatus) {
    console.log('stakedNFTs:', userStatus.stakedNFTs)
    console.log('unstakedNFTs:', userStatus.unstakedNFTs)
  }

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
      // Debug info hidden
      // console.log('=== useAllShipsDetails Debug ===')
      // console.log('userTokens:', userTokens)
      // console.log('userImageIds:', userImageIds)
      
      // 使用 userStatus.allNFTs 而不是 userTokens，因为质押的飞船不会显示在 userTokens 中
      const allTokens = userStatus?.allNFTs || userTokens
      
      if (!allTokens || allTokens.length === 0) {
        return []
      }
      
      const tokens = allTokens as bigint[]
      
      // If userImageIds is empty/null, we'll use individual calls to get imageIds
      // This is a fallback when tokensOfOwnerImageIds doesn't work
      const result = tokens.map((tokenId, index) => {
        const isStaked = stakedShips.includes(tokenId)
        const level = 1
        
        // Fallback: if userImageIds is empty or undefined, default to imageId based on tokenId
        // This is temporary - we should use individual getTokenImageId calls
        let imageId = 0
        if (userImageIds && userImageIds.length > index) {
          imageId = (userImageIds as number[])[index]
        } else {
          // Fallback: use a simple mapping based on tokenId for now
          // This maintains some variety until we fix the actual issue
          const tokenNum = Number(tokenId)
          if (tokenNum <= 20) {
            imageId = (tokenNum - 1) % 15  // Distribute among 0-14 for first 20 ships
          } else {
            imageId = (tokenNum - 1787) % 15  // Distribute for ships 1787+
          }
        }
        
        const ship = {
          tokenId,
          imageId,
          isStaked,
          level,
        }
        // Debug info hidden
        // if (index < 3) {
        //   console.log(`Ship ${index}:`, ship)
        // }
        return ship
      })
      
      // Debug info hidden
      // console.log('Generated shipsDetails length:', result.length)
      // console.log('Using fallback imageId mapping:', !userImageIds || userImageIds.length === 0)
      return result
    }, [userTokens, userImageIds, stakedShips, userStatus])

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