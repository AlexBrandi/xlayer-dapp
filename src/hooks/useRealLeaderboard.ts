import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { CONTRACT_ADDRESSES } from '../lib/config'
import { SHIP_ABI, GAME_ABI, GEM_ABI } from '../lib/contractAbis'
import { Rarity } from '../types'

interface RealLeaderboardEntry {
  address: string
  battlePower: number
  powerRating: string
  fleetCount: number
  averageLevel: number
}

// 战力配置 - 与useBattlePower.ts保持一致
const BATTLE_POWER_CONFIG = {
  BASE_SHIP_POWER: {
    [Rarity.Common]: 100,
    [Rarity.Rare]: 200,
    [Rarity.Epic]: 400,
    [Rarity.Legendary]: 800
  },
  LEVEL_MULTIPLIER: {
    1: 1.0,
    2: 1.3,
    3: 1.7,
    4: 2.2,
    5: 3.0
  },
  GEM_POWER: {
    sapphire: 50,
    sunstone: 75,
    lithium: 100
  },
  BONUSES: {
    STAKING_BONUS: 0.2,
    FLEET_SIZE_BONUS: {
      rate: 0.05,
      perShips: 5,
      maxBonus: 0.5
    },
    DIVERSITY_BONUS: {
      2: 0.05,
      3: 0.10,
      4: 0.20
    }
  }
}

// 获取舰船稀有度
function getShipRarity(imageId: number): number {
  if (imageId >= 0 && imageId <= 4) return Rarity.Common
  if (imageId >= 5 && imageId <= 8) return Rarity.Rare
  if (imageId >= 9 && imageId <= 12) return Rarity.Epic
  if (imageId >= 13 && imageId <= 14) return Rarity.Legendary
  return Rarity.Common
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

export function useRealLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<RealLeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [totalHolders, setTotalHolders] = useState(0)
  
  const publicClient = usePublicClient()

  useEffect(() => {
    let isCancelled = false

    const fetchRealLeaderboard = async () => {
      if (!publicClient) return

      try {
        setIsLoading(true)
        setProgress(0)

        console.log('🔍 开始获取所有NFT持有者...')
        console.log('合约地址:', CONTRACT_ADDRESSES.SHIP_NFT)
        
        // 步骤1: 获取总供应量
        const totalSupply = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.SHIP_NFT,
          abi: SHIP_ABI,
          functionName: 'totalSupply'
        }) as bigint

        const totalTokens = Number(totalSupply)
        console.log(`📊 总NFT数量: ${totalTokens}`)

        if (totalTokens === 0) {
          console.error('❌ 总供应量为0，无法获取排行榜数据')
          setLeaderboard([])
          setIsLoading(false)
          return
        }

        // 为了快速测试，先限制扫描范围到前100个token
        const scanLimit = Math.min(totalTokens, 100)
        console.log(`🚀 测试模式：仅扫描前 ${scanLimit} 个 NFT`)

        // 步骤2: 批量获取所有token的持有者
        const batchSize = 50 // 每批查询50个token
        const holders = new Map<string, bigint[]>() // address -> tokenIds[]

        for (let i = 1; i <= scanLimit; i += batchSize) {
          if (isCancelled) return

          const batch = []
          const endIndex = Math.min(i + batchSize - 1, scanLimit)
          
          // 创建批量查询
          for (let tokenId = i; tokenId <= endIndex; tokenId++) {
            batch.push(
              publicClient.readContract({
                address: CONTRACT_ADDRESSES.SHIP_NFT,
                abi: SHIP_ABI,
                functionName: 'ownerOf',
                args: [BigInt(tokenId)]
              }).catch(() => null) // 忽略错误的token
            )
          }

          try {
            const batchResults = await Promise.allSettled(batch)
            
            let successCount = 0
            batchResults.forEach((result, index) => {
              const tokenId = BigInt(i + index)
              if (result.status === 'fulfilled' && result.value) {
                const owner = result.value as string
                
                if (!holders.has(owner)) {
                  holders.set(owner, [])
                }
                holders.get(owner)!.push(tokenId)
                successCount++
              } else if (result.status === 'rejected') {
                console.warn(`Token ${tokenId} 查询失败:`, result.reason)
              }
            })
            
            console.log(`批次 ${i}-${endIndex}: ${successCount}/${batch.length} 成功`)

            setProgress(Math.floor((endIndex / scanLimit) * 50)) // 前50%进度用于获取持有者
            console.log(`📈 已处理 ${endIndex}/${totalTokens} tokens`)
          } catch (error) {
            console.error(`批次 ${i}-${endIndex} 查询失败:`, error)
          }

          // 添加小延迟避免过于频繁的请求
          await new Promise(resolve => setTimeout(resolve, 100))
        }

        const uniqueHolders = Array.from(holders.keys())
        setTotalHolders(uniqueHolders.length)
        console.log(`👥 发现 ${uniqueHolders.length} 个独特持有者`)
        console.log('持有者列表:', uniqueHolders.slice(0, 5)) // 显示前5个持有者

        if (uniqueHolders.length === 0) {
          console.error('❌ 没有找到任何NFT持有者')
          setLeaderboard([])
          setIsLoading(false)
          return
        }

        // 步骤3: 为每个持有者计算战力
        const leaderboardData: RealLeaderboardEntry[] = []
        
        for (let holderIndex = 0; holderIndex < uniqueHolders.length; holderIndex++) {
          if (isCancelled) return

          const address = uniqueHolders[holderIndex]
          const tokenIds = holders.get(address)!

          try {
            // 获取用户的NFT状态
            const userStatus = await publicClient.readContract({
              address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
              abi: GAME_ABI,
              functionName: 'getAllNFTsStatus',
              args: [address as `0x${string}`]
            }) as [bigint[], bigint[], bigint[]]

            // 暂时跳过宝石余额查询以提高速度，先专注于船只战力
            const sapphireBalance = 0n
            const sunstoneBalance = 0n
            const lithiumBalance = 0n

            // 计算战力
            const battlePower = calculateUserBattlePower({
              allNFTs: userStatus[0],
              stakedNFTs: userStatus[1],
              unstakedNFTs: userStatus[2]
            }, {
              sapphire: sapphireBalance as bigint,
              sunstone: sunstoneBalance as bigint,
              lithium: lithiumBalance as bigint
            })

            // 调试信息
            if (holderIndex < 5) { // 只对前5个用户输出调试信息
              console.log(`用户 ${address}:`, {
                allNFTs: userStatus[0].length,
                stakedNFTs: userStatus[1].length,
                battlePower: battlePower.totalPower,
                fleetCount: battlePower.fleetCount
              })
            }

            if (battlePower.totalPower > 0) {
              leaderboardData.push({
                address,
                battlePower: battlePower.totalPower,
                powerRating: battlePower.powerRating,
                fleetCount: battlePower.fleetCount,
                averageLevel: battlePower.averageLevel
              })
            }

          } catch (error) {
            console.error(`计算用户 ${address} 战力失败:`, error)
          }

          // 更新进度 (50% + 50% * holderIndex / uniqueHolders.length)
          const currentProgress = 50 + Math.floor((holderIndex / uniqueHolders.length) * 50)
          setProgress(currentProgress)

          // 添加延迟避免请求过于频繁
          await new Promise(resolve => setTimeout(resolve, 200))
        }

        // 按战力排序
        leaderboardData.sort((a, b) => b.battlePower - a.battlePower)
        
        console.log(`✅ 排行榜计算完成! 共 ${leaderboardData.length} 个有效用户`)
        setLeaderboard(leaderboardData)
        setProgress(100)
        setIsLoading(false)

      } catch (error) {
        console.error('获取排行榜数据失败:', error)
        setIsLoading(false)
      }
    }

    fetchRealLeaderboard()

    return () => {
      isCancelled = true
    }
  }, [publicClient])

  return {
    leaderboard,
    isLoading,
    progress,
    totalHolders,
    refetch: () => {
      // 重新获取数据
      window.location.reload()
    }
  }
}

// 计算用户战力的辅助函数
function calculateUserBattlePower(
  userStatus: { allNFTs: bigint[], stakedNFTs: bigint[], unstakedNFTs: bigint[] },
  gemBalances: { sapphire: bigint, sunstone: bigint, lithium: bigint }
) {
  const fleetCount = userStatus.allNFTs.length
  if (fleetCount === 0) {
    return {
      totalPower: 0,
      powerRating: 'Space Recruit',
      fleetCount: 0,
      averageLevel: 0
    }
  }

  let totalShipPower = 0
  let totalLevels = 0
  const raritySet = new Set<number>()

  // 计算船只战力
  userStatus.allNFTs.forEach(tokenId => {
    const tokenNum = Number(tokenId)
    const imageId = tokenNum <= 20 ? (tokenNum - 1) % 15 : (tokenNum - 1787) % 15
    const rarity = getShipRarity(imageId)
    
    const basePower = BATTLE_POWER_CONFIG.BASE_SHIP_POWER[rarity as keyof typeof BATTLE_POWER_CONFIG.BASE_SHIP_POWER] || 100
    const level = 1 // 默认等级1
    const levelMultiplier = BATTLE_POWER_CONFIG.LEVEL_MULTIPLIER[level as keyof typeof BATTLE_POWER_CONFIG.LEVEL_MULTIPLIER] || 1
    let shipPower = basePower * levelMultiplier

    // 质押加成
    if (userStatus.stakedNFTs.includes(tokenId)) {
      shipPower *= (1 + BATTLE_POWER_CONFIG.BONUSES.STAKING_BONUS)
    }

    totalShipPower += shipPower
    totalLevels += level
    raritySet.add(rarity)
  })

  // 计算宝石战力
  const totalGemPower = 
    Number(gemBalances.sapphire) * BATTLE_POWER_CONFIG.GEM_POWER.sapphire +
    Number(gemBalances.sunstone) * BATTLE_POWER_CONFIG.GEM_POWER.sunstone +
    Number(gemBalances.lithium) * BATTLE_POWER_CONFIG.GEM_POWER.lithium

  // 计算加成
  const fleetSizeBonus = Math.min(
    Math.floor(fleetCount / BATTLE_POWER_CONFIG.BONUSES.FLEET_SIZE_BONUS.perShips) * BATTLE_POWER_CONFIG.BONUSES.FLEET_SIZE_BONUS.rate,
    BATTLE_POWER_CONFIG.BONUSES.FLEET_SIZE_BONUS.maxBonus
  )

  const diversityBonusMap: { [key: number]: number } = BATTLE_POWER_CONFIG.BONUSES.DIVERSITY_BONUS
  const diversityBonus = diversityBonusMap[raritySet.size] || 0

  // 计算总战力
  const basePower = totalShipPower + totalGemPower
  const bonusPower = basePower * (fleetSizeBonus + diversityBonus)
  const totalPower = Math.floor(basePower + bonusPower)

  const averageLevel = fleetCount > 0 ? totalLevels / fleetCount : 0
  const powerRating = getPowerRating(totalPower)

  return {
    totalPower,
    powerRating,
    fleetCount,
    averageLevel: Math.round(averageLevel * 10) / 10
  }
}