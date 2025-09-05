import { useBattlePower } from '../hooks/useBattlePower'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { useAccount } from 'wagmi'

interface RankingEntry {
  address: string
  battlePower: number
  powerRating: string
  fleetCount: number
  averageLevel: number
}

export function BattlePowerRankings() {
  const { address } = useAccount()
  const currentStats = useBattlePower()
  const { leaderboard, isLoading } = useLeaderboard()

  // 将当前用户添加到排行榜中
  const rankingsWithUser: RankingEntry[] = address ? [
    ...leaderboard,
    {
      address,
      battlePower: currentStats.totalPower,
      powerRating: currentStats.powerRating,
      fleetCount: currentStats.fleetCount,
      averageLevel: currentStats.averageLevel
    }
  ].sort((a, b) => b.battlePower - a.battlePower) : leaderboard

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '👑'
      case 2: return '🥈' 
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400'
      case 2: return 'text-gray-400'
      case 3: return 'text-orange-400'
      default: return 'text-gray-500'
    }
  }

  const getPowerRatingColor = (rating: string) => {
    switch (rating) {
      case 'Galactic Ruler': return 'text-purple-400'
      case 'Star Overlord': return 'text-red-400'
      case 'Fleet Commander': return 'text-yellow-400'
      case 'Space Admiral': return 'text-blue-400'
      case 'Star Captain': return 'text-green-400'
      case 'Cruiser Captain': return 'text-teal-400'
      case 'Frigate Captain': return 'text-cyan-400'
      case 'Recruit Commander': return 'text-indigo-400'
      case 'Cadet Captain': return 'text-gray-400'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-blue-400">Power Rankings</h3>
          <p className="text-xs text-gray-400 mt-1">Global Leaderboard</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Live
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-400">
            {rankingsWithUser.findIndex(r => r.address === address) + 1}
          </div>
          <div className="text-xs text-gray-400">My Rank</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-400">
            {formatNumber(currentStats.totalPower)}
          </div>
          <div className="text-xs text-gray-400">My Power</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-yellow-400">
            {Math.round((rankingsWithUser.length - rankingsWithUser.findIndex(r => r.address === address)) / rankingsWithUser.length * 100)}%
          </div>
          <div className="text-xs text-gray-400">Top %</div>
        </div>
      </div>

      {/* Rankings List */}
      <div className="space-y-3">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-800/30 rounded-lg p-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-700 rounded"></div>
                    <div className="space-y-1">
                      <div className="w-24 h-4 bg-gray-700 rounded"></div>
                      <div className="w-32 h-3 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div className="w-16 h-4 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          rankingsWithUser.slice(0, 10).map((entry, index) => {
          const rank = index + 1
          const isCurrentUser = entry.address === address
          
          return (
            <div 
              key={entry.address} 
              className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                isCurrentUser 
                  ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 ring-2 ring-blue-500/50' 
                  : 'bg-gray-800/30 hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className={`text-xl font-bold ${getRankColor(rank)} min-w-[3rem] text-center`}>
                  {getRankIcon(rank)}
                </div>
                
                {/* User Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${isCurrentUser ? 'text-blue-400' : 'text-white'}`}>
                      {formatAddress(entry.address)}
                    </span>
                    {isCurrentUser && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs font-medium ${getPowerRatingColor(entry.powerRating)}`}>
                      {entry.powerRating}
                    </span>
                    <span className="text-xs text-gray-500">
                      {entry.fleetCount} Ships
                    </span>
                    <span className="text-xs text-gray-500">
                      Avg Lv.{entry.averageLevel}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Power Value */}
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-400">
                  {formatNumber(entry.battlePower)}
                </div>
                <div className="text-xs text-gray-400">
                  Power
                </div>
              </div>
            </div>
          )
        })
        )}
      </div>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg">
        <div className="text-sm text-purple-400 font-medium mb-2">💫 Ranking Info</div>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Power calculated from ships, levels, rarity and gems</li>
          <li>• Staked ships receive 20% power bonus</li>
          <li>• {isLoading ? 'Loading real-time data...' : 'Rankings update every hour'}</li>
          <li>• Level up and collect rare ships to climb ranks</li>
          {!isLoading && (
            <li className="text-yellow-400">• Currently showing sample data - full blockchain integration in progress</li>
          )}
        </ul>
      </div>
    </div>
  )
}