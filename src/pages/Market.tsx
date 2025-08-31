import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useGems } from '../hooks/useGems'
import { useContracts } from '../hooks/useContracts'
import { formatEther } from 'viem'
import toast from 'react-hot-toast'
import { GemType } from '../types'
import { CONTRACT_ADDRESSES } from '../lib/config'

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
          <h2 className="text-2xl font-bold mb-4 text-white">连接钱包以访问市场</h2>
          <p className="text-gray-400">您需要连接钱包才能购买宝石</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 科幻宇宙背景 */}
      <div className="sci-fi-background"></div>
      <div className="spiral-depth"></div>
      <div className="sci-fi-particles">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${8 + Math.random() * 12}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-6 text-white">宝石市场</h1>

        {/* Gem Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {GEMS.map((gem) => (
            <button
              key={gem.id}
              onClick={() => setSelectedGem(gem.id)}
              className={`glass-card p-4 border-2 transition-all hover:scale-102 ${
                selectedGem === gem.id 
                  ? gem.color 
                  : 'border-gray-700/30 hover:border-gray-500/50'
              }`}
            >
              <img 
                src={gem.image} 
                alt={gem.name}
                className="w-12 h-12 mx-auto mb-3 object-contain"
              />
              <h3 className="text-base font-bold mb-1 text-white">{gem.name}</h3>
              <p className="text-xs text-gray-400 mb-1">{gem.symbol}</p>
              <p className="text-xs text-gray-500 mb-3">{gem.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">价格:</span>
                  <span className="text-white font-medium">{pricesFormatted[gem.id.toLowerCase() as keyof typeof pricesFormatted]} FUEL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">您拥有:</span>
                  <span className="font-bold text-green-400">{balances[gem.id.toLowerCase() as keyof typeof balances].toString()}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Purchase Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Purchase Form */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">💎</span>
              <h2 className="text-lg font-bold text-white">购买{selectedGem === 'SAPPHIRE' ? '蓝宝石' : selectedGem === 'SUNSTONE' ? '太阳石' : '锂矿石'}</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">数量</label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all flex items-center justify-center text-xl font-bold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-32 h-12 bg-gray-800 border border-gray-600 rounded-xl text-center text-white font-bold text-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    style={{
                      appearance: 'textfield',
                      MozAppearance: 'textfield'
                    }}
                    min={1}
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-all flex items-center justify-center text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="glass-card p-4 bg-gray-800/30">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-lg">💰</span>
                  <span className="font-bold text-yellow-400">价格明细</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">单价:</span>
                    <span className="text-white font-bold">{pricesFormatted[selectedGemLower]} FUEL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">数量:</span>
                    <span className="text-white font-bold">{quantity} 个</span>
                  </div>
                  <hr className="border-gray-600" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">总价:</span>
                    <span className="font-bold text-xl" style={{color: '#ff6b35'}}>{formatEther(totalCost)} FUEL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">您的余额:</span>
                    <span className={canAfford[selectedGemLower] ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                      {formatEther(fuelBalance || 0n)} FUEL
                    </span>
                  </div>
                </div>
              </div>

              {/* Approval Status */}
              {!isApprovedForAll && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <p className="text-sm text-yellow-400 mb-2">
                    ⚠️ 升级需要宝石授权
                  </p>
                  <button
                    onClick={approveGems}
                    disabled={isApprovePending}
                    className="w-full py-2 rounded-lg text-sm font-medium bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 transition-all"
                  >
                    {isApprovePending ? '正在授权宝石...' : '授权宝石'}
                  </button>
                </div>
              )}

              <button
                onClick={handleBuy}
                disabled={isBuyPending || isFuelApprovePending || !canAfford[selectedGemLower]}
                className="w-full h-16 rounded-xl text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl"
                style={{
                  background: (isBuyPending || isFuelApprovePending || !canAfford[selectedGemLower]) 
                    ? '#4B5563' 
                    : 'linear-gradient(to right, #ff6b35, #e55527)',
                  boxShadow: (isBuyPending || isFuelApprovePending || !canAfford[selectedGemLower]) 
                    ? 'none' 
                    : '0 25px 50px -12px rgba(255, 107, 53, 0.25)',
                  cursor: (isBuyPending || isFuelApprovePending || !canAfford[selectedGemLower]) 
                    ? 'not-allowed' 
                    : 'pointer'
                }}
              >
                <span className="text-2xl">💎</span>
                <span>
                  {isFuelApprovePending 
                    ? '正在授权 FUEL...' 
                    : isBuyPending 
                    ? '正在购买...' 
                    : !canAfford[selectedGemLower]
                    ? 'FUEL余额不足'
                    : `购买 ${quantity} 个${selectedGem === 'SAPPHIRE' ? '蓝宝石' : selectedGem === 'SUNSTONE' ? '太阳石' : '锂矿石'}`
                  }
                </span>
                <span className="text-2xl">⚡</span>
              </button>
            </div>
          </div>

          {/* Right: Info */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">📚</span>
              <h2 className="text-lg font-bold text-white">宝石使用指南</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 text-cyan-400">如何使用宝石</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold min-w-[16px]">1.</span>
                    <span>使用 FUEL 代币购买宝石</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold min-w-[16px]">2.</span>
                    <span>在控制面板中找到您的战舰</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold min-w-[16px]">3.</span>
                    <span>在未质押的战舰上点击"升级"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold min-w-[16px]">4.</span>
                    <span>确认交易以完成升级</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 text-cyan-400">升级需求</h3>
                <div className="glass-card p-4 bg-gray-800/30">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">等级 1 → 2:</span>
                      <span className="text-white">3蓝 + 2太阳 + 1锂</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">等级 2 → 3:</span>
                      <span className="text-white">5蓝 + 3太阳 + 2锂</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">等级 3 → 4:</span>
                      <span className="text-white">8蓝 + 5太阳 + 3锂</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">等级 4 → 5:</span>
                      <span className="text-white">12蓝 + 8太阳 + 5锂</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-400">💡</span>
                  <span className="text-sm font-medium text-blue-400">提示</span>
                </div>
                <p className="text-sm text-blue-300">
                  等级越高的战舰可以赚取更多的 FUEL 奖励！建议优先升级常用的战舰。
                </p>
              </div>

              {/* 当前FUEL余额显示 */}
              <div className="glass-card p-4 bg-green-500/10 border border-green-500/20">
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">当前 FUEL 余额</div>
                  <div className="text-green-400 font-bold text-xl">
                    {fuelBalance ? formatEther(fuelBalance as bigint) : '0.00'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}