import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESSES } from '../lib/config'
import { FUEL_ABI, SHIP_ABI, CONTROLLER_ABI } from '../lib/abis'
import toast from 'react-hot-toast'

export function useContracts() {
  const { address } = useAccount()

  // Read hooks
  const useFuelBalance = () => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.FUEL_TOKEN,
      abi: FUEL_ABI,
      functionName: 'balanceOf',
      args: address ? [address] : undefined,
    })
  }

  const useShipBalance = () => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.SHIP_NFT,
      abi: SHIP_ABI,
      functionName: 'balanceOf',
      args: address ? [address] : undefined,
    })
  }

  const useShipInfo = (tokenId: bigint | undefined) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.SHIP_NFT,
      abi: SHIP_ABI,
      functionName: 'getShipInfo',
      args: tokenId ? [tokenId] : undefined,
    })
  }

  const useTotalClaimableRewards = () => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.REWARD_CONTROLLER,
      abi: CONTROLLER_ABI,
      functionName: 'getTotalClaimableRewards',
      args: address ? [address] : undefined,
    })
  }

  // Write hooks with toast notifications
  const useMintShip = () => {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    const mint = async (quantity: bigint) => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.SHIP_NFT,
          abi: SHIP_ABI,
          functionName: 'mint',
          args: [quantity],
        })
      } catch (error: any) {
        toast.error(error.message || 'Mint failed')
      }
    }

    return { mint, isPending: isPending || isConfirming, isSuccess }
  }

  const useStartVoyage = () => {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

    const startVoyage = async (tokenId: bigint) => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.SHIP_NFT,
          abi: SHIP_ABI,
          functionName: 'startVoyage',
          args: [tokenId],
        })
        toast.success('Voyage started!')
      } catch (error: any) {
        toast.error(error.message || 'Start voyage failed')
      }
    }

    return { startVoyage, isPending: isPending || isConfirming }
  }

  const useStopVoyage = () => {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

    const stopVoyage = async (tokenId: bigint) => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.SHIP_NFT,
          abi: SHIP_ABI,
          functionName: 'stopVoyage',
          args: [tokenId],
        })
        toast.success('Voyage stopped!')
      } catch (error: any) {
        toast.error(error.message || 'Stop voyage failed')
      }
    }

    return { stopVoyage, isPending: isPending || isConfirming }
  }

  const useClaimReward = () => {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

    const claim = async (tokenId: bigint) => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.REWARD_CONTROLLER,
          abi: CONTROLLER_ABI,
          functionName: 'claim',
          args: [tokenId],
        })
        toast.success('Rewards claimed!')
      } catch (error: any) {
        toast.error(error.message || 'Claim failed')
      }
    }

    return { claim, isPending: isPending || isConfirming }
  }

  const useClaimBatch = () => {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

    const claimBatch = async (tokenIds: bigint[]) => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.REWARD_CONTROLLER,
          abi: CONTROLLER_ABI,
          functionName: 'claimBatch',
          args: [tokenIds],
        })
        toast.success('All rewards claimed!')
      } catch (error: any) {
        toast.error(error.message || 'Batch claim failed')
      }
    }

    return { claimBatch, isPending: isPending || isConfirming }
  }

  const useUpgradeShip = () => {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

    const upgrade = async (tokenId: bigint) => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.SHIP_NFT,
          abi: SHIP_ABI,
          functionName: 'upgrade',
          args: [tokenId],
        })
        toast.success('Ship upgraded!')
      } catch (error: any) {
        toast.error(error.message || 'Upgrade failed')
      }
    }

    return { upgrade, isPending: isPending || isConfirming }
  }

  const useRepairShip = () => {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

    const repair = async (tokenId: bigint) => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.SHIP_NFT,
          abi: SHIP_ABI,
          functionName: 'repair',
          args: [tokenId],
        })
        toast.success('Ship repaired!')
      } catch (error: any) {
        toast.error(error.message || 'Repair failed')
      }
    }

    return { repair, isPending: isPending || isConfirming }
  }

  return {
    // Read hooks
    useFuelBalance,
    useShipBalance,
    useShipInfo,
    useTotalClaimableRewards,
    // Write hooks
    useMintShip,
    useStartVoyage,
    useStopVoyage,
    useClaimReward,
    useClaimBatch,
    useUpgradeShip,
    useRepairShip,
  }
}