import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useContracts } from '../hooks/useContracts'
import { formatEther } from 'viem'
import toast from 'react-hot-toast'

const MAX_MINT = 100

export function SimpleMint() {
  const { isConnected } = useAccount()
  const [quantity, setQuantity] = useState(1)
  const { useMintShip, useMintPrice, useTotalSupply } = useContracts()
  const { mint, isPending } = useMintShip()
  const { data: mintPrice } = useMintPrice()
  const { data: totalSupply } = useTotalSupply()

  const pricePerDog = mintPrice || 0n
  const totalCost = pricePerDog * BigInt(quantity)

  const handleMint = async () => {
    try {
      await mint(BigInt(quantity))
      toast.success(`Successfully minted ${quantity} BabyDog${quantity > 1 ? 's' : ''}! 🐕`)
    } catch (error) {
      console.error('Mint failed:', error)
      toast.error('Minting failed: ' + (error as any).message)
    }
  }

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(MAX_MINT, value))
    setQuantity(newQuantity)
  }

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center glass-card p-8">
          <h2 className="text-3xl font-bold mb-4">🐕 Connect Wallet to Mint BabyDog</h2>
          <p className="text-gray-400">You need to connect your wallet to mint your cute BabyDog NFT</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="glass-card p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 ">Mint BabyDog 🐕💩</h1>
          <p className="text-lg">Get your cute BabyDog NFT!</p>
        </div>

        {/* Mint Preview - Rotating Dog Characters */}
        <div className="mb-8 text-center">
          <div className="relative inline-block">
           
            <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">💰</div>
            <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce">🗑️</div>
          </div>
          <p className="text-sm text-poop-brown-medium mt-2">One of 5 unique Dumpster Retrievers!</p>
        </div>

        {/* Mint Details */}
        <div className="glass-card p-6 mb-6" style={{background: 'var(--bg-light-pink)'}}>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Price per BabyDog:</span>
              <span className="font-bold text-lg">{formatEther(pricePerDog)} OKC</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Quantity:</span>
              <span className="font-bold text-lg">{quantity}</span>
            </div>
            <hr className="border-poop-brown-medium opacity-30" />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Total Cost:</span>
              <span className="font-bold text-xl gradient-text">{formatEther(totalCost)} OKC</span>
            </div>
          </div>
        </div>

        {/* Quantity Control */}
        <div className="mb-6">
          <label className="block text-center mb-3 font-semibold">Select Quantity</label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="btn w-12 h-12 p-0 flex items-center justify-center text-2xl"
              disabled={quantity <= 1}
            >
              -
            </button>
            
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-24 h-12 text-center font-bold text-xl rounded-xl"
              min={1}
              max={MAX_MINT}
            />
            
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="btn w-12 h-12 p-0 flex items-center justify-center text-2xl"
              disabled={quantity >= MAX_MINT}
            >
              +
            </button>
          </div>
        </div>

        {/* Mint Button */}
        <button
          onClick={handleMint}
          disabled={isPending}
          className="btn btn-primary w-full h-16 text-xl font-bold relative overflow-hidden group"
        >
          {isPending ? (
            <>
              <span className="loading-spinner">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </span>
              <span>Minting...</span>
            </>
          ) : (
            <>
              <span>Mint BabyDog</span>
              <span className="ml-2 text-2xl group-hover:animate-bounce">🐕</span>
            </>
          )}
        </button>

        {/* Supply Info */}
        <div className="mt-6 text-center">
          <div className="text-sm">
            <span className="font-semibold">Total Minted: </span>
            <span className="gradient-text font-bold">
              {totalSupply ? Number(totalSupply).toString() : '0'} / 10,000
            </span>
          </div>
          <div className="progress-bar mt-2">
            <div 
              className="progress-fill"
              style={{ width: `${totalSupply ? (Number(totalSupply) / 10000 * 100) : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}