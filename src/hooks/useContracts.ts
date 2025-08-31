import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESSES } from '../lib/config'
import { FUEL_ABI, SHIP_ABI, GEM_ABI, GAME_ABI } from '../lib/contractAbis'
import { parseEther, formatEther } from 'viem'
import toast from 'react-hot-toast'
import { GemType } from '../types'
import type { UserStatus } from '../types'

export function useContracts() {
  const { address } = useAccount()

  // ========== FUEL TOKEN HOOKS ==========
  const useFuelBalance = () => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.FUEL_TOKEN,
      abi: FUEL_ABI,
      functionName: 'balanceOf',
      args: address ? [address] : undefined,
    })
  }

  const useFuelAllowance = (spender: `0x${string}`) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.FUEL_TOKEN,
      abi: FUEL_ABI,
      functionName: 'allowance',
      args: address && spender ? [address, spender] : undefined,
    })
  }

  const useApproveFuel = () => {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    const approve = async (amount: bigint) => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.FUEL_TOKEN,
          abi: FUEL_ABI,
          functionName: 'approve',
          args: [CONTRACT_ADDRESSES.GAME_CONTROLLER, amount],
        })
        toast.success('FUEL approval successful!')
      } catch (error: any) {
        toast.error(error.message || 'Approval failed')
      }
    }

    return { approve, isPending: isPending || isConfirming, isSuccess }
  }

  // ========== SHIP NFT HOOKS ==========
  const useShipBalance = () => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.SHIP_NFT,
      abi: SHIP_ABI,
      functionName: 'balanceOf',
      args: address ? [address] : undefined,
    })
  }

  const useMintPrice = () => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.SHIP_NFT,
      abi: SHIP_ABI,
      functionName: 'PRICE',
    })
  }

  const useTokensOfOwner = () => {
    const result = useReadContract({
      address: CONTRACT_ADDRESSES.SHIP_NFT,
      abi: SHIP_ABI,
      functionName: 'tokensOfOwner',
      args: address ? [address] : undefined,
    })
    
    console.log('useTokensOfOwner:', {
      address,
      contractAddress: CONTRACT_ADDRESSES.SHIP_NFT,
      data: result.data,
      error: result.error,
      isLoading: result.isLoading
    })
    
    return result
  }

  const useShipApproval = (tokenId: bigint) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.SHIP_NFT,
      abi: SHIP_ABI,
      functionName: 'getApproved',
      args: [tokenId],
    })
  }

  const useIsApprovedForAll = () => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.SHIP_NFT,
      abi: SHIP_ABI,
      functionName: 'isApprovedForAll',
      args: address ? [address, CONTRACT_ADDRESSES.GAME_CONTROLLER] : undefined,
    })
  }

  const useMintShip = () => {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
    const { data: price } = useMintPrice()

    const mint = async (quantity: bigint) => {
      try {
        const totalPrice = price ? price * quantity : parseEther('0.01') * quantity
        console.log('Mint details:', {
          contractAddress: CONTRACT_ADDRESSES.SHIP_NFT,
          quantity: quantity.toString(),
          price: price?.toString(),
          totalPrice: totalPrice.toString(),
          priceInEther: formatEther(totalPrice)
        })
        
        await writeContract({
          address: CONTRACT_ADDRESSES.SHIP_NFT,
          abi: SHIP_ABI,
          functionName: 'mint',
          args: [quantity],
          value: totalPrice,
        })
      } catch (error: any) {
        console.error('Contract write error:', error)
        throw error
      }
    }

    return { mint, isPending: isPending || isConfirming, isSuccess }
  }

  const useApproveShips = () => {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    const approveAll = async () => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.SHIP_NFT,
          abi: SHIP_ABI,
          functionName: 'setApprovalForAll',
          args: [CONTRACT_ADDRESSES.GAME_CONTROLLER, true],
        })
        toast.success('Ships approved for staking!')
      } catch (error: any) {
        toast.error(error.message || 'Approval failed')
      }
    }

    return { approveAll, isPending: isPending || isConfirming, isSuccess }
  }

  // ========== GEM NFT HOOKS ==========
  const useGemBalances = () => {
    const sapphire = useReadContract({
      address: CONTRACT_ADDRESSES.GEM_NFT,
      abi: GEM_ABI,
      functionName: 'balanceOf',
      args: address ? [address, BigInt(GemType.SAPPHIRE)] : undefined,
    })

    const sunstone = useReadContract({
      address: CONTRACT_ADDRESSES.GEM_NFT,
      abi: GEM_ABI,
      functionName: 'balanceOf',
      args: address ? [address, BigInt(GemType.SUNSTONE)] : undefined,
    })

    const lithium = useReadContract({
      address: CONTRACT_ADDRESSES.GEM_NFT,
      abi: GEM_ABI,
      functionName: 'balanceOf',
      args: address ? [address, BigInt(GemType.LITHIUM)] : undefined,
    })

    return { sapphire, sunstone, lithium }
  }

  const useIsApprovedForAllGems = () => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.GEM_NFT,
      abi: GEM_ABI,
      functionName: 'isApprovedForAll',
      args: address ? [address, CONTRACT_ADDRESSES.GAME_CONTROLLER] : undefined,
    })
  }

  const useApproveGems = () => {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    const approveAll = async () => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.GEM_NFT,
          abi: GEM_ABI,
          functionName: 'setApprovalForAll',
          args: [CONTRACT_ADDRESSES.GAME_CONTROLLER, true],
        })
        toast.success('Gems approved for upgrades!')
      } catch (error: any) {
        toast.error(error.message || 'Approval failed')
      }
    }

    return { approveAll, isPending: isPending || isConfirming, isSuccess }
  }

  // ========== GAME CONTROLLER HOOKS ==========
  const useUserShipStatus = () => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
      abi: GAME_ABI,
      functionName: 'getAllNFTsStatus',
      args: address ? [address] : undefined,
    }) as { data: UserStatus | undefined }
  }

  const useShipLevel = (tokenId: bigint | undefined) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
      abi: GAME_ABI,
      functionName: 'levelOf',
      args: tokenId ? [tokenId] : undefined,
    })
  }

  const useShipImageId = (tokenId: bigint | undefined) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
      abi: GAME_ABI,
      functionName: 'getTokenImageId',
      args: tokenId ? [tokenId] : undefined,
    })
  }

  const usePendingReward = (tokenId: bigint | undefined) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
      abi: GAME_ABI,
      functionName: 'pendingReward',
      args: tokenId ? [tokenId] : undefined,
    })
  }

  const useTotalPendingReward = () => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
      abi: GAME_ABI,
      functionName: 'getTotalPendingReward',
      args: address ? [address] : undefined,
    })
  }

  const useUpgradeCost = (currentLevel: number) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
      abi: GAME_ABI,
      functionName: 'upgradeCostForNext',
      args: [currentLevel],
    })
  }

  const useGemPrices = () => {
    const sapphire = useReadContract({
      address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
      abi: GAME_ABI,
      functionName: 'GEM1_PRICE',
    })

    const sunstone = useReadContract({
      address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
      abi: GAME_ABI,
      functionName: 'GEM2_PRICE',
    })

    const lithium = useReadContract({
      address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
      abi: GAME_ABI,
      functionName: 'GEM3_PRICE',
    })

    return { sapphire, sunstone, lithium }
  }

  // Write operations for Game Controller
  const useStakeShips = () => {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    const stake = async (tokenId: bigint) => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
          abi: GAME_ABI,
          functionName: 'stake',
          args: [tokenId],
        })
        toast.success('Ship staked successfully!')
      } catch (error: any) {
        toast.error(error.message || 'Staking failed')
      }
    }

    const stakeBatch = async (tokenIds: bigint[]) => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
          abi: GAME_ABI,
          functionName: 'stakeBatch',
          args: [tokenIds],
        })
        toast.success(`${tokenIds.length} ships staked!`)
      } catch (error: any) {
        toast.error(error.message || 'Batch staking failed')
      }
    }

    return { stake, stakeBatch, isPending: isPending || isConfirming, isSuccess }
  }

  const useUnstakeShips = () => {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    const unstake = async (tokenId: bigint) => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
          abi: GAME_ABI,
          functionName: 'unstake',
          args: [tokenId],
        })
        toast.success('Ship unstaked successfully!')
      } catch (error: any) {
        toast.error(error.message || 'Unstaking failed')
      }
    }

    const unstakeBatch = async (tokenIds: bigint[]) => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
          abi: GAME_ABI,
          functionName: 'unstakeBatch',
          args: [tokenIds],
        })
        toast.success(`${tokenIds.length} ships unstaked!`)
      } catch (error: any) {
        toast.error(error.message || 'Batch unstaking failed')
      }
    }

    return { unstake, unstakeBatch, isPending: isPending || isConfirming, isSuccess }
  }

  const useClaimRewards = () => {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    const claim = async (tokenId: bigint) => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
          abi: GAME_ABI,
          functionName: 'claim',
          args: [tokenId],
        })
        toast.success('Rewards claimed!')
      } catch (error: any) {
        toast.error(error.message || 'Claim failed')
      }
    }

    const claimBatch = async (tokenIds: bigint[]) => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
          abi: GAME_ABI,
          functionName: 'claimBatch',
          args: [tokenIds],
        })
        toast.success('All rewards claimed!')
      } catch (error: any) {
        toast.error(error.message || 'Batch claim failed')
      }
    }

    const claimAll = async () => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
          abi: GAME_ABI,
          functionName: 'claimAllStakedRewards',
        })
        toast.success('All staked rewards claimed!')
      } catch (error: any) {
        toast.error(error.message || 'Claim all failed')
      }
    }

    return { claim, claimBatch, claimAll, isPending: isPending || isConfirming, isSuccess }
  }

  const useBuyGems = () => {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    const buyGems = async (gemId: number, amount: bigint) => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
          abi: GAME_ABI,
          functionName: 'buyGems',
          args: [BigInt(gemId), amount],
        })
        const gemName = gemId === 1 ? 'Sapphire' : gemId === 2 ? 'Sunstone' : 'Lithium'
        toast.success(`${amount} ${gemName}(s) purchased!`)
      } catch (error: any) {
        toast.error(error.message || 'Gem purchase failed')
      }
    }

    return { buyGems, isPending: isPending || isConfirming, isSuccess }
  }

  const useUpgradeShip = () => {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    const upgrade = async (tokenId: bigint) => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
          abi: GAME_ABI,
          functionName: 'upgradeOneLevel',
          args: [tokenId],
        })
        toast.success('Ship upgraded!')
      } catch (error: any) {
        toast.error(error.message || 'Upgrade failed')
      }
    }

    return { upgrade, isPending: isPending || isConfirming, isSuccess }
  }

  return {
    // FUEL Token
    useFuelBalance,
    useFuelAllowance,
    useApproveFuel,
    
    // Ship NFT
    useShipBalance,
    useMintPrice,
    useTokensOfOwner,
    useShipApproval,
    useIsApprovedForAll,
    useMintShip,
    useApproveShips,
    
    // Gem NFT
    useGemBalances,
    useIsApprovedForAllGems,
    useApproveGems,
    
    // Game Controller - Read
    useUserShipStatus,
    useShipLevel,
    useShipImageId,
    usePendingReward,
    useTotalPendingReward,
    useUpgradeCost,
    useGemPrices,
    
    // Game Controller - Write
    useStakeShips,
    useUnstakeShips,
    useClaimRewards,
    useBuyGems,
    useUpgradeShip,
  }
}