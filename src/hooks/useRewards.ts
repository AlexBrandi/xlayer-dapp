import { useAccount, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESSES } from '../lib/config'
import { CONTROLLER_ABI } from '../lib/abis'
import { useShips } from './useShips'

export function useRewards() {
  const { address } = useAccount()
  const { ships } = useShips()

  // Get total claimable rewards from contract
  const { data: totalClaimable } = useReadContract({
    address: CONTRACT_ADDRESSES.REWARD_CONTROLLER,
    abi: CONTROLLER_ABI,
    functionName: 'getTotalClaimableRewards',
    args: address ? [address] : undefined,
  })

  // Calculate estimated rewards from ships
  const estimatedRewards = ships.reduce((acc, ship) => {
    return acc + (ship.estimatedReward || BigInt(0))
  }, BigInt(0))

  // Get claimable token IDs
  const claimableTokenIds = ships
    .filter(ship => (ship.claimableReward || BigInt(0)) > BigInt(0))
    .map(ship => ship.tokenId)

  return {
    totalClaimable: totalClaimable || BigInt(0),
    estimatedRewards,
    claimableTokenIds,
    hasClaimableRewards: claimableTokenIds.length > 0,
  }
}