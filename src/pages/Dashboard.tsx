import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ShipCard } from '../components/ShipCard'
import { formatTokenAmount } from '../lib/format'
import { useShipsPaginated } from '../hooks/useShips'
import { useRewards } from '../hooks/useRewards'
import { useContracts } from '../hooks/useContracts'

export function Dashboard() {
  const { isConnected } = useAccount()
  const [currentPage, setCurrentPage] = useState(0)
  const [, setRefreshKey] = useState(0)
  
  const { ships, isLoading, totalPages, totalShips } = useShipsPaginated(currentPage, 8)
  const { totalClaimable, estimatedRewards, claimableTokenIds, hasClaimableRewards } = useRewards()
  const { useClaimBatch } = useContracts()
  const { claimBatch, isPending: isClaimingAll } = useClaimBatch()

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleClaimAll = async () => {
    if (claimableTokenIds.length > 0) {
      await claimBatch(claimableTokenIds)
      handleRefresh()
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Ship Fleet DApp</h2>
          <p className="text-gray-400 mb-6">Connect your wallet to view your fleet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Rewards Section */}
      <div className="glass-card p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Claimable Rewards</h2>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <div>
                <p className="text-sm text-gray-400">Ready to Claim</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatTokenAmount(totalClaimable)} $FUEL
                </p>
              </div>
              {estimatedRewards > BigInt(0) && (
                <div>
                  <p className="text-sm text-gray-400">Estimated (Voyaging)</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    ~{formatTokenAmount(estimatedRewards)} $FUEL
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleClaimAll}
            disabled={!hasClaimableRewards || isClaimingAll}
            className="btn-primary bg-green-600 hover:bg-green-700 disabled:bg-gray-700"
          >
            {isClaimingAll ? 'Claiming All...' : 'Batch Claim All'}
          </button>
        </div>
      </div>

      {/* Fleet Section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">My Fleet ({totalShips} Ships)</h2>
        <button onClick={handleRefresh} className="btn-secondary text-sm">
          Refresh
        </button>
      </div>

      {/* Ships Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-4" />
              <div className="h-48 bg-gray-700 rounded mb-4" />
              <div className="h-4 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : ships.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-400 mb-4">You don't have any ships yet</p>
          <a href="/mint" className="btn-primary">
            Mint Your First Ship
          </a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {ships.map((ship) => (
              <ShipCard key={ship.tokenId.toString()} ship={ship} onRefresh={handleRefresh} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="btn-secondary"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === i
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}