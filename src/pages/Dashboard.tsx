import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Link } from 'react-router-dom'
import { ShipCard } from '../components/ShipCard'
import { BatchStakeModal } from '../components/BatchStakeModal'
import { BattlePowerCard } from '../components/BattlePowerCard'
// import { DebugPanel } from '../components/DebugPanel'
import { formatEther } from 'viem'
import { useShips } from '../hooks/useShips'
import { useRewards } from '../hooks/useRewards'
import { useGems } from '../hooks/useGems'
import { useContracts } from '../hooks/useContracts'

export function Dashboard() {
  const { isConnected } = useAccount()
  const [showBatchStakeModal, setShowBatchStakeModal] = useState(false)
  
  const { allShips, stakedShips, unstakedShips, useAllShipsDetails } = useShips()
  const allShipsDetails = useAllShipsDetails()
  const { totalPending, totalPendingFormatted, claimAllRewards, isClaimPending } = useRewards()
  const { balances } = useGems()
  const { useFuelBalance } = useContracts()
  const { data: fuelBalance } = useFuelBalance()

  // Debug info hidden
  // console.log('Dashboard Debug:', {
  //   allShips: allShips.map(id => id.toString()),
  //   allShipsDetails,
  //   stakedShips: stakedShips.map(id => id.toString()),
  //   unstakedShips: unstakedShips.map(id => id.toString()),
  //   totalShips: allShips.length,
  //   stakedShipsDetails: allShipsDetails.filter(ship => ship.isStaked),
  //   unstakedShipsDetails: allShipsDetails.filter(ship => !ship.isStaked)
  // })

  const handleRefresh = () => {
    // Force refresh of data without page reload
    // The hooks will automatically refetch the data
  }

  const handleClaimAll = async () => {
    await claimAllRewards()
    // Data will be automatically refreshed by hooks
  }


  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Fleet DApp</h2>
          <p className="text-gray-400 mb-6">Connect your wallet to view your fleet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Debug Panel - hidden debug info */}
      {/* <DebugPanel /> */}
      
      {/* Battle Power and Stats Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mb-6">
        {/* Battle Power Card - Takes 1 column on xl screens, full width on smaller */}
        <div className="xl:col-span-1">
          <BattlePowerCard />
        </div>
        
        {/* Stats Overview - Takes 2 columns on xl screens, full width on smaller */}
        <div className="xl:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
        {/* FUEL Balance */}
        <div className="glass-card p-4">
          <h3 className="text-xs text-gray-400 mb-1">FUEL Balance</h3>
          <p className="text-lg font-bold text-green-400">
            {fuelBalance ? formatEther(fuelBalance as bigint) : '0'} FUEL
          </p>
        </div>

        {/* Pending Rewards */}
        <div className="glass-card p-4">
          <h3 className="text-xs text-gray-400 mb-1">Pending Rewards</h3>
          <p className="text-lg font-bold text-yellow-400">
            {totalPendingFormatted} FUEL
          </p>
        </div>

        {/* Ships Status */}
        <div className="glass-card p-4">
          <h3 className="text-xs text-gray-400 mb-1">Ship Status</h3>
          <div className="flex gap-3">
            <div>
              <p className="text-xs text-gray-500">Staked</p>
              <p className="text-base font-bold text-blue-400">{stakedShips.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Idle</p>
              <p className="text-base font-bold text-gray-400">{unstakedShips.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-base font-bold">{stakedShips.length + unstakedShips.length}</p>
            </div>
          </div>
        </div>

        {/* Gem Balance */}
        <div className="glass-card p-4">
          <h3 className="text-xs text-gray-400 mb-1">Gem Balance</h3>
          <div className="flex gap-2">
            <div className="text-center">
              <p className="text-xs text-gray-500">Sapphire</p>
              <p className="text-sm font-bold text-blue-400">{balances.sapphire.toString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Sunstone</p>
              <p className="text-sm font-bold text-orange-400">{balances.sunstone.toString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Lithium</p>
              <p className="text-sm font-bold text-purple-400">{balances.lithium.toString()}</p>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">My Fleet</h2>
        <div className="flex gap-2">
          <button
            onClick={handleClaimAll}
            disabled={!totalPending || totalPending === 0n || isClaimPending}
            className="btn-primary bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-sm"
          >
            {isClaimPending ? 'Claiming...' : 'Claim All Rewards'}
          </button>
          <button onClick={handleRefresh} className="btn-secondary text-sm">
            Refresh
          </button>
        </div>
      </div>

      {/* Ships Display */}
      {(allShips.length === 0 && stakedShips.length === 0 && unstakedShips.length === 0) ? (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-400 mb-4">You don't have any ships yet</p>
          <Link to="/mint" className="btn-primary">
            Mint Your First Ship
          </Link>
        </div>
      ) : (
        <>
          {/* Staked Ships */}
          {stakedShips.length > 0 && (
            <div className="mb-8">
              <h3 className="text-base font-semibold mb-3 text-blue-400">
                Staked Ships ({stakedShips.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {stakedShips
                  .sort((a, b) => {
                    const shipA = allShipsDetails.find(ship => ship.tokenId === a)
                    const shipB = allShipsDetails.find(ship => ship.tokenId === b)
                    // Sort by level descending, then by tokenId ascending
                    if (shipA?.level !== shipB?.level) {
                      return (shipB?.level || 0) - (shipA?.level || 0)
                    }
                    return Number(a) - Number(b)
                  })
                  .map((tokenId) => {
                    const shipDetail = allShipsDetails.find(ship => ship.tokenId === tokenId)
                    return (
                      <ShipCard 
                        key={tokenId.toString()} 
                        tokenId={tokenId} 
                        imageId={shipDetail?.imageId}
                      />
                    )
                  })}
              </div>
            </div>
          )}

          {/* Unstaked Ships */}
          {unstakedShips.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-400">
                  Idle Ships ({unstakedShips.length})
                </h3>
                {unstakedShips.length > 1 && (
                  <button
                    onClick={() => setShowBatchStakeModal(true)}
                    className="text-sm px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition-colors"
                  >
                    Batch Stake
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {unstakedShips
                  .sort((a, b) => {
                    const shipA = allShipsDetails.find(ship => ship.tokenId === a)
                    const shipB = allShipsDetails.find(ship => ship.tokenId === b)
                    // Sort by level descending, then by tokenId ascending
                    if (shipA?.level !== shipB?.level) {
                      return (shipB?.level || 0) - (shipA?.level || 0)
                    }
                    return Number(a) - Number(b)
                  })
                  .map((tokenId) => {
                    const shipDetail = allShipsDetails.find(ship => ship.tokenId === tokenId)
                    return (
                      <ShipCard 
                        key={tokenId.toString()} 
                        tokenId={tokenId} 
                        imageId={shipDetail?.imageId}
                      />
                    )
                  })}
              </div>
            </div>
          )}
        </>
      )}


      {/* Batch stake modal */}
      {showBatchStakeModal && (
        <BatchStakeModal
          tokenIds={unstakedShips}
          onClose={() => setShowBatchStakeModal(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  )
}