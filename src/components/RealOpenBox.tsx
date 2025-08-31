import { useState, useEffect } from 'react'
import { useShips } from '../hooks/useShips'
import { useContracts } from '../hooks/useContracts'

interface RealOpenBoxProps {
  tokenIds: bigint[]
  onComplete: () => void
}

// 飞船数据 - 基于imageId映射到真实战舰
const SHIP_LIST = [
  { id: 0, name: '亚伯号', rarity: '普通', rarityColor: 'text-gray-400' },
  { id: 1, name: '冒险者号', rarity: '普通', rarityColor: 'text-gray-400' },
  { id: 2, name: '切诺亚号', rarity: '普通', rarityColor: 'text-gray-400' },
  { id: 3, name: '卡佩奇号', rarity: '普通', rarityColor: 'text-gray-400' },
  { id: 4, name: '卡文迪号', rarity: '稀有', rarityColor: 'text-blue-400' },
  { id: 5, name: '哈布斯号', rarity: '稀有', rarityColor: 'text-blue-400' },
  { id: 6, name: '嘉百列号', rarity: '稀有', rarityColor: 'text-blue-400' },
  { id: 7, name: '坎贝尔号', rarity: '稀有', rarityColor: 'text-blue-400' },
  { id: 8, name: '惊恐号', rarity: '史诗', rarityColor: 'text-purple-400' },
  { id: 9, name: '摩尔号', rarity: '史诗', rarityColor: 'text-purple-400' },
  { id: 10, name: '敦刻尔克号', rarity: '史诗', rarityColor: 'text-purple-400' },
  { id: 11, name: '玛丽亚号', rarity: '传奇', rarityColor: 'text-orange-400' },
  { id: 12, name: '珍珠号', rarity: '传奇', rarityColor: 'text-orange-400' },
  { id: 13, name: '莱特号', rarity: '传奇', rarityColor: 'text-orange-400' },
  { id: 14, name: '雷德尔号', rarity: '传奇', rarityColor: 'text-orange-400' },
]

// 稀有度对应的背景效果
const RARITY_EFFECTS = {
  '普通': 'from-gray-500/20 to-gray-600/20',
  '稀有': 'from-blue-500/20 to-blue-600/20',
  '史诗': 'from-purple-500/20 to-purple-600/20',
  '传奇': 'from-orange-500/20 to-orange-600/20'
}

const RARITY_GLOW = {
  '普通': 'shadow-gray-500/50',
  '稀有': 'shadow-blue-500/50',
  '史诗': 'shadow-purple-500/50',
  '传奇': 'shadow-orange-500/50'
}

interface RevealedShip {
  tokenId: bigint
  ship: typeof SHIP_LIST[0]
  level: number
}

export function RealOpenBox({ tokenIds, onComplete }: RealOpenBoxProps) {
  const [currentBox, setCurrentBox] = useState(0)
  const [isOpening, setIsOpening] = useState(false)
  const [revealedShip, setRevealedShip] = useState<RevealedShip | null>(null)
  const [allRevealedShips, setAllRevealedShips] = useState<RevealedShip[]>([])
  const [showResults, setShowResults] = useState(false)
  
  const { useShipDetails } = useShips()
  const currentTokenId = tokenIds[currentBox]
  const shipDetails = useShipDetails(currentTokenId)

  const handleOpenBox = async () => {
    if (!shipDetails) return
    
    setIsOpening(true)
    
    // 开盒动画延时
    setTimeout(() => {
      const imageId = shipDetails.imageId
      const ship = SHIP_LIST[imageId] || SHIP_LIST[0] // fallback to first ship
      
      const revealed: RevealedShip = {
        tokenId: currentTokenId,
        ship,
        level: shipDetails.level
      }
      
      setRevealedShip(revealed)
      setAllRevealedShips(prev => [...prev, revealed])
      setIsOpening(false)
    }, 2000)
  }

  const handleNextBox = () => {
    if (currentBox < tokenIds.length - 1) {
      setCurrentBox(currentBox + 1)
      setRevealedShip(null)
    } else {
      setShowResults(true)
    }
  }

  const handleViewFleet = () => {
    onComplete()
  }

  // 自动开始第一个盒子
  useEffect(() => {
    if (shipDetails && currentBox < tokenIds.length) {
      handleOpenBox()
    }
  }, [shipDetails, currentBox])

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="glass-card p-8 max-w-4xl w-full mx-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">🎉 开盒完成！</h2>
            <p className="text-gray-400">您总共开启了 {tokenIds.length} 艘战舰</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 max-h-96 overflow-y-auto">
            {allRevealedShips.map((revealed, index) => (
              <div key={index} className="glass-card p-4 text-center">
                <img 
                  src={`/images/${revealed.ship.id + 1}.png`}
                  alt={revealed.ship.name}
                  className="w-12 h-12 mx-auto mb-2 object-contain"
                />
                <h3 className="font-bold text-white text-sm">{revealed.ship.name}</h3>
                <p className={`text-xs ${revealed.ship.rarityColor}`}>{revealed.ship.rarity}</p>
                <p className="text-xs text-cyan-400">等级 {revealed.level}</p>
                <p className="text-xs text-gray-500">#{revealed.tokenId.toString()}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleViewFleet}
              className="flex-1 h-14 rounded-xl text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl"
              style={{
                background: 'linear-gradient(to right, #ff6b35, #e55527)',
                boxShadow: '0 25px 50px -12px rgba(255, 107, 53, 0.25)'
              }}
            >
              <span className="text-2xl">🚀</span>
              <span>查看我的舰队</span>
              <span className="text-2xl">⚡</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!shipDetails) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="glass-card p-8 max-w-lg w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">正在加载战舰数据...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      {/* 科幻宇宙背景 */}
      <div className="sci-fi-background"></div>
      <div className="spiral-depth"></div>
      <div className="sci-fi-particles">
        {Array.from({ length: 30 }).map((_, i) => (
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

      <div className="glass-card p-8 max-w-lg w-full mx-4 relative">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">战舰开盒</h2>
          <p className="text-gray-400">战舰 {currentBox + 1} / {tokenIds.length}</p>
          <p className="text-sm text-cyan-400">Token ID: #{currentTokenId.toString()}</p>
        </div>

        <div className="relative flex items-center justify-center mb-8">
          {!revealedShip ? (
            <>
              {/* 未开盒状态 */}
              <div className={`relative w-48 h-48 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 border-4 border-gray-600 flex items-center justify-center ${isOpening ? 'animate-bounce' : ''}`}>
                {isOpening ? (
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-orange-400 font-bold">开启中...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-gray-300 font-bold">正在开启...</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* 已开盒状态 - 显示获得的飞船 */}
              <div className={`relative w-48 h-48 rounded-xl bg-gradient-to-br ${RARITY_EFFECTS[revealedShip.ship.rarity]} border-4 border-opacity-60 flex flex-col items-center justify-center shadow-2xl ${RARITY_GLOW[revealedShip.ship.rarity]} animate-pulse`}>
                <img 
                  src={`/images/${revealedShip.ship.id + 1}.png`}
                  alt={revealedShip.ship.name}
                  className="w-24 h-24 object-contain mb-2"
                />
                <h3 className="font-bold text-white text-lg">{revealedShip.ship.name}</h3>
                <p className={`text-sm font-medium ${revealedShip.ship.rarityColor}`}>{revealedShip.ship.rarity}</p>
                <p className="text-sm text-cyan-400">等级 {revealedShip.level}</p>
                
                {/* 稀有度光效 */}
                <div className="absolute inset-0 rounded-xl opacity-20 bg-gradient-to-br from-transparent via-white to-transparent animate-ping"></div>
              </div>
              
              {/* 恭喜文字 */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <p className="text-2xl font-bold text-yellow-400 animate-bounce">恭喜获得！</p>
              </div>
            </>
          )}
        </div>

        <div className="text-center">
          {revealedShip && (
            <button
              onClick={handleNextBox}
              className="w-full h-14 rounded-xl text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl"
              style={{
                background: 'linear-gradient(to right, #ff6b35, #e55527)',
                boxShadow: '0 25px 50px -12px rgba(255, 107, 53, 0.25)'
              }}
            >
              {currentBox < tokenIds.length - 1 ? (
                <>
                  <span className="text-xl">📦</span>
                  <span>继续开盒 ({tokenIds.length - currentBox - 1} 个剩余)</span>
                  <span className="text-xl">⚡</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🎉</span>
                  <span>查看所有战舰</span>
                  <span className="text-xl">🚀</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}