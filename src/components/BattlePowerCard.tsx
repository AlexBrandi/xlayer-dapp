import { useBattlePower } from '../hooks/useBattlePower'

export function BattlePowerCard() {
  const battlePowerStats = useBattlePower()

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const getProgressColor = (rating: string) => {
    switch (rating) {
      case 'Galactic Ruler': return 'from-purple-500 to-pink-500'
      case 'Star Overlord': return 'from-red-500 to-orange-500'
      case 'Fleet Commander': return 'from-yellow-500 to-red-500'
      case 'Space Admiral': return 'from-blue-500 to-purple-500'
      case 'Star Captain': return 'from-green-500 to-blue-500'
      case 'Cruiser Captain': return 'from-teal-500 to-green-500'
      case 'Frigate Captain': return 'from-cyan-500 to-teal-500'
      case 'Recruit Commander': return 'from-indigo-500 to-cyan-500'
      case 'Cadet Captain': return 'from-gray-500 to-indigo-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getPowerPercentage = (power: number) => {
    // 基于最高等级(50000)计算百分比，最低显示5%
    return Math.max((power / 50000) * 100, 5)
  }

  return (
    <div className="glass-card p-4 sm:p-5 space-y-3 sm:space-y-4">
      {/* Title and Total Power */}
      <div className="text-center">
        <h3 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">BATTLE POWER</h3>
        <div className="text-2xl sm:text-3xl font-bold text-white mt-1 mb-2">
          {formatNumber(battlePowerStats.totalPower)}
        </div>
        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${getProgressColor(battlePowerStats.powerRating)} text-white font-medium text-xs shadow-lg`}>
          <span className="text-sm">⚡</span>
          {battlePowerStats.powerRating}
        </div>
      </div>

      {/* Power Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Progress</span>
          <span className="font-medium">{Math.floor(getPowerPercentage(battlePowerStats.totalPower))}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${getProgressColor(battlePowerStats.powerRating)} transition-all duration-500`}
            style={{ width: `${getPowerPercentage(battlePowerStats.totalPower)}%` }}
          />
        </div>
      </div>

      {/* Core Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-lg p-2.5 sm:p-3 border border-blue-500/20">
          <div className="flex items-center justify-between px-3">
            <span className="text-base sm:text-lg">🚀</span>
            <div className="text-lg sm:text-xl font-bold text-blue-400">{battlePowerStats.fleetCount}</div>
          </div>
          <div className="text-xs text-gray-400 mt-0.5 px-3">Total Ships</div>
        </div>
        <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 rounded-lg p-2.5 sm:p-3 border border-green-500/20">
          <div className="flex items-center justify-between px-3">
            <span className="text-base sm:text-lg">⚓</span>
            <div className="text-lg sm:text-xl font-bold text-green-400">{battlePowerStats.stakedFleetCount}</div>
          </div>
          <div className="text-xs text-gray-400 mt-0.5 px-3">Staked</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 rounded-lg p-2.5 sm:p-3 border border-yellow-500/20">
          <div className="flex items-center justify-between px-3">
            <span className="text-base sm:text-lg">⭐</span>
            <div className="text-lg sm:text-xl font-bold text-yellow-400">{battlePowerStats.averageLevel}</div>
          </div>
          <div className="text-xs text-gray-400 mt-0.5 px-3">Avg Level</div>
        </div>
        <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 rounded-lg p-2.5 sm:p-3 border border-purple-500/20">
          <div className="flex items-center justify-between px-3">
            <span className="text-base sm:text-lg">💎</span>
            <div className="text-lg sm:text-xl font-bold text-purple-400">{formatNumber(battlePowerStats.gemPower)}</div>
          </div>
          <div className="text-xs text-gray-400 mt-0.5 px-3">Gem Power</div>
        </div>
      </div>

      {/* 详细战力分布 */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Power Breakdown</h4>
        
        {/* 舰船战力分布 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-300">Ship Power</span>
            <span className="text-xs font-bold text-white">{formatNumber(battlePowerStats.shipPower)}</span>
          </div>
          
          {battlePowerStats.detailedBreakdown.ships.legendary.count > 0 && (
            <div className="flex justify-between items-center bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded p-2">
              <div>
                <span className="text-yellow-400 text-xs font-medium">Legendary</span>
                <span className="text-gray-400 text-xs ml-1">×{battlePowerStats.detailedBreakdown.ships.legendary.count}</span>
              </div>
              <div className="text-yellow-400 text-xs font-semibold">
                {formatNumber(Math.floor(battlePowerStats.detailedBreakdown.ships.legendary.power))}
              </div>
            </div>
          )}
          
          {battlePowerStats.detailedBreakdown.ships.epic.count > 0 && (
            <div className="flex justify-between items-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded p-2">
              <div>
                <span className="text-purple-400 text-xs font-medium">Epic</span>
                <span className="text-gray-400 text-xs ml-1">×{battlePowerStats.detailedBreakdown.ships.epic.count}</span>
              </div>
              <div className="text-purple-400 text-xs font-semibold">
                {formatNumber(Math.floor(battlePowerStats.detailedBreakdown.ships.epic.power))}
              </div>
            </div>
          )}
          
          {battlePowerStats.detailedBreakdown.ships.rare.count > 0 && (
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded p-2">
              <div>
                <span className="text-blue-400 text-xs font-medium">Rare</span>
                <span className="text-gray-400 text-xs ml-1">×{battlePowerStats.detailedBreakdown.ships.rare.count}</span>
              </div>
              <div className="text-blue-400 text-xs font-semibold">
                {formatNumber(Math.floor(battlePowerStats.detailedBreakdown.ships.rare.power))}
              </div>
            </div>
          )}
          
          {battlePowerStats.detailedBreakdown.ships.common.count > 0 && (
            <div className="flex justify-between items-center bg-gradient-to-r from-gray-900/30 to-gray-800/30 rounded p-2">
              <div>
                <span className="text-gray-400 text-xs font-medium">Common</span>
                <span className="text-gray-500 text-xs ml-1">×{battlePowerStats.detailedBreakdown.ships.common.count}</span>
              </div>
              <div className="text-gray-400 text-xs font-semibold">
                {formatNumber(Math.floor(battlePowerStats.detailedBreakdown.ships.common.power))}
              </div>
            </div>
          )}
        </div>

        {/* 宝石战力分布 */}
        {battlePowerStats.gemPower > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-300">Gem Power</span>
              <span className="text-xs font-bold text-white">{formatNumber(battlePowerStats.gemPower)}</span>
            </div>
            
            {battlePowerStats.detailedBreakdown.gems.lithium.count > 0 && (
              <div className="flex justify-between items-center bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded p-2">
                <div>
                  <span className="text-green-400 text-xs font-medium">Lithium</span>
                  <span className="text-gray-400 text-xs ml-1">×{battlePowerStats.detailedBreakdown.gems.lithium.count}</span>
                </div>
                <div className="text-green-400 text-xs font-semibold">
                  {formatNumber(battlePowerStats.detailedBreakdown.gems.lithium.power)}
                </div>
              </div>
            )}
            
            {battlePowerStats.detailedBreakdown.gems.sunstone.count > 0 && (
              <div className="flex justify-between items-center bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded p-2">
                <div>
                  <span className="text-orange-400 text-xs font-medium">Sunstone</span>
                  <span className="text-gray-400 text-xs ml-1">×{battlePowerStats.detailedBreakdown.gems.sunstone.count}</span>
                </div>
                <div className="text-orange-400 text-xs font-semibold">
                  {formatNumber(battlePowerStats.detailedBreakdown.gems.sunstone.power)}
                </div>
              </div>
            )}
            
            {battlePowerStats.detailedBreakdown.gems.sapphire.count > 0 && (
              <div className="flex justify-between items-center bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded p-2">
                <div>
                  <span className="text-blue-400 text-xs font-medium">Sapphire</span>
                  <span className="text-gray-400 text-xs ml-1">×{battlePowerStats.detailedBreakdown.gems.sapphire.count}</span>
                </div>
                <div className="text-blue-400 text-xs font-semibold">
                  {formatNumber(battlePowerStats.detailedBreakdown.gems.sapphire.power)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 加成效果 */}
        {(battlePowerStats.detailedBreakdown.bonuses.stakingBonus > 0 || 
          battlePowerStats.detailedBreakdown.bonuses.fleetSizeBonus > 0 || 
          battlePowerStats.detailedBreakdown.bonuses.diversityBonus > 0) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-300">Special Bonuses</span>
              <span className="text-xs font-bold text-white">+{formatNumber(battlePowerStats.detailedBreakdown.bonuses.stakingBonus + battlePowerStats.detailedBreakdown.bonuses.fleetSizeBonus + battlePowerStats.detailedBreakdown.bonuses.diversityBonus)}</span>
            </div>
            
            {battlePowerStats.detailedBreakdown.bonuses.stakingBonus > 0 && (
              <div className="flex justify-between items-center bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded p-2">
                <span className="text-emerald-400 text-xs font-medium">Staking Bonus (+20%)</span>
                <div className="text-emerald-400 text-xs font-semibold">
                  +{formatNumber(battlePowerStats.detailedBreakdown.bonuses.stakingBonus)}
                </div>
              </div>
            )}
            
            {battlePowerStats.detailedBreakdown.bonuses.fleetSizeBonus > 0 && (
              <div className="flex justify-between items-center bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded p-2">
                <span className="text-cyan-400 text-xs font-medium">Fleet Size Bonus</span>
                <div className="text-cyan-400 text-xs font-semibold">
                  +{formatNumber(battlePowerStats.detailedBreakdown.bonuses.fleetSizeBonus)}
                </div>
              </div>
            )}
            
            {battlePowerStats.detailedBreakdown.bonuses.diversityBonus > 0 && (
              <div className="flex justify-between items-center bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded p-2">
                <span className="text-pink-400 text-xs font-medium">Diversity Bonus</span>
                <div className="text-pink-400 text-xs font-semibold">
                  +{formatNumber(battlePowerStats.detailedBreakdown.bonuses.diversityBonus)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Power Tips */}
      <div className="bg-gradient-to-r from-indigo-900/10 to-purple-900/10 rounded-lg p-3 border border-indigo-500/20">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-sm">💯</span>
          <h4 className="text-xs font-medium text-indigo-400 uppercase tracking-wider">Tips</h4>
        </div>
        <ul className="text-xs text-gray-300 space-y-1">
          {battlePowerStats.stakedFleetCount < battlePowerStats.fleetCount && (
            <li className="flex items-start gap-1.5">
              <span className="text-green-400">•</span>
              <span>Stake more ships for 20% power bonus</span>
            </li>
          )}
          {battlePowerStats.averageLevel < 3 && (
            <li className="flex items-start gap-1.5">
              <span className="text-yellow-400">•</span>
              <span>Upgrade ships for higher power multiplier</span>
            </li>
          )}
          {battlePowerStats.fleetCount < 10 && (
            <li className="flex items-start gap-1.5">
              <span className="text-blue-400">•</span>
              <span>Mint more ships for fleet size bonus</span>
            </li>
          )}
          {battlePowerStats.gemPower === 0 && (
            <li className="flex items-start gap-1.5">
              <span className="text-purple-400">•</span>
              <span>Buy gems for additional power</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}