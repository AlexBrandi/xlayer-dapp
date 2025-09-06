import { useTestLeaderboard } from '../hooks/useTestLeaderboard'
import { useAccount } from 'wagmi'

export function RealBattlePowerRankings() {
  const { address } = useAccount()
  const { leaderboard, isLoading, debugInfo } = useTestLeaderboard()

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

  const getPowerColor = (rating: string) => {
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

  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <h3 className="text-xl font-bold text-white">正在测试链上数据获取...</h3>
          </div>
          
          <div className="text-sm text-gray-400">
            {debugInfo}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            🏆 真实链上战力排行榜
          </h3>
          <div className="text-sm text-gray-400">
            共 {leaderboard.length} 位玩家
          </div>
        </div>
        <p className="text-xs text-green-400 mt-1">
          ✅ 基于实时链上数据计算
        </p>
      </div>

      <div className="divide-y divide-gray-700">
        {leaderboard.slice(0, 20).map((entry, index) => {
          const rank = index + 1
          const isCurrentUser = address?.toLowerCase() === entry.address.toLowerCase()
          
          return (
            <div 
              key={entry.address}
              className={`p-4 hover:bg-gray-800/50 transition-colors ${
                isCurrentUser ? 'bg-blue-900/20 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`text-lg font-bold ${getRankColor(rank)} min-w-[3rem]`}>
                    {getRankIcon(rank)}
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-sm ${isCurrentUser ? 'text-blue-400 font-bold' : 'text-white'}`}>
                        {formatAddress(entry.address)}
                      </span>
                      {isCurrentUser && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{entry.fleetCount} Ships</span>
                      <span>Lv.{entry.averageLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-white text-lg">
                    {formatNumber(entry.battlePower)}
                  </div>
                  <div className={`text-xs font-medium ${getPowerColor(entry.powerRating)}`}>
                    {entry.powerRating}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {leaderboard.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p>暂无排行榜数据</p>
        </div>
      )}

      <div className="p-4 border-t border-gray-700 text-center">
        <button 
          onClick={() => window.location.reload()}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          🔄 刷新排行榜数据
        </button>
      </div>
    </div>
  )
}