import { useMemo } from 'react'
import { useShips } from './useShips'
import { useGems } from './useGems'
import { Rarity } from '../types'

// 战力计算系统
export interface BattlePowerStats {
  totalPower: number
  shipPower: number
  gemPower: number
  fleetCount: number
  stakedFleetCount: number
  averageLevel: number
  powerRating: string
  detailedBreakdown: {
    ships: {
      common: { count: number; power: number }
      rare: { count: number; power: number }
      epic: { count: number; power: number }
      legendary: { count: number; power: number }
    }
    gems: {
      sapphire: { count: number; power: number }
      sunstone: { count: number; power: number }
      lithium: { count: number; power: number }
    }
    bonuses: {
      stakingBonus: number
      fleetSizeBonus: number
      diversityBonus: number
    }
  }
}

// 战力配置
const BATTLE_POWER_CONFIG = {
  // 基础舰船战力 (按稀有度)
  BASE_SHIP_POWER: {
    [Rarity.Common]: 100,     // 普通 - Cavendi
    [Rarity.Rare]: 200,       // 稀有 - Terror  
    [Rarity.Epic]: 400,       // 史诗 - Maria, Pearl
    [Rarity.Legendary]: 800   // 传说
  },
  
  // 等级加成 (每级增加基础战力的百分比)
  LEVEL_MULTIPLIER: {
    1: 1.0,   // 100%
    2: 1.3,   // 130%
    3: 1.7,   // 170%
    4: 2.2,   // 220%
    5: 3.0    // 300%
  },
  
  // 宝石战力
  GEM_POWER: {
    sapphire: 50,   // 蓝宝石 - 每个50战力
    sunstone: 75,   // 日光石 - 每个75战力
    lithium: 100    // 锂石 - 每个100战力
  },
  
  // 加成系统
  BONUSES: {
    // 质押加成 (质押的舰船获得额外20%战力)
    STAKING_BONUS: 0.2,
    
    // 舰队规模加成 (每5艘船增加5%总战力，最高50%)
    FLEET_SIZE_BONUS: {
      rate: 0.05,
      perShips: 5,
      maxBonus: 0.5
    },
    
    // 多样性加成 (拥有不同稀有度的船只获得加成)
    DIVERSITY_BONUS: {
      2: 0.05,  // 2种稀有度: +5%
      3: 0.10,  // 3种稀有度: +10%
      4: 0.20   // 4种稀有度: +20%
    }
  }
}

// 获取舰船稀有度 (基于imageId)
function getShipRarity(imageId: number): number {
  // 根据白皮书中的舰船分类
  if (imageId === 0) return Rarity.Common      // Cavendi - 普通
  if (imageId === 1) return Rarity.Rare        // Terror - 稀有  
  if (imageId === 2 || imageId === 3) return Rarity.Epic // Maria, Pearl - 史诗
  return Rarity.Legendary // 其他为传说
}

// 获取战力等级描述
function getPowerRating(totalPower: number): string {
  if (totalPower >= 50000) return 'Galactic Ruler'
  if (totalPower >= 25000) return 'Star Overlord'
  if (totalPower >= 15000) return 'Fleet Commander'
  if (totalPower >= 8000) return 'Space Admiral'
  if (totalPower >= 5000) return 'Star Captain'
  if (totalPower >= 3000) return 'Cruiser Captain'
  if (totalPower >= 1500) return 'Frigate Captain'
  if (totalPower >= 800) return 'Recruit Commander'
  if (totalPower >= 300) return 'Cadet Captain'
  return 'Space Recruit'
}

export function useBattlePower(): BattlePowerStats {
  const { useAllShipsDetails, stakedShips } = useShips()
  const shipsDetails = useAllShipsDetails()
  const { balances } = useGems()

  return useMemo(() => {
    // 1. 计算舰船战力
    const shipBreakdown = {
      common: { count: 0, power: 0 },
      rare: { count: 0, power: 0 },
      epic: { count: 0, power: 0 },
      legendary: { count: 0, power: 0 }
    }

    let totalShipPower = 0
    let totalLevels = 0
    const raritySet = new Set<number>()

    shipsDetails.forEach(ship => {
      const rarity = getShipRarity(ship.imageId)
      const basePower = BATTLE_POWER_CONFIG.BASE_SHIP_POWER[rarity as keyof typeof BATTLE_POWER_CONFIG.BASE_SHIP_POWER] || 100
      const levelMultiplier = BATTLE_POWER_CONFIG.LEVEL_MULTIPLIER[ship.level as keyof typeof BATTLE_POWER_CONFIG.LEVEL_MULTIPLIER] || 1
      let shipPower = basePower * levelMultiplier

      // 质押加成
      if (ship.isStaked) {
        shipPower *= (1 + BATTLE_POWER_CONFIG.BONUSES.STAKING_BONUS)
      }

      totalShipPower += shipPower
      totalLevels += ship.level
      raritySet.add(rarity)

      // 分类统计
      const rarityName = rarity === Rarity.Common ? 'common' : 
                        rarity === Rarity.Rare ? 'rare' :
                        rarity === Rarity.Epic ? 'epic' : 'legendary'
      shipBreakdown[rarityName].count++
      shipBreakdown[rarityName].power += shipPower
    })

    // 2. 计算宝石战力
    const gemBreakdown = {
      sapphire: {
        count: Number(balances?.sapphire || 0n),
        power: Number(balances?.sapphire || 0n) * BATTLE_POWER_CONFIG.GEM_POWER.sapphire
      },
      sunstone: {
        count: Number(balances?.sunstone || 0n),
        power: Number(balances?.sunstone || 0n) * BATTLE_POWER_CONFIG.GEM_POWER.sunstone
      },
      lithium: {
        count: Number(balances?.lithium || 0n),
        power: Number(balances?.lithium || 0n) * BATTLE_POWER_CONFIG.GEM_POWER.lithium
      }
    }

    const totalGemPower = gemBreakdown.sapphire.power + gemBreakdown.sunstone.power + gemBreakdown.lithium.power

    // 3. 计算加成
    const fleetCount = shipsDetails.length
    const stakedCount = stakedShips.length

    // 舰队规模加成
    const fleetSizeBonus = Math.min(
      Math.floor(fleetCount / BATTLE_POWER_CONFIG.BONUSES.FLEET_SIZE_BONUS.perShips) * BATTLE_POWER_CONFIG.BONUSES.FLEET_SIZE_BONUS.rate,
      BATTLE_POWER_CONFIG.BONUSES.FLEET_SIZE_BONUS.maxBonus
    )

    // 多样性加成
    const diversityBonusMap: { [key: number]: number } = BATTLE_POWER_CONFIG.BONUSES.DIVERSITY_BONUS
    const diversityBonus = diversityBonusMap[raritySet.size] || 0

    // 4. 计算总战力
    const basePower = totalShipPower + totalGemPower
    const bonusPower = basePower * (fleetSizeBonus + diversityBonus)
    const totalPower = Math.floor(basePower + bonusPower)

    // 5. 其他统计
    // Use shipsDetails.length for average level calculation since that's what we have level data for
    const averageLevel = shipsDetails.length > 0 ? totalLevels / shipsDetails.length : 0
    const powerRating = getPowerRating(totalPower)

    return {
      totalPower,
      shipPower: Math.floor(totalShipPower),
      gemPower: Math.floor(totalGemPower),
      fleetCount,
      stakedFleetCount: stakedCount,
      averageLevel: Math.round(averageLevel * 10) / 10,
      powerRating,
      detailedBreakdown: {
        ships: shipBreakdown,
        gems: gemBreakdown,
        bonuses: {
          stakingBonus: Math.floor(totalShipPower * BATTLE_POWER_CONFIG.BONUSES.STAKING_BONUS * stakedCount / fleetCount),
          fleetSizeBonus: Math.floor(basePower * fleetSizeBonus),
          diversityBonus: Math.floor(basePower * diversityBonus)
        }
      }
    }
  }, [shipsDetails, stakedShips, balances])
}