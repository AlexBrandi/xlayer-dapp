import { useShips } from '../hooks/useShips'
import { useRewards } from '../hooks/useRewards'
import { useContracts } from '../hooks/useContracts'
import { useUpgrade } from '../contexts/UpgradeContext'
import { ShipLevel } from '../types'

interface ShipCardProps {
  tokenId: bigint
  imageId?: number
}

// Map image IDs to ship names (for display purposes)
const SHIP_NAMES: Record<number, string> = {
  0: 'Abel',
  1: 'Adventurer',
  2: 'Chenoa',
  3: 'Capech',
  4: 'Cavendi',
  5: 'Hobbs',
  6: 'Gabriel',
  7: 'Campbell',
  8: 'Terror',
  9: 'Moore',
  10: 'Dunkirk',
  11: 'Maria',
  12: 'Pearl',
  13: 'Wright',
  14: 'Redel'
}

// Map image IDs to ship rarity (based on existing system)
const SHIP_RARITY: Record<number, { name: string; color: string }> = {
  // Common (0-4)
  0: { name: 'Common', color: 'text-gray-400' },      // Abel
  1: { name: 'Common', color: 'text-gray-400' },      // Adventurer
  2: { name: 'Common', color: 'text-gray-400' },      // Chenoa
  3: { name: 'Common', color: 'text-gray-400' },      // Capech
  4: { name: 'Common', color: 'text-gray-400' },      // Cavendi
  
  // Rare (5-8)
  5: { name: 'Rare', color: 'text-blue-400' },        // Hobbs
  6: { name: 'Rare', color: 'text-blue-400' },        // Gabriel
  7: { name: 'Rare', color: 'text-blue-400' },        // Campbell
  8: { name: 'Rare', color: 'text-blue-400' },        // Terror
  
  // Epic (9-12)
  9: { name: 'Epic', color: 'text-purple-400' },      // Moore
  10: { name: 'Epic', color: 'text-purple-400' },     // Dunkirk
  11: { name: 'Epic', color: 'text-purple-400' },     // Maria
  12: { name: 'Epic', color: 'text-purple-400' },     // Pearl
  
  // Legendary (13-14)
  13: { name: 'Legendary', color: 'text-orange-400' }, // Wright
  14: { name: 'Legendary', color: 'text-orange-400' }  // Redel
}

function getShipImage(imageId: number): string {
  // Use images from public/images directory (1.png to 15.png)
  const imageNumber = (imageId % 15) + 1 // Map 0-14 to 1-15
  return `/images/${imageNumber}.png`
}

export function ShipCard({ tokenId, imageId: providedImageId }: ShipCardProps) {
  const { useShipDetails } = useShips()
  const { useShipPendingReward } = useRewards()
  const { openUpgradeModal } = useUpgrade()
  const { 
    useStakeShips, 
    useUnstakeShips, 
    useClaimRewards, 
    useIsApprovedForAll,
    useApproveShips 
  } = useContracts()
  
  const shipInfo = useShipDetails(tokenId)
  const { pending, pendingFormatted } = useShipPendingReward(tokenId)
  const { data: isApproved } = useIsApprovedForAll()
  
  const { stake, isPending: isStaking } = useStakeShips()
  const { unstake, isPending: isUnstaking } = useUnstakeShips()
  const { claim, isPending: isClaiming } = useClaimRewards()
  const { approveAll, isPending: isApproving } = useApproveShips()

  // Use provided imageId if available, otherwise fall back to shipInfo
  const displayImageId = providedImageId !== undefined ? providedImageId : shipInfo?.imageId

  if (!shipInfo && providedImageId === undefined) {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="h-4 bg-gray-700 rounded mb-4" />
        <div className="h-48 bg-gray-700 rounded mb-4" />
        <div className="h-4 bg-gray-700 rounded" />
      </div>
    )
  }

  const canUpgrade = shipInfo?.level && shipInfo.level < ShipLevel.MAX
  const hasRewards = pending && pending > 0n

  const handleStake = async () => {
    try {
      if (!isApproved) {
        await approveAll()
      }
      await stake(tokenId)
      // Data will be automatically refreshed by hooks
    } catch (error) {
      console.error('Stake error:', error)
    }
  }

  const handleUnstake = async () => {
    try {
      await unstake(tokenId)
      // Data will be automatically refreshed by hooks
    } catch (error) {
      console.error('Unstake error:', error)
    }
  }

  const handleClaim = async () => {
    try {
      await claim(tokenId)
      // Data will be automatically refreshed by hooks
    } catch (error) {
      console.error('Claim error:', error)
    }
  }

  const handleUpgradeClick = () => {
    if (shipInfo?.level) {
      openUpgradeModal(tokenId, shipInfo.level)
    }
  }

  return (
    <div className="glass-card p-4 hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-bold">Ship #{tokenId.toString()}</h3>
          <span className="text-xs font-medium text-gray-400">
            Level {shipInfo?.level || 1}
          </span>
        </div>
        {shipInfo?.isStaked && (
          <span className="flex items-center gap-1 text-green-400 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Staking
          </span>
        )}
      </div>

      {/* Ship Image */}
      <div className="relative mb-3 rounded-lg overflow-hidden bg-gray-800">
        <img 
          src={getShipImage(displayImageId || 0)} 
          alt={`Ship #${tokenId}`}
          className="w-full h-32 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Ship Name & Rarity */}
      <div className="mb-3 text-center">
        <p className="text-sm font-medium text-white">{SHIP_NAMES[displayImageId || 0] || 'Unknown Ship'}</p>
        <p className={`text-xs font-semibold ${SHIP_RARITY[displayImageId || 0]?.color || 'text-gray-400'}`}>
          {SHIP_RARITY[displayImageId || 0]?.name || 'Common'}
        </p>
      </div>

      {/* Rewards */}
      {hasRewards && (
        <div className="mb-3 p-2 bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Pending Rewards</p>
          <p className="text-sm text-green-400 font-bold">
            {pendingFormatted} FUEL
          </p>
        </div>
      )}


      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {!shipInfo?.isStaked ? (
          <>
            <button
              onClick={handleStake}
              disabled={isStaking || isApproving}
              className="btn-primary text-xs py-2"
            >
              {isApproving ? 'Approving...' : isStaking ? 'Staking...' : 'Stake Ship'}
            </button>
            <button
              disabled
              className="btn-secondary text-xs py-2 opacity-50 cursor-not-allowed"
            >
              Not Staked
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleUnstake}
              disabled={isUnstaking}
              className="btn-secondary text-xs py-2"
            >
              {isUnstaking ? 'Unstaking...' : 'Unstake'}
            </button>
            {hasRewards && (
              <button
                onClick={handleClaim}
                disabled={isClaiming}
                className="btn-primary text-xs py-2 bg-green-600 hover:bg-green-700"
              >
                {isClaiming ? 'Claiming...' : 'Claim'}
              </button>
            )}
          </>
        )}

        {canUpgrade && (
          <button
            onClick={handleUpgradeClick}
            className="btn-secondary text-xs py-2 col-span-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
          >
            Upgrade to Level {(shipInfo?.level || 1) + 1}
          </button>
        )}
      </div>
    </div>
  )
}