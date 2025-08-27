import { ShipInfo } from '../types'
import { formatTokenAmount, formatPercentage, RARITY_NAMES, RARITY_COLORS, getShipImage } from '../lib/format'
import { useContracts } from '../hooks/useContracts'
import { Stat } from './Stat'

interface ShipCardProps {
  ship: ShipInfo
  onRefresh?: () => void
}

export function ShipCard({ ship, onRefresh }: ShipCardProps) {
  const { useStartVoyage, useStopVoyage, useClaimReward, useUpgradeShip, useRepairShip } = useContracts()
  
  const { startVoyage, isPending: isStarting } = useStartVoyage()
  const { stopVoyage, isPending: isStopping } = useStopVoyage()
  const { claim, isPending: isClaiming } = useClaimReward()
  const { upgrade, isPending: isUpgrading } = useUpgradeShip()
  const { repair, isPending: isRepairing } = useRepairShip()

  const durabilityPercent = formatPercentage(Number(ship.durability), Number(ship.maxDurability))
  const hasLowDurability = durabilityPercent < 30
  const canClaim = (ship.claimableReward || BigInt(0)) > BigInt(0)

  const handleStartVoyage = async () => {
    await startVoyage(ship.tokenId)
    onRefresh?.()
  }

  const handleStopVoyage = async () => {
    await stopVoyage(ship.tokenId)
    onRefresh?.()
  }

  const handleClaim = async () => {
    await claim(ship.tokenId)
    onRefresh?.()
  }

  const handleUpgrade = async () => {
    await upgrade(ship.tokenId)
    onRefresh?.()
  }

  const handleRepair = async () => {
    await repair(ship.tokenId)
    onRefresh?.()
  }

  return (
    <div className="glass-card p-6 hover:shadow-lg hover:animate-glow transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">Ship #{ship.tokenId.toString()}</h3>
          <span className={`text-sm font-medium ${RARITY_COLORS[ship.rarity as keyof typeof RARITY_COLORS]}`}>
            {RARITY_NAMES[ship.rarity]} • Level {ship.level}
          </span>
        </div>
        {ship.isVoyaging && (
          <span className="flex items-center gap-1 text-green-400 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Voyaging
          </span>
        )}
      </div>

      {/* Ship Image */}
      <div className="relative mb-4 rounded-xl overflow-hidden bg-gray-800">
        <img 
          src={getShipImage(Number(ship.tokenId))} 
          alt={`Ship #${ship.tokenId}`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Stat label="HP" value={ship.hp.toString()} />
        <Stat label="Effective HP" value={ship.effectiveHp.toString()} />
      </div>

      {/* Durability Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Durability</span>
          <span className={hasLowDurability ? 'text-orange-400' : 'text-gray-300'}>
            {durabilityPercent}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              hasLowDurability ? 'bg-orange-400' : 'bg-blue-400'
            }`}
            style={{ width: `${durabilityPercent}%` }}
          />
        </div>
        {hasLowDurability && (
          <p className="text-xs text-orange-400 mt-1">⚠️ Low durability - repair needed</p>
        )}
      </div>

      {/* Rewards */}
      {(canClaim || ship.isVoyaging) && (
        <div className="mb-4 p-3 bg-gray-800/50 rounded-xl">
          <p className="text-sm text-gray-400 mb-1">Rewards</p>
          {canClaim && (
            <p className="text-green-400 font-bold">
              {formatTokenAmount(ship.claimableReward || BigInt(0))} $FUEL
            </p>
          )}
          {ship.isVoyaging && ship.estimatedReward && ship.estimatedReward > BigInt(0) && (
            <p className="text-yellow-400 text-sm">
              ~{formatTokenAmount(ship.estimatedReward)} $FUEL (estimated)
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {!ship.isVoyaging ? (
          <button
            onClick={handleStartVoyage}
            disabled={isStarting || hasLowDurability}
            className="btn-primary text-sm"
          >
            {isStarting ? 'Starting...' : 'Start Voyage'}
          </button>
        ) : (
          <button
            onClick={handleStopVoyage}
            disabled={isStopping}
            className="btn-secondary text-sm"
          >
            {isStopping ? 'Stopping...' : 'Stop Voyage'}
          </button>
        )}

        {canClaim && (
          <button
            onClick={handleClaim}
            disabled={isClaiming}
            className="btn-primary text-sm bg-green-600 hover:bg-green-700"
          >
            {isClaiming ? 'Claiming...' : 'Claim'}
          </button>
        )}

        <button
          onClick={handleUpgrade}
          disabled={isUpgrading || ship.isVoyaging}
          className="btn-secondary text-sm"
        >
          {isUpgrading ? 'Upgrading...' : 'Upgrade'}
        </button>

        {hasLowDurability && (
          <button
            onClick={handleRepair}
            disabled={isRepairing || ship.isVoyaging}
            className="btn-secondary text-sm bg-orange-600 hover:bg-orange-700"
          >
            {isRepairing ? 'Repairing...' : 'Repair'}
          </button>
        )}
      </div>
    </div>
  )
}