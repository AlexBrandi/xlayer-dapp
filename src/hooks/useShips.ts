import { useAccount, useReadContract, useBlockNumber } from 'wagmi'
import { CONTRACT_ADDRESSES } from '../lib/config'
import { SHIP_ABI, CONTROLLER_ABI } from '../lib/abis'
import { ShipInfo } from '../types'
import { useEffect, useState } from 'react'

const BLOCKS_PER_HOUR = 3600 / 3 // Assuming 3 second blocks
const REWARD_PER_HOUR_BASE = BigInt(100) * BigInt(10 ** 18) // 100 tokens per hour base

export function useShips() {
  const { address } = useAccount()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const [ships, setShips] = useState<ShipInfo[]>([])

  // Get ship balance
  const { data: shipBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.SHIP_NFT,
    abi: SHIP_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  // Get token IDs
  const tokenIds = Array.from({ length: Number(shipBalance || 0) }, (_, i) => BigInt(i))

  // Get ship infos for each token
  const shipInfoQueries = tokenIds.map((index) => ({
    address: CONTRACT_ADDRESSES.SHIP_NFT,
    abi: SHIP_ABI,
    functionName: 'tokenOfOwnerByIndex',
    args: address ? [address, index] : undefined,
  }))

  // Fetch all token IDs
  const tokenIdResults = shipInfoQueries.map((query) =>
    useReadContract(query as any)
  )

  // Get ship details for each token ID
  useEffect(() => {
    const fetchShipDetails = async () => {
      if (!address || !shipBalance) return

      const shipPromises = tokenIdResults.map(async (result, index) => {
        if (!result.data) return null

        const tokenId = result.data as bigint
        
        // Mock ship info - replace with actual contract calls
        const shipInfo: ShipInfo = {
          tokenId,
          level: Math.floor(Math.random() * 10) + 1,
          rarity: Math.floor(Math.random() * 4),
          hp: BigInt(1000),
          effectiveHp: BigInt(800),
          durability: BigInt(Math.floor(Math.random() * 100)),
          maxDurability: BigInt(100),
          isVoyaging: Math.random() > 0.5,
          claimableReward: BigInt(Math.floor(Math.random() * 1000)) * BigInt(10 ** 18),
          estimatedReward: BigInt(0),
          lastClaimBlock: blockNumber || BigInt(0),
        }

        // Calculate estimated rewards if voyaging
        if (shipInfo.isVoyaging && blockNumber) {
          const blocksPassed = blockNumber - shipInfo.lastClaimBlock
          const hoursPassed = Number(blocksPassed) / BLOCKS_PER_HOUR
          const multiplier = BigInt(shipInfo.level) * BigInt(shipInfo.rarity + 1)
          shipInfo.estimatedReward = REWARD_PER_HOUR_BASE * multiplier * BigInt(Math.floor(hoursPassed))
        }

        return shipInfo
      })

      const results = await Promise.all(shipPromises)
      setShips(results.filter(Boolean) as ShipInfo[])
    }

    fetchShipDetails()
  }, [address, shipBalance, blockNumber, tokenIdResults.map(r => r.data).join(',')])

  return { ships, isLoading: shipBalance === undefined }
}

export function useShipsPaginated(page: number = 0, pageSize: number = 8) {
  const { ships, isLoading } = useShips()
  
  const totalPages = Math.ceil(ships.length / pageSize)
  const paginatedShips = ships.slice(page * pageSize, (page + 1) * pageSize)
  
  return {
    ships: paginatedShips,
    isLoading,
    totalPages,
    totalShips: ships.length,
  }
}