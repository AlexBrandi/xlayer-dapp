import { useBattlePower } from '../hooks/useBattlePower'
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

  // Mock leaderboard data (in real app, this would come from backend API or on-chain queries)
  const mockRankings: RankingEntry[] = [
    { address: '0x1234...5678', battlePower: 45230, powerRating: 'Star Overlord', fleetCount: 25, averageLevel: 4.2 },
    { address: '0x8765...4321', battlePower: 32100, powerRating: 'Fleet Commander', fleetCount: 18, averageLevel: 3.8 },
    { address: '0x9999...1111', battlePower: 28500, powerRating: 'Fleet Commander', fleetCount: 20, averageLevel: 3.5 },
    { address: '0x2222...3333', battlePower: 22100, powerRating: 'Space Admiral', fleetCount: 15, averageLevel: 3.7 },
    { address: '0x4444...6666', battlePower: 18900, powerRating: 'Space Admiral', fleetCount: 12, averageLevel: 4.1 },
  ]

  // 将当前用户添加到排行榜中
  const rankingsWithUser: RankingEntry[] = address ? [
    ...mockRankings,
    {
      address,
      battlePower: currentStats.totalPower,
      powerRating: currentStats.powerRating,
      fleetCount: currentStats.fleetCount,
      averageLevel: currentStats.averageLevel
    }
  ].sort((a, b) => b.battlePower - a.battlePower) : mockRankings

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
        {rankingsWithUser.slice(0, 10).map((entry, index) => {
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
        })}
      </div>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg">
        <div className="text-sm text-purple-400 font-medium mb-2">💫 Ranking Info</div>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Power calculated from ships, levels, rarity and gems</li>
          <li>• Staked ships receive 20% power bonus</li>
          <li>• Rankings update every hour</li>
          <li>• Level up and collect rare ships to climb ranks</li>
        </ul>
      </div>
    </div>
  )
}