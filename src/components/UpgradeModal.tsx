import { useState } from 'react'
import { formatEther } from 'viem'
import { useContracts } from '../hooks/useContracts'
import { useGems } from '../hooks/useGems'
import toast from 'react-hot-toast'

interface UpgradeModalProps {
  tokenId: bigint
  currentLevel: number
  onClose: () => void
  onSuccess: () => void
}


export function UpgradeModal({ tokenId, currentLevel, onClose, onSuccess }: UpgradeModalProps) {
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [step, setStep] = useState<'confirm' | 'approving' | 'upgrading'>('confirm')
  
  const { 
    useUpgradeCost, 
    useUpgradeShip,
    useFuelAllowance,
    useIsApprovedForAllGems,
    useApproveFuel,
    useApproveGems,
    useFuelBalance
  } = useContracts()
  
  const { balances } = useGems()
  const { data: upgradeCost } = useUpgradeCost(currentLevel)
  const { data: fuelBalance } = useFuelBalance()
  const { data: fuelAllowance } = useFuelAllowance('0x958253CbAc08F33Fcb672eA8400f384a10fd737C')
  const { data: gemsApproved } = useIsApprovedForAllGems()
  
  const { upgrade } = useUpgradeShip()
  const { approve: approveFuel } = useApproveFuel()
  const { approveAll: approveGems } = useApproveGems()

  if (!upgradeCost) {
    return null
  }

  const [tokenCost, gem1Cost, gem2Cost, gem3Cost] = upgradeCost
  
  // Check if balance is sufficient
  const hasSufficientFuel = fuelBalance && fuelBalance >= tokenCost
  const hasSufficientGems = 
    balances.sapphire >= gem1Cost &&
    balances.sunstone >= gem2Cost &&
    balances.lithium >= gem3Cost

  const needsFuelApproval = !fuelAllowance || fuelAllowance < tokenCost
  const needsGemsApproval = !gemsApproved && (gem1Cost > 0n || gem2Cost > 0n || gem3Cost > 0n)

  const handleUpgrade = async () => {
    try {
      setIsUpgrading(true)
      
      // Check balance
      if (!hasSufficientFuel) {
        toast.error('Insufficient FUEL balance')
        return
      }
      
      if (!hasSufficientGems) {
        toast.error('Insufficient gem balance')
        return
      }

      // Approve FUEL
      if (needsFuelApproval && tokenCost > 0n) {
        setStep('approving')
        toast.loading('Approving FUEL...')
        await approveFuel(tokenCost)
        toast.dismiss()
        toast.success('FUEL approved successfully')
      }

      // Approve gems
      if (needsGemsApproval) {
        setStep('approving')
        toast.loading('Approving gems...')
        await approveGems()
        toast.dismiss()
        toast.success('Gems approved successfully')
      }

      // Execute upgrade
      setStep('upgrading')
      toast.loading('Upgrading ship...')
      await upgrade(tokenId)
      toast.dismiss()
      toast.success(`Ship upgraded to level ${currentLevel + 1}!`)
      
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Upgrade error:', error)
      toast.dismiss()
      toast.error(error.message || 'Upgrade failed')
    } finally {
      setIsUpgrading(false)
      setStep('confirm')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="glass-card p-4 max-w-sm w-full">
        <h2 className="text-lg font-bold text-white mb-3 text-center">
          Upgrade Ship
        </h2>

        <div className="mb-4">
          <div className="glass-card p-3 bg-gray-800/50 text-center mb-3">
            <h3 className="text-base font-bold text-white mb-1">
              Ship #{tokenId.toString()}
            </h3>
            <p className="text-sm text-gray-400">
              Level: <span className="text-cyan-400 font-bold">{currentLevel}</span> → 
              <span className="text-green-400 font-bold">{currentLevel + 1}</span>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs text-gray-400 font-semibold">Upgrade Cost:</h4>
            
            {tokenCost > 0n && (
              <div className="flex justify-between items-center glass-card p-2 bg-gray-800/30">
                <span className="text-xs text-gray-300">FUEL</span>
                <div className="text-right">
                  <p className="text-sm text-white font-bold">{formatEther(tokenCost)}</p>
                  <p className={`text-xs ${hasSufficientFuel ? 'text-green-400' : 'text-red-400'}`}>
                    Balance: {fuelBalance ? formatEther(fuelBalance) : '0'}
                  </p>
                </div>
              </div>
            )}

            {gem1Cost > 0n && (
              <div className="flex justify-between items-center glass-card p-2 bg-gray-800/30">
                <span className="text-xs text-blue-400">Sapphire</span>
                <div className="text-right">
                  <p className="text-sm text-white font-bold">{gem1Cost.toString()}</p>
                  <p className={`text-xs ${balances.sapphire >= gem1Cost ? 'text-green-400' : 'text-red-400'}`}>
                    Balance: {balances.sapphire.toString()}
                  </p>
                </div>
              </div>
            )}

            {gem2Cost > 0n && (
              <div className="flex justify-between items-center glass-card p-2 bg-gray-800/30">
                <span className="text-xs text-orange-400">Sunstone</span>
                <div className="text-right">
                  <p className="text-sm text-white font-bold">{gem2Cost.toString()}</p>
                  <p className={`text-xs ${balances.sunstone >= gem2Cost ? 'text-green-400' : 'text-red-400'}`}>
                    Balance: {balances.sunstone.toString()}
                  </p>
                </div>
              </div>
            )}

            {gem3Cost > 0n && (
              <div className="flex justify-between items-center glass-card p-2 bg-gray-800/30">
                <span className="text-xs text-purple-400">Lithium</span>
                <div className="text-right">
                  <p className="text-sm text-white font-bold">{gem3Cost.toString()}</p>
                  <p className={`text-xs ${balances.lithium >= gem3Cost ? 'text-green-400' : 'text-red-400'}`}>
                    Balance: {balances.lithium.toString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {(needsFuelApproval || needsGemsApproval) && (
            <div className="mt-3 p-2 bg-yellow-500/20 rounded-lg">
              <p className="text-xs text-yellow-400">
                ⚠️ Need approval for {needsFuelApproval ? 'FUEL' : ''} {needsFuelApproval && needsGemsApproval ? 'and' : ''} {needsGemsApproval ? 'gems' : ''} usage permissions
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={isUpgrading}
            className="flex-1 btn-secondary text-sm py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleUpgrade}
            disabled={isUpgrading || !hasSufficientFuel || !hasSufficientGems}
            className="flex-1 btn-primary text-sm py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700"
          >
            {isUpgrading ? (
              step === 'approving' ? 'Approving...' : 'Upgrading...'
            ) : (
              'Confirm Upgrade'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}