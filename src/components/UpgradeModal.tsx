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
  
  // 检查余额是否足够
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
      
      // 检查余额
      if (!hasSufficientFuel) {
        toast.error('FUEL 余额不足')
        return
      }
      
      if (!hasSufficientGems) {
        toast.error('宝石余额不足')
        return
      }

      // 批准 FUEL
      if (needsFuelApproval && tokenCost > 0n) {
        setStep('approving')
        toast.loading('正在批准 FUEL...')
        await approveFuel(tokenCost)
        toast.dismiss()
        toast.success('FUEL 批准成功')
      }

      // 批准宝石
      if (needsGemsApproval) {
        setStep('approving')
        toast.loading('正在批准宝石...')
        await approveGems()
        toast.dismiss()
        toast.success('宝石批准成功')
      }

      // 执行升级
      setStep('upgrading')
      toast.loading('正在升级战舰...')
      await upgrade(tokenId)
      toast.dismiss()
      toast.success(`战舰升级到等级 ${currentLevel + 1}！`)
      
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Upgrade error:', error)
      toast.dismiss()
      toast.error(error.message || '升级失败')
    } finally {
      setIsUpgrading(false)
      setStep('confirm')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="glass-card p-4 max-w-sm w-full">
        <h2 className="text-lg font-bold text-white mb-3 text-center">
          升级战舰
        </h2>

        <div className="mb-4">
          <div className="glass-card p-3 bg-gray-800/50 text-center mb-3">
            <h3 className="text-base font-bold text-white mb-1">
              战舰 #{tokenId.toString()}
            </h3>
            <p className="text-sm text-gray-400">
              等级: <span className="text-cyan-400 font-bold">{currentLevel}</span> → 
              <span className="text-green-400 font-bold">{currentLevel + 1}</span>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs text-gray-400 font-semibold">升级成本：</h4>
            
            {tokenCost > 0n && (
              <div className="flex justify-between items-center glass-card p-2 bg-gray-800/30">
                <span className="text-xs text-gray-300">FUEL</span>
                <div className="text-right">
                  <p className="text-sm text-white font-bold">{formatEther(tokenCost)}</p>
                  <p className={`text-xs ${hasSufficientFuel ? 'text-green-400' : 'text-red-400'}`}>
                    余额: {fuelBalance ? formatEther(fuelBalance) : '0'}
                  </p>
                </div>
              </div>
            )}

            {gem1Cost > 0n && (
              <div className="flex justify-between items-center glass-card p-2 bg-gray-800/30">
                <span className="text-xs text-blue-400">蓝宝石</span>
                <div className="text-right">
                  <p className="text-sm text-white font-bold">{gem1Cost.toString()}</p>
                  <p className={`text-xs ${balances.sapphire >= gem1Cost ? 'text-green-400' : 'text-red-400'}`}>
                    余额: {balances.sapphire.toString()}
                  </p>
                </div>
              </div>
            )}

            {gem2Cost > 0n && (
              <div className="flex justify-between items-center glass-card p-2 bg-gray-800/30">
                <span className="text-xs text-orange-400">太阳石</span>
                <div className="text-right">
                  <p className="text-sm text-white font-bold">{gem2Cost.toString()}</p>
                  <p className={`text-xs ${balances.sunstone >= gem2Cost ? 'text-green-400' : 'text-red-400'}`}>
                    余额: {balances.sunstone.toString()}
                  </p>
                </div>
              </div>
            )}

            {gem3Cost > 0n && (
              <div className="flex justify-between items-center glass-card p-2 bg-gray-800/30">
                <span className="text-xs text-purple-400">锂矿石</span>
                <div className="text-right">
                  <p className="text-sm text-white font-bold">{gem3Cost.toString()}</p>
                  <p className={`text-xs ${balances.lithium >= gem3Cost ? 'text-green-400' : 'text-red-400'}`}>
                    余额: {balances.lithium.toString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {(needsFuelApproval || needsGemsApproval) && (
            <div className="mt-3 p-2 bg-yellow-500/20 rounded-lg">
              <p className="text-xs text-yellow-400">
                ⚠️ 需要批准 {needsFuelApproval ? 'FUEL' : ''} {needsFuelApproval && needsGemsApproval ? '和' : ''} {needsGemsApproval ? '宝石' : ''} 使用权限
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
            取消
          </button>
          <button
            onClick={handleUpgrade}
            disabled={isUpgrading || !hasSufficientFuel || !hasSufficientGems}
            className="flex-1 btn-primary text-sm py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700"
          >
            {isUpgrading ? (
              step === 'approving' ? '批准中...' : '升级中...'
            ) : (
              '确认升级'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}