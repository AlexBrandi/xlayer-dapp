import { useAccount } from 'wagmi'
import { Link } from 'react-router-dom'
import { BattlePowerCard } from '../components/BattlePowerCard'
import { BattlePowerRankings } from '../components/BattlePowerRankings'
import { useBattlePower } from '../hooks/useBattlePower'

export function BattlePower() {
  const { isConnected } = useAccount()
  const battlePowerStats = useBattlePower()

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Battle Power System</h2>
          <p className="text-gray-400 mb-6">Connect wallet to view your power stats</p>
          <div className="glass-card p-8">
            <h3 className="text-lg font-semibold text-blue-400 mb-4">How Battle Power Works</h3>
            <div className="text-left space-y-3 text-sm text-gray-300">
              <p><strong className="text-white">🚀 Ship Power:</strong> Base power calculated from ship rarity and level</p>
              <p><strong className="text-white">💎 Gem Power:</strong> Each gem provides additional power bonus</p>
              <p><strong className="text-white">⚓ Staking Bonus:</strong> Staked ships receive 20% extra power</p>
              <p><strong className="text-white">🚁 Fleet Size Bonus:</strong> Own more ships for fleet scale bonuses</p>
              <p><strong className="text-white">🌟 Diversity Bonus:</strong> Collect different rarities for diversity bonuses</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Battle Power System</h1>
        <p className="text-gray-400">Show your fleet's strength and compete with other commanders</p>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Battle Power Details */}
        <div>
          <BattlePowerCard />
        </div>
        
        {/* Power Rankings */}
        <div>
          <BattlePowerRankings />
        </div>
      </div>

      {/* Power Boost Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-lg font-semibold text-blue-400 mb-2">Upgrade Ships</h3>
          <p className="text-sm text-gray-300 mb-4">Level up ships for higher power multiplier. Level 5 ships have 300% power compared to level 1!</p>
          <Link to="/" className="btn-primary text-sm">
            View Fleet
          </Link>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="text-4xl mb-4">⚓</div>
          <h3 className="text-lg font-semibold text-green-400 mb-2">Stake for Bonus</h3>
          <p className="text-sm text-gray-300 mb-4">Stake your ships for 20% extra power and earn FUEL token rewards!</p>
          <Link to="/" className="btn-primary text-sm">
            Stake Ships
          </Link>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="text-4xl mb-4">💎</div>
          <h3 className="text-lg font-semibold text-purple-400 mb-2">Collect Gems</h3>
          <p className="text-sm text-gray-300 mb-4">Collect gems for extra power. Lithium provides the highest power bonus!</p>
          <Link to="/market" className="btn-primary text-sm">
            Gem Market
          </Link>
        </div>
      </div>

      {/* Power Level System */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-blue-400 mb-4 text-center">Power Level System</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { level: 'Galactic Ruler', power: '50,000+', color: 'from-purple-500 to-pink-500' },
            { level: 'Star Overlord', power: '25,000+', color: 'from-red-500 to-orange-500' },
            { level: 'Fleet Commander', power: '15,000+', color: 'from-yellow-500 to-red-500' },
            { level: 'Space Admiral', power: '8,000+', color: 'from-blue-500 to-purple-500' },
            { level: 'Star Captain', power: '5,000+', color: 'from-green-500 to-blue-500' },
            { level: 'Cruiser Captain', power: '3,000+', color: 'from-teal-500 to-green-500' },
            { level: 'Frigate Captain', power: '1,500+', color: 'from-cyan-500 to-teal-500' },
            { level: 'Recruit Commander', power: '800+', color: 'from-indigo-500 to-cyan-500' },
            { level: 'Cadet Captain', power: '300+', color: 'from-gray-500 to-indigo-500' },
            { level: 'Space Recruit', power: '0+', color: 'from-gray-400 to-gray-500' }
          ].map((tier) => (
            <div 
              key={tier.level} 
              className={`p-4 rounded-lg text-center ${
                battlePowerStats.powerRating === tier.level 
                  ? `bg-gradient-to-r ${tier.color} text-white ring-2 ring-white/50` 
                  : 'bg-gray-800/30'
              }`}
            >
              <div className="text-sm font-semibold mb-1">{tier.level}</div>
              <div className="text-xs text-gray-300">{tier.power}</div>
              {battlePowerStats.powerRating === tier.level && (
                <div className="text-xs mt-2 font-bold">Current Level</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}