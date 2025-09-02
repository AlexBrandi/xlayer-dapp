import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ShipCard } from '../components/ShipCard'
import { BatchStakeModal } from '../components/BatchStakeModal'
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

  // 调试信息已隐藏
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
          <h2 className="text-2xl font-bold mb-4">欢迎来到舰队 DApp</h2>
          <p className="text-gray-400 mb-6">连接您的钱包以查看您的舰队</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Debug Panel - 隐藏调试信息 */}
      {/* <DebugPanel /> */}
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {/* FUEL Balance */}
        <div className="glass-card p-4">
          <h3 className="text-xs text-gray-400 mb-1">FUEL 余额</h3>
          <p className="text-lg font-bold text-green-400">
            {fuelBalance ? formatEther(fuelBalance as bigint) : '0'} FUEL
          </p>
        </div>

        {/* Pending Rewards */}
        <div className="glass-card p-4">
          <h3 className="text-xs text-gray-400 mb-1">待领取奖励</h3>
          <p className="text-lg font-bold text-yellow-400">
            {totalPendingFormatted} FUEL
          </p>
        </div>

        {/* Ships Status */}
        <div className="glass-card p-4">
          <h3 className="text-xs text-gray-400 mb-1">战舰状态</h3>
          <div className="flex gap-3">
            <div>
              <p className="text-xs text-gray-500">质押中</p>
              <p className="text-base font-bold text-blue-400">{stakedShips.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">闲置</p>
              <p className="text-base font-bold text-gray-400">{unstakedShips.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">总计</p>
              <p className="text-base font-bold">{allShips.length}</p>
            </div>
          </div>
        </div>

        {/* Gem Balance */}
        <div className="glass-card p-4">
          <h3 className="text-xs text-gray-400 mb-1">宝石余额</h3>
          <div className="flex gap-2">
            <div className="text-center">
              <p className="text-xs text-gray-500">蓝宝石</p>
              <p className="text-sm font-bold text-blue-400">{balances.sapphire.toString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">太阳石</p>
              <p className="text-sm font-bold text-orange-400">{balances.sunstone.toString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">锂矿石</p>
              <p className="text-sm font-bold text-purple-400">{balances.lithium.toString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">我的舰队</h2>
        <div className="flex gap-2">
          <button
            onClick={handleClaimAll}
            disabled={!totalPending || totalPending === 0n || isClaimPending}
            className="btn-primary bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-sm"
          >
            {isClaimPending ? '领取中...' : '领取所有奖励'}
          </button>
          <button onClick={handleRefresh} className="btn-secondary text-sm">
            刷新
          </button>
        </div>
      </div>

      {/* Ships Display */}
      {allShips.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-400 mb-4">您还没有任何战舰</p>
          <a href="/mint" className="btn-primary">
            铸造您的第一艘战舰
          </a>
        </div>
      ) : (
        <>
          {/* Staked Ships */}
          {stakedShips.length > 0 && (
            <div className="mb-8">
              <h3 className="text-base font-semibold mb-3 text-blue-400">
                质押中的战舰 ({stakedShips.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {stakedShips.map((tokenId) => {
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
                  闲置的战舰 ({unstakedShips.length})
                </h3>
                {unstakedShips.length > 1 && (
                  <button
                    onClick={() => setShowBatchStakeModal(true)}
                    className="text-sm px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition-colors"
                  >
                    批量质押
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {unstakedShips.map((tokenId) => {
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


      {/* 批量质押模态框 */}
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