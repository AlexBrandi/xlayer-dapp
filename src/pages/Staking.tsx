import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useContracts } from '../hooks/useContracts'
import toast from 'react-hot-toast'

interface StakedDog {
  tokenId: bigint
  stakedAt: number
  rewards: bigint
}

export function Staking() {
  const { isConnected } = useAccount()
  const [selectedDogs, setSelectedDogs] = useState<bigint[]>([])
  const [stakedDogs, setStakedDogs] = useState<StakedDog[]>([])
  const { useTokensOfOwner } = useContracts()
  const { data: ownedTokens } = useTokensOfOwner()

  // Mock staking data - in real app this would come from smart contract
  useEffect(() => {
    if (isConnected) {
      // Simulate some dogs being already staked
      setStakedDogs([
        { tokenId: 1n, stakedAt: Date.now() - 86400000, rewards: 100n },
        { tokenId: 3n, stakedAt: Date.now() - 172800000, rewards: 200n }
      ])
    }
  }, [isConnected])

  const handleSelectDog = (tokenId: bigint) => {
    if (selectedDogs.includes(tokenId)) {
      setSelectedDogs(selectedDogs.filter(id => id !== tokenId))
    } else {
      setSelectedDogs([...selectedDogs, tokenId])
    }
  }

  const handleStake = async () => {
    if (selectedDogs.length === 0) {
      toast.error('Please select BabyDogs to stake')
      return
    }

    try {
      // Simulate staking
      toast.success(`Successfully staked ${selectedDogs.length} BabyDog${selectedDogs.length > 1 ? 's' : ''}!`)
      
      // Add to staked list
      const newStakedDogs = selectedDogs.map(tokenId => ({
        tokenId,
        stakedAt: Date.now(),
        rewards: 0n
      }))
      
      setStakedDogs([...stakedDogs, ...newStakedDogs])
      setSelectedDogs([])
    } catch (error) {
      toast.error('Staking failed')
    }
  }

  const handleUnstake = async (tokenId: bigint) => {
    try {
      toast.success(`Successfully unstaked BabyDog #${tokenId} and claimed rewards!`)
      setStakedDogs(stakedDogs.filter(dog => dog.tokenId !== tokenId))
    } catch (error) {
      toast.error('Unstaking failed')
    }
  }

  const calculateRewards = (stakedAt: number) => {
    const daysStaked = Math.floor((Date.now() - stakedAt) / 86400000)
    return daysStaked * 10 // 10 tokens per day
  }

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center glass-card p-8">
          <h2 className="text-3xl font-bold mb-4">🐕 Connect Wallet to Stake</h2>
          <p className="text-gray-400">You need to connect your wallet to stake your BabyDogs</p>
        </div>
      </div>
    )
  }

  const availableDogs = ownedTokens?.filter(
    tokenId => !stakedDogs.some(staked => staked.tokenId === tokenId)
  ) || []

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">BabyDog Staking 🏦</h1>
          <p className="text-xl text-poop-brown-medium">
            Stake your BabyDogs to earn rewards! The longer you stake, the more you earn!
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 text-center">
            <div className="text-3xl mb-2">🐕</div>
            <div className="text-2xl font-bold">{stakedDogs.length}</div>
            <div className="text-sm text-poop-brown-medium">Dogs Staked</div>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold">
              {stakedDogs.reduce((total, dog) => total + calculateRewards(dog.stakedAt), 0)}
            </div>
            <div className="text-sm text-poop-brown-medium">Total Rewards</div>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold">10</div>
            <div className="text-sm text-poop-brown-medium">Rewards Per Day</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Available Dogs Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Available to Stake</h2>
            
            {availableDogs.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-6xl mb-4">🗑️</div>
                <p className="text-xl text-poop-brown-medium">
                  No BabyDogs available to stake
                </p>
                <p className="text-sm mt-2">
                  Mint some BabyDogs first or unstake your current ones
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {availableDogs.map((tokenId) => (
                    <div
                      key={tokenId.toString()}
                      onClick={() => handleSelectDog(tokenId)}
                      className={`glass-card p-4 cursor-pointer transition-all ${
                        selectedDogs.includes(tokenId)
                          ? 'ring-4 ring-cute-pink transform scale-105'
                          : 'hover:scale-102'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src="/dog/Generated Image September 06, 2025 - 6_58PM.jpeg"
                          alt={`BabyDog #${tokenId}`}
                          className="w-full h-24 object-cover rounded-lg mb-2"
                        />
                        {selectedDogs.includes(tokenId) && (
                          <div className="absolute top-2 right-2 bg-cute-pink text-white rounded-full p-1">
                            ✓
                          </div>
                        )}
                      </div>
                      <p className="text-center font-bold">#{tokenId.toString()}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleStake}
                  disabled={selectedDogs.length === 0}
                  className="btn btn-primary w-full text-xl"
                >
                  Stake {selectedDogs.length || ''} Selected Dog{selectedDogs.length !== 1 ? 's' : ''} 🐕
                </button>
              </>
            )}
          </div>

          {/* Staked Dogs Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Currently Staking</h2>
            
            {stakedDogs.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-6xl mb-4">😴</div>
                <p className="text-xl text-poop-brown-medium">
                  No BabyDogs staked yet
                </p>
                <p className="text-sm mt-2">
                  Select some dogs from the left to start earning rewards!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {stakedDogs.map((dog) => {
                  const rewards = calculateRewards(dog.stakedAt)
                  const daysStaked = Math.floor((Date.now() - dog.stakedAt) / 86400000)
                  
                  return (
                    <div key={dog.tokenId.toString()} className="glass-card p-6">
                      <div className="flex items-center gap-4">
                        <img
                          src="/dog/Generated Image September 06, 2025 - 6_58PM (1).jpeg"
                          alt={`BabyDog #${dog.tokenId}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">BabyDog #{dog.tokenId.toString()}</h3>
                          <div className="flex items-center gap-4 text-sm text-poop-brown-medium mt-1">
                            <span>📅 {daysStaked} days</span>
                            <span>💰 {rewards} rewards</span>
                          </div>
                          
                          <div className="mt-2">
                            <div className="progress-bar h-2">
                              <div 
                                className="progress-fill h-full"
                                style={{ width: `${Math.min(daysStaked * 10, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleUnstake(dog.tokenId)}
                          className="btn btn-secondary text-sm"
                        >
                          Unstake & Claim
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 glass-card p-8" style={{background: 'var(--bg-light-pink)'}}>
          <h3 className="text-2xl font-bold mb-4 text-center">🎯 Staking Rules</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">⏰</div>
              <h4 className="font-bold mb-1">Daily Rewards</h4>
              <p className="text-sm">Earn 10 tokens per day for each staked BabyDog</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="font-bold mb-1">No Lock Period</h4>
              <p className="text-sm">Unstake anytime and claim your rewards instantly</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎁</div>
              <h4 className="font-bold mb-1">Bonus Rewards</h4>
              <p className="text-sm">Special events with 2x rewards coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}