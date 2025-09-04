import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useGems } from '../hooks/useGems'
import { useContracts } from '../hooks/useContracts'
import { formatEther } from 'viem'
import toast from 'react-hot-toast'
import { GemType } from '../types'
import { CONTRACT_ADDRESSES } from '../lib/config'
import { UpgradeRequirementsTable } from '../components/UpgradeRequirementsTable'

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
    name: 'Sapphire',
    symbol: 'SAP',
    color: 'border-blue-500 bg-blue-500/10',
    description: 'Rare blue gems used for ship upgrades',
    image: '/images/sapphire.png'
  },
  {
    id: 'SUNSTONE',
    name: 'Sunstone',
    symbol: 'SUN',
    color: 'border-orange-500 bg-orange-500/10',
    description: 'Radiant gems that power ship systems',
    image: '/images/sunstone.png'
  },
  {
    id: 'LITHIUM',
    name: 'Lithium',
    symbol: 'LIT',
    color: 'border-purple-500 bg-purple-500/10',
    description: 'Essential minerals for advanced upgrades',
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
    try {
      if (!canAfford[selectedGemLower]) {
        toast.error('Insufficient FUEL balance')
        return
      }

      if (needsFuelApproval) {
        await approveFuel(totalCost * 2n) // Approve 2x for future purchases
      }

      await purchaseGems(selectedGem, quantity)
      
      // Show success message only after purchase is complete
      const gemName = selectedGem === 'SAPPHIRE' ? 'Sapphire' : selectedGem === 'SUNSTONE' ? 'Sunstone' : 'Lithium'
      toast.success(`Successfully purchased ${quantity} ${gemName}!`)
      
      setQuantity(1)
    } catch (error: any) {
      toast.error(error.message || 'Purchase failed')
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Connect Wallet to Access Market</h2>
          <p className="text-gray-400">You need to connect your wallet to purchase gems</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Sci-fi universe background */}
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
        <h1 className="text-3xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
            💎 Gem Market 💎
          </span>
        </h1>

        {/* Gem Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {GEMS.map((gem) => (
            <button
              key={gem.id}
              onClick={() => setSelectedGem(gem.id)}
              className={`glass-card p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                selectedGem === gem.id 
                  ? `${gem.color} shadow-lg transform scale-105` 
                  : 'border-gray-700/30 hover:border-gray-500/50'
              }`}
            >
              <div className="relative mb-4">
                <img 
                  src={gem.image} 
                  alt={gem.name}
                  className="w-16 h-16 mx-auto object-contain drop-shadow-lg"
                />
                {selectedGem === gem.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-full"></div>
                )}
              </div>
              <h3 className="text-base font-bold mb-1 text-white">{gem.name}</h3>
              <p className="text-xs text-gray-400 mb-1">{gem.symbol}</p>
              <p className="text-xs text-gray-500 mb-3">{gem.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Price:</span>
                  <span className="text-white font-medium">{pricesFormatted[gem.id.toLowerCase() as keyof typeof pricesFormatted]} FUEL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">You own:</span>
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
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Purchase {selectedGem === 'SAPPHIRE' ? 'Sapphire' : selectedGem === 'SUNSTONE' ? 'Sunstone' : 'Lithium'}
              </h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">Quantity</label>
                <div className="flex items-center justify-center gap-4 py-4">
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
                    className="h-12 bg-gray-800 border border-gray-600 rounded-xl text-center text-white font-bold text-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    style={{
                      appearance: 'textfield',
                      MozAppearance: 'textfield',
                      width: '280px'
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
                  <span className="font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Price Details</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Unit Price:</span>
                    <span className="text-white font-bold">{pricesFormatted[selectedGemLower]} FUEL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Quantity:</span>
                    <span className="text-white font-bold">{quantity} gems</span>
                  </div>
                  <hr className="border-gray-600" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Total:</span>
                    <span className="font-bold text-xl" style={{color: '#ff6b35'}}>{formatEther(totalCost)} FUEL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Your Balance:</span>
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
                    ⚠️ Gem authorization required for upgrades
                  </p>
                  <button
                    onClick={approveGems}
                    disabled={isApprovePending}
                    className="w-full py-2 rounded-lg text-sm font-medium bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 transition-all"
                  >
                    {isApprovePending ? 'Approving Gems...' : 'Approve Gems'}
                  </button>
                </div>
              )}

              <button
                onClick={handleBuy}
                disabled={isBuyPending || isFuelApprovePending || !canAfford[selectedGemLower]}
                className="w-full h-16 rounded-xl text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden group"
                style={{
                  background: (isBuyPending || isFuelApprovePending || !canAfford[selectedGemLower]) 
                    ? '#4B5563' 
                    : 'linear-gradient(135deg, #ff6b35, #e55527, #ff8a65)',
                  boxShadow: (isBuyPending || isFuelApprovePending || !canAfford[selectedGemLower]) 
                    ? 'none' 
                    : '0 25px 50px -12px rgba(255, 107, 53, 0.4), 0 0 30px rgba(255, 107, 53, 0.2)',
                  cursor: (isBuyPending || isFuelApprovePending || !canAfford[selectedGemLower]) 
                    ? 'not-allowed' 
                    : 'pointer'
                }}
              >
                {!isBuyPending && !isFuelApprovePending && canAfford[selectedGemLower] && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                )}
                <span className="text-2xl z-10">{isBuyPending || isFuelApprovePending ? '⏳' : '💎'}</span>
                <span className="z-10">
                  {isFuelApprovePending 
                    ? 'Approving FUEL...' 
                    : isBuyPending 
                    ? 'Purchasing...' 
                    : !canAfford[selectedGemLower]
                    ? 'Insufficient FUEL'
                    : `Buy ${quantity} ${selectedGem === 'SAPPHIRE' ? 'Sapphire' : selectedGem === 'SUNSTONE' ? 'Sunstone' : 'Lithium'}`
                  }
                </span>
                <span className="text-2xl z-10">⚡</span>
              </button>
            </div>
          </div>

          {/* Right: Info */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">📚</span>
              <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Gem Usage Guide</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 text-cyan-400">How to Use Gems</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold min-w-[16px]">1.</span>
                    <span>Purchase gems with FUEL tokens</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold min-w-[16px]">2.</span>
                    <span>Find your ships on the dashboard</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold min-w-[16px]">3.</span>
                    <span>Click "Upgrade" on unstaked ships</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold min-w-[16px]">4.</span>
                    <span>Confirm transaction to complete upgrade</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 text-cyan-400">Upgrade Requirements</h3>
                <div className="glass-card p-4 bg-gray-800/30">
                  <UpgradeRequirementsTable compact />
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-400">💡</span>
                  <span className="text-sm font-medium text-blue-400">Tip</span>
                </div>
                <p className="text-sm text-blue-300">
                  Higher level ships can earn more FUEL rewards! It's recommended to upgrade frequently used ships first.
                </p>
              </div>

              {/* Current FUEL balance display */}
              <div className="glass-card p-4 bg-green-500/10 border border-green-500/20">
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">Current FUEL Balance</div>
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