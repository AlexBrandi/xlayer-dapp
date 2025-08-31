import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useGems } from '../hooks/useGems'
import { useContracts } from '../hooks/useContracts'
import { formatEther } from 'viem'
import toast from 'react-hot-toast'
import { GemType } from '../types'

interface GemCard {
  id: keyof typeof GemType
  name: string
  symbol: string
  color: string
  description: string
  image: string
}

const GEMS: GemCard[] = [
  {
    id: 'SAPPHIRE',
    name: '蓝宝石',
    symbol: '蓝宝石',
    color: 'border-blue-500 bg-blue-500/10',
    description: '用于战舰升级的稀有蓝色宝石',
    image: '/images/sapphire.png'
  },
  {
    id: 'SUNSTONE',
    name: '太阳石',
    symbol: '太阳石',
    color: 'border-orange-500 bg-orange-500/10',
    description: '为战舰系统提供动力的光辉宝石',
    image: '/images/sunstone.png'
  },
  {
    id: 'LITHIUM',
    name: '锂矿石',
    symbol: '锂矿石',
    color: 'border-purple-500 bg-purple-500/10',
    description: '用于高级升级的必需矿物',
    image: '/images/lithium.png'
  }
]

export function Market() {
  const { isConnected } = useAccount()
  const [selectedGem, setSelectedGem] = useState<keyof typeof GemType>('SAPPHIRE')
  const [quantity, setQuantity] = useState(1)
  
  const { 
    balances, 
    prices, 
    pricesFormatted, 
    canAfford, 
    purchaseGems, 
    isBuyPending,
    isApprovedForAll,
    approveGems,
    isApprovePending
  } = useGems()
  
  const { useFuelBalance, useFuelAllowance, useApproveFuel } = useContracts()
  const { data: fuelBalance } = useFuelBalance()
  const { data: fuelAllowance } = useFuelAllowance(CONTRACT_ADDRESSES.GAME_CONTROLLER)
  const { approve: approveFuel, isPending: isFuelApprovePending } = useApproveFuel()

  const selectedGemLower = selectedGem.toLowerCase() as 'sapphire' | 'sunstone' | 'lithium'
  const totalCost = prices[selectedGemLower] * BigInt(quantity)
  const needsFuelApproval = fuelAllowance ? fuelAllowance < totalCost : true

  const handleBuy = async () => {
    if (!canAfford[selectedGemLower]) {
      toast.error('FUEL 余额不足')
      return
    }

    if (needsFuelApproval) {
      await approveFuel(totalCost * 2n) // Approve 2x for future purchases
    }

    await purchaseGems(selectedGem, quantity)
    setQuantity(1)
  }

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">连接钱包以访问市场</h2>
          <p className="text-gray-400">您需要连接钱包才能购买宝石</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold mb-6">宝石市场</h1>

      {/* Gem Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {GEMS.map((gem) => (
          <button
            key={gem.id}
            onClick={() => setSelectedGem(gem.id)}
            className={`glass-card p-4 border-2 transition-all ${
              selectedGem === gem.id 
                ? gem.color 
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <img 
              src={gem.image} 
              alt={gem.name}
              className="w-12 h-12 mx-auto mb-3 object-contain"
            />
            <h3 className="text-base font-bold mb-1">{gem.name}</h3>
            <p className="text-xs text-gray-400 mb-1">{gem.symbol}</p>
            <p className="text-xs text-gray-500 mb-3">{gem.description}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">价格：</span>
                <span>{pricesFormatted[gem.id.toLowerCase() as keyof typeof pricesFormatted]} FUEL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">您拥有：</span>
                <span className="font-bold">{balances[gem.id.toLowerCase() as keyof typeof balances].toString()}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Purchase Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Purchase Form */}
        <div className="glass-card p-4">
          <h2 className="text-lg font-bold mb-3">购买{selectedGem === 'SAPPHIRE' ? '蓝宝石' : selectedGem === 'SUNSTONE' ? '太阳石' : '锂矿石'}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">数量</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="btn-secondary w-12 h-12"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-center"
                  min={1}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="btn-secondary w-12 h-12"
                >
                  +
                </button>
              </div>
            </div>

            <div className="glass-card p-4 bg-gray-800/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">总价格：</span>
                <span className="text-xl font-bold">{formatEther(totalCost)} FUEL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">您的余额：</span>
                <span className={canAfford[selectedGemLower] ? 'text-green-400' : 'text-red-400'}>
                  {formatEther(fuelBalance || 0n)} FUEL
                </span>
              </div>
            </div>

            {/* Approval Status */}
            {!isApprovedForAll && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                <p className="text-sm text-yellow-400">
                  ⚠️ 升级需要宝石授权
                </p>
                <button
                  onClick={approveGems}
                  disabled={isApprovePending}
                  className="mt-2 btn-secondary text-sm w-full"
                >
                  {isApprovePending ? '正在授权宝石...' : '授权宝石'}
                </button>
              </div>
            )}

            <button
              onClick={handleBuy}
              disabled={isBuyPending || isFuelApprovePending || !canAfford[selectedGemLower]}
              className="w-full btn-primary"
            >
              {isFuelApprovePending 
                ? '正在授权 FUEL...' 
                : isBuyPending 
                ? '正在购买...' 
                : `购买 ${quantity} 个${selectedGem === 'SAPPHIRE' ? '蓝宝石' : selectedGem === 'SUNSTONE' ? '太阳石' : '锂矿石'}`
              }
            </button>
          </div>
        </div>

        {/* Right: Info */}
        <div className="glass-card p-4">
          <h2 className="text-lg font-bold mb-3">宝石使用指南</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">如何使用宝石</h3>
              <ol className="list-decimal list-inside space-y-1 text-xs text-gray-400">
                <li>使用 FUEL 代币购买宝石</li>
                <li>在控制面板中找到您的战舰</li>
                <li>在未质押的战舰上点击“升级”</li>
                <li>确认交易以完成升级</li>
              </ol>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">升级需求</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">等级 1 → 2：</span>
                  <span>3 蓝宝石 + 2 太阳石 + 1 锂矿石</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">等级 2 → 3：</span>
                  <span>5 蓝宝石 + 3 太阳石 + 2 锂矿石</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">等级 3 → 4：</span>
                  <span>8 蓝宝石 + 5 太阳石 + 3 锂矿石</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">等级 4 → 5：</span>
                  <span>12 蓝宝石 + 8 太阳石 + 5 锂矿石</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-500/10 border border-blue-500/50 rounded-lg">
              <p className="text-sm text-blue-400">
                💡 提示：等级越高的战舰可以赚取更多的 FUEL 奖励！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Import CONTRACT_ADDRESSES for FUEL approval
import { CONTRACT_ADDRESSES } from '../lib/config'