import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useNavigate } from 'react-router-dom'
import { useContracts } from '../hooks/useContracts'
import { formatTokenAmount } from '../lib/format'
import toast from 'react-hot-toast'

const MINT_PRICE = BigInt(100) * BigInt(10 ** 18) // 100 FUEL per ship
const MAX_MINT = 10

export function Mint() {
  const { isConnected } = useAccount()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const { useMintShip, useFuelBalance } = useContracts()
  const { mint, isPending, isSuccess } = useMintShip()
  const { data: fuelBalance } = useFuelBalance()

  const totalCost = MINT_PRICE * BigInt(quantity)
  const hasEnoughBalance = fuelBalance ? fuelBalance >= totalCost : false

  useEffect(() => {
    if (isSuccess) {
      toast.success(`Successfully minted ${quantity} ship${quantity > 1 ? 's' : ''}!`)
      navigate('/')
    }
  }, [isSuccess, quantity, navigate])

  const handleMint = async () => {
    if (!hasEnoughBalance) {
      toast.error('Insufficient FUEL balance')
      return
    }
    await mint(BigInt(quantity))
  }

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(MAX_MINT, value))
    setQuantity(newQuantity)
  }

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Wallet to Mint</h2>
          <p className="text-gray-400">You need to connect your wallet to mint ships</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="glass-card p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Mint New Ships</h1>
        
        {/* Preview Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <img 
              src="/gem/ship/珍珠号.png" 
              alt="Ship Preview" 
              className="w-full rounded-xl shadow-lg"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Ship Collection</h3>
              <p className="text-gray-400 mb-4">
                Mint your fleet of warships to start earning $FUEL rewards. Each ship has unique attributes
                including rarity, level, HP, and earning potential.
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Price per Ship:</span>
                  <span className="font-bold">{formatTokenAmount(MINT_PRICE)} $FUEL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Your Balance:</span>
                  <span className={`font-bold ${hasEnoughBalance ? 'text-green-400' : 'text-red-400'}`}>
                    {formatTokenAmount(fuelBalance || BigInt(0))} $FUEL
                  </span>
                </div>
              </div>
            </div>
            
            {/* Rarity Distribution */}
            <div>
              <h4 className="text-sm font-bold mb-2 text-gray-400">Rarity Distribution</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-rarity-common">Common</span>
                  <span className="text-gray-400">60%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rarity-rare">Rare</span>
                  <span className="text-gray-400">25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rarity-epic">Epic</span>
                  <span className="text-gray-400">12%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rarity-legend">Legendary</span>
                  <span className="text-gray-400">3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mint Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="btn-secondary w-12 h-12 flex items-center justify-center text-xl"
              >
                -
              </button>
              
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-center text-xl font-bold"
                min={1}
                max={MAX_MINT}
              />
              
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="btn-secondary w-12 h-12 flex items-center justify-center text-xl"
              >
                +
              </button>
            </div>
            
            <div className="flex gap-2 mt-2">
              {[1, 3, 5, 10].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setQuantity(amt)}
                  className="btn-secondary text-sm flex-1"
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>

          {/* Total Cost */}
          <div className="glass-card p-4 bg-gray-800/50">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Cost:</span>
              <span className="text-2xl font-bold">{formatTokenAmount(totalCost)} $FUEL</span>
            </div>
            {!hasEnoughBalance && (
              <p className="text-red-400 text-sm mt-2">
                Insufficient balance. You need {formatTokenAmount(totalCost - (fuelBalance || BigInt(0)))} more $FUEL
              </p>
            )}
          </div>

          {/* Mint Button */}
          <button
            onClick={handleMint}
            disabled={isPending || !hasEnoughBalance}
            className="w-full btn-primary text-lg py-4 disabled:bg-gray-700"
          >
            {isPending ? `Minting ${quantity} Ship${quantity > 1 ? 's' : ''}...` : `Mint ${quantity} Ship${quantity > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}