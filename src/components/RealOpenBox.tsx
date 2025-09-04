import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShips } from '../hooks/useShips'

interface RealOpenBoxProps {
  tokenIds: bigint[]
  onComplete: () => void
}

// Ship data - mapping imageId to real ships
const SHIP_LIST = [
  { id: 0, name: 'Abel', rarity: 'Common', rarityColor: 'text-gray-400' },
  { id: 1, name: 'Adventurer', rarity: 'Common', rarityColor: 'text-gray-400' },
  { id: 2, name: 'Chenoa', rarity: 'Common', rarityColor: 'text-gray-400' },
  { id: 3, name: 'Capech', rarity: 'Common', rarityColor: 'text-gray-400' },
  { id: 4, name: 'Cavendi', rarity: 'Common', rarityColor: 'text-gray-400' },
  { id: 5, name: 'Hobbs', rarity: 'Rare', rarityColor: 'text-blue-400' },
  { id: 6, name: 'Gabriel', rarity: 'Rare', rarityColor: 'text-blue-400' },
  { id: 7, name: 'Campbell', rarity: 'Rare', rarityColor: 'text-blue-400' },
  { id: 8, name: 'Terror', rarity: 'Rare', rarityColor: 'text-blue-400' },
  { id: 9, name: 'Moore', rarity: 'Epic', rarityColor: 'text-purple-400' },
  { id: 10, name: 'Dunkirk', rarity: 'Epic', rarityColor: 'text-purple-400' },
  { id: 11, name: 'Maria', rarity: 'Epic', rarityColor: 'text-purple-400' },
  { id: 12, name: 'Pearl', rarity: 'Epic', rarityColor: 'text-purple-400' },
  { id: 13, name: 'Wright', rarity: 'Legendary', rarityColor: 'text-orange-400' },
  { id: 14, name: 'Redel', rarity: 'Legendary', rarityColor: 'text-orange-400' },
]

// Rarity background effects
const RARITY_EFFECTS: Record<string, string> = {
  'Common': 'from-gray-500/20 to-gray-600/20',
  'Rare': 'from-blue-500/20 to-blue-600/20',
  'Epic': 'from-purple-500/20 to-purple-600/20',
  'Legendary': 'from-orange-500/20 to-orange-600/20'
}

const RARITY_GLOW: Record<string, string> = {
  'Common': 'shadow-gray-500/50',
  'Rare': 'shadow-blue-500/50',
  'Epic': 'shadow-purple-500/50',
  'Legendary': 'shadow-orange-500/50'
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
  const navigate = useNavigate()
  
  const { useShipDetails } = useShips()
  const currentTokenId = tokenIds[currentBox]
  const shipDetails = useShipDetails(currentTokenId)

  const handleOpenBox = async () => {
    if (!shipDetails) return
    
    setIsOpening(true)
    
    // Unboxing animation delay
    setTimeout(() => {
      const imageId = shipDetails.imageId
      const ship = SHIP_LIST[imageId] || SHIP_LIST[0] // fallback to first ship
      
      const revealed: RevealedShip = {
        tokenId: currentTokenId,
        ship,
        level: shipDetails.level
      }
      
      setRevealedShip(revealed)
      setIsOpening(false)
    }, 2000)
  }

  const handleNextBox = () => {
    if (currentBox < tokenIds.length - 1) {
      setCurrentBox(currentBox + 1)
      setRevealedShip(null)
    } else {
      // Directly navigate to homepage instead of showing results
      onComplete()
      navigate('/')
    }
  }


  // Auto-start first box
  useEffect(() => {
    if (shipDetails && currentBox < tokenIds.length) {
      handleOpenBox()
    }
  }, [shipDetails, currentBox])

  if (!shipDetails) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="glass-card p-8 max-w-lg w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Loading ship data...</p>
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
          <h2 className="text-2xl font-bold text-white mb-2">Ship Unboxing</h2>
          <p className="text-gray-400">Ship {currentBox + 1} / {tokenIds.length}</p>
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
                    <p className="text-orange-400 font-bold">Opening...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-gray-300 font-bold">Opening...</p>
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
                  className="w-16 h-16 object-contain mb-3"
                />
                <h3 className="font-bold text-white text-base">{revealedShip.ship.name}</h3>
                <p className={`text-xs font-medium ${revealedShip.ship.rarityColor}`}>{revealedShip.ship.rarity}</p>
                <p className="text-xs text-cyan-400">Level {revealedShip.level}</p>
                
                {/* 稀有度光效 */}
                <div className="absolute inset-0 rounded-xl opacity-20 bg-gradient-to-br from-transparent via-white to-transparent animate-ping"></div>
              </div>
              
              {/* 恭喜文字 */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <p className="text-2xl font-bold text-yellow-400 animate-bounce">Congratulations!</p>
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
                  <span>Continue Unboxing ({tokenIds.length - currentBox - 1} remaining)</span>
                  <span className="text-xl">⚡</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🎉</span>
                  <span>View All Ships</span>
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