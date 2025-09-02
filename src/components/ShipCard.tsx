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
  0: '亚伯号',
  1: '冒险者号',
  2: '切诺亚号',
  3: '卡佩奇号',
  4: '卡文迪号',
  5: '哈布斯号',
  6: '嘉百列号',
  7: '坎贝尔号',
  8: '惊恐号',
  9: '摩尔号',
  10: '敦刻尔克号',
  11: '玛丽亚号',
  12: '珍珠号',
  13: '莱特号',
  14: '雷德尔号'
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
            质押中
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

      {/* Ship Name */}
      <div className="mb-3 text-center">
        <p className="text-xs text-gray-400">{SHIP_NAMES[displayImageId || 0] || 'Unknown Ship'}</p>
      </div>

      {/* Rewards */}
      {hasRewards && (
        <div className="mb-3 p-2 bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">待领取奖励</p>
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
              {isApproving ? '正在授权...' : isStaking ? '正在质押...' : '质押战舰'}
            </button>
            <button
              disabled
              className="btn-secondary text-xs py-2 opacity-50 cursor-not-allowed"
            >
              未质押
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleUnstake}
              disabled={isUnstaking}
              className="btn-secondary text-xs py-2"
            >
              {isUnstaking ? '正在取消质押...' : '取消质押'}
            </button>
            {hasRewards && (
              <button
                onClick={handleClaim}
                disabled={isClaiming}
                className="btn-primary text-xs py-2 bg-green-600 hover:bg-green-700"
              >
                {isClaiming ? '正在领取...' : '领取'}
              </button>
            )}
          </>
        )}

        {canUpgrade && (
          <button
            onClick={handleUpgradeClick}
            className="btn-secondary text-xs py-2 col-span-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
          >
            升级到等级 {(shipInfo?.level || 1) + 1}
          </button>
        )}
      </div>
    </div>
  )
}