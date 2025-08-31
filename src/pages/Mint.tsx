import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useNavigate } from 'react-router-dom'
import { useContracts } from '../hooks/useContracts'
import { formatEther } from 'viem'
import toast from 'react-hot-toast'

const MAX_MINT = 10

// 战舰列表数据
const SHIP_LIST = [
  { id: 0, name: '亚伯号', rarity: '普通', probability: '15%', rarityColor: 'text-gray-400' },
  { id: 1, name: '冒险者号', rarity: '普通', probability: '15%', rarityColor: 'text-gray-400' },
  { id: 2, name: '切诺亚号', rarity: '普通', probability: '15%', rarityColor: 'text-gray-400' },
  { id: 3, name: '卡佩奇号', rarity: '普通', probability: '15%', rarityColor: 'text-gray-400' },
  { id: 4, name: '卡文迪号', rarity: '稀有', probability: '8%', rarityColor: 'text-blue-400' },
  { id: 5, name: '哈布斯号', rarity: '稀有', probability: '8%', rarityColor: 'text-blue-400' },
  { id: 6, name: '嘉百列号', rarity: '稀有', probability: '8%', rarityColor: 'text-blue-400' },
  { id: 7, name: '坎贝尔号', rarity: '稀有', probability: '8%', rarityColor: 'text-blue-400' },
  { id: 8, name: '惊恐号', rarity: '史诗', probability: '4%', rarityColor: 'text-purple-400' },
  { id: 9, name: '摩尔号', rarity: '史诗', probability: '4%', rarityColor: 'text-purple-400' },
  { id: 10, name: '敦刻尔克号', rarity: '史诗', probability: '4%', rarityColor: 'text-purple-400' },
  { id: 11, name: '玛丽亚号', rarity: '传奇', probability: '1%', rarityColor: 'text-orange-400' },
  { id: 12, name: '珍珠号', rarity: '传奇', probability: '1%', rarityColor: 'text-orange-400' },
  { id: 13, name: '莱特号', rarity: '传奇', probability: '1%', rarityColor: 'text-orange-400' },
  { id: 14, name: '雷德尔号', rarity: '传奇', probability: '1%', rarityColor: 'text-orange-400' },
]

export function Mint() {
  const { isConnected } = useAccount()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const { useMintShip, useMintPrice, useFuelBalance } = useContracts()
  const { mint, isPending, isSuccess } = useMintShip()
  const { data: mintPrice } = useMintPrice()
  const { data: fuelBalance } = useFuelBalance()

  const pricePerShip = mintPrice || 0n
  const totalCost = pricePerShip * BigInt(quantity)

  useEffect(() => {
    if (isSuccess) {
      toast.success(`成功铸造了 ${quantity} 艘战舰！`)
      navigate('/')
    }
  }, [isSuccess, quantity, navigate])

  const handleMint = async () => {
    try {
      console.log('开始铸造:', {
        quantity: BigInt(quantity),
        pricePerShip: formatEther(pricePerShip),
        totalCost: formatEther(totalCost),
        contractAddress: '0x41aA73453681fa67D42F35162C20998C60e4459F',
        fuelBalance: fuelBalance ? formatEther(fuelBalance as bigint) : '0'
      })
      await mint(BigInt(quantity))
    } catch (error) {
      console.error('Mint failed:', error)
      toast.error('铸造失败: ' + (error as any).message)
    }
  }

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(MAX_MINT, value))
    setQuantity(newQuantity)
  }

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">连接钱包以铸造</h2>
          <p className="text-gray-400">您需要连接钱包才能铸造战舰</p>
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

      <div className="fixed inset-0 overflow-hidden pt-16 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
        {/* 三列布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{height: '80vh'}}>
          
          {/* 左栏：可能获得的飞船 */}
          <div className="glass-card p-6 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-center gap-2 mb-6 flex-shrink-0">
              <span className="text-2xl">🚀</span>
              <h2 className="text-xl font-bold text-white">可能获得的飞船</h2>
            </div>
            
            {/* 固定高度可滚动飞船列表 - 最多显示8个的高度 */}
            <div className="overflow-y-auto space-y-1 pr-2 min-h-0" style={{
              height: '320px', // 8 * (36px图片 + 8px内边距 + 4px间距) ≈ 40px per item * 8 = 320px
              scrollbarWidth: 'thin', 
              scrollbarColor: '#FF6B35 #1F2937'
            }}>
              {SHIP_LIST.map((ship) => (
                <div key={ship.id} className="glass-card p-2 hover:scale-102 transition-all duration-300 border border-gray-700/30 hover:border-gray-500/50">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <img 
                        src={`/images/${ship.id + 1}.png`}
                        alt={ship.name}
                        className="object-cover rounded shadow-lg border border-gray-600/50"
                        style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px', maxWidth: '36px', maxHeight: '36px' }}
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white leading-none">{ship.id + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-white text-sm">{ship.name}</span>
                        <span className="text-xs font-mono bg-gray-700/50 px-1.5 py-0.5 rounded text-gray-300">{ship.probability}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ship.rarityColor} bg-gray-800/50`}>
                          {ship.rarity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 中栏：造舰结果 */}
          <div className="glass-card p-6 h-full flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">⚡</span>
              <h2 className="text-xl font-bold text-white">造舰结果</h2>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-4xl">❓</span>
                </div>
                <p className="text-gray-400 mb-8">点击造舰按钮开始制造</p>
              </div>
              
              {/* 稀有度分布 */}
              <div className="glass-card p-4 bg-gray-800/30">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <span>📊</span>
                  稀有度分布
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">普通</span>
                    </div>
                    <span className="text-sm text-gray-300">60%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-blue-400">稀有</span>
                    </div>
                    <span className="text-sm text-gray-300">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-purple-400">史诗</span>
                    </div>
                    <span className="text-sm text-gray-300">12%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-orange-400">传奇</span>
                    </div>
                    <span className="text-sm text-gray-300">3%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右栏：造舰控制 */}
          <div className="glass-card p-8 h-full flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl">⚙️</span>
                <h2 className="text-xl font-bold text-white">造舰控制</h2>
              </div>
              
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-2xl shadow-orange-500/30">
                <span className="text-3xl">🏭</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">神秘造舰</h3>
              <p className="text-sm text-gray-400 leading-relaxed">每次造舰将随机获得一艘飞船<br/>稀有度完全看运气！</p>
            </div>

            {/* 造价明细 */}
            <div className="glass-card p-6 bg-gray-800/30 mb-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-xl">💰</span>
                <span className="font-bold text-yellow-400 text-lg">造价明细</span>
              </div>
              <div className="space-y-4 text-center">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">造舰费用:</span>
                  <span className="text-white font-bold text-lg">{formatEther(pricePerShip)} OKB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">数量:</span>
                  <span className="text-white font-bold text-lg">{quantity} 艘</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">飞船类型:</span>
                  <span className="text-white font-bold text-lg">随机</span>
                </div>
                <hr className="border-gray-600 my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">总价:</span>
                  <span className="font-bold text-xl" style={{color: '#ff6b35'}}>{formatEther(totalCost)} OKB</span>
                </div>
              </div>
            </div>

            {/* 数量控制 */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all flex items-center justify-center text-xl font-bold"
                >
                  −
                </button>
                
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-32 h-12 bg-gray-800 border border-gray-600 rounded-xl text-center text-white font-bold text-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  style={{
                    appearance: 'textfield',
                    MozAppearance: 'textfield'
                  }}
                  min={1}
                  max={MAX_MINT}
                />
                
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-all flex items-center justify-center text-xl font-bold"
                >
                  +
                </button>
              </div>
              
             
            </div>

            {/* 神秘造舰按钮 */}
            <button
              onClick={handleMint}
              disabled={isPending}
              className="w-full h-16 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-lg transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 flex items-center justify-center gap-3 shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/40"
              style={{
                background: isPending ? '#4B5563' : 'linear-gradient(to right, #ff6b35, #e55527)',
                boxShadow: isPending ? 'none' : '0 25px 50px -12px rgba(255, 107, 53, 0.25)'
              }}
            >
              <span className="text-2xl">🚀</span>
              <span>{isPending ? '神秘造舰中...' : '神秘造舰'}</span>
              <span className="text-2xl">⚡</span>
            </button>

              {/* 当前FUEL余额 */}
              <div className="mt-auto text-center">
                <div className="glass-card p-4 bg-green-500/10 border border-green-500/20">
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
    </div>
    </>
  )
}