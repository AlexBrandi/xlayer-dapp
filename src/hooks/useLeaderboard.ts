import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESSES } from '../lib/config'
import { SHIP_ABI, GAME_ABI } from '../lib/contractAbis'
import { useBattlePower } from './useBattlePower'
import { useMemo, useState, useEffect } from 'react'

interface LeaderboardEntry {
  address: string
  battlePower: number
  powerRating: string
  fleetCount: number
  averageLevel: number
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

export function useLeaderboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  // 获取总供应量以知道要查询多少个token
  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESSES.SHIP_NFT,
    abi: SHIP_ABI,
    functionName: 'totalSupply',
  })

  // 目前的限制：
  // 1. 无法直接获取所有持有者列表
  // 2. 需要遍历所有tokenId来找到持有者（成本高）
  // 3. 需要为每个持有者计算战力（需要多次调用）
  
  // 临时解决方案：使用已知的活跃用户地址样本
  const knownActiveUsers = useMemo(() => [
    '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', // 示例地址 - 实际应用中这些应该来自事件日志
    '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1',
    '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
    '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3',
    '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4',
  ], [])

  // TODO: 在实际应用中，这里应该：
  // 1. 监听Transfer事件来维护持有者列表
  // 2. 使用The Graph子图来索引链上数据
  // 3. 或者创建后端服务定期扫描和缓存数据

  useEffect(() => {
    // 模拟加载真实数据的过程
    const loadLeaderboard = async () => {
      setIsLoading(true)
      
      // 这里应该是实际的链上查询逻辑
      // 由于性能限制，目前使用改进的模拟数据
      const mockLeaderboard: LeaderboardEntry[] = [
        { address: '0x1a2b...c3d4', battlePower: 52340, powerRating: 'Galactic Ruler', fleetCount: 35, averageLevel: 4.8 },
        { address: '0x5e6f...7g8h', battlePower: 38750, powerRating: 'Star Overlord', fleetCount: 28, averageLevel: 4.2 },
        { address: '0x9i0j...1k2l', battlePower: 26800, powerRating: 'Fleet Commander', fleetCount: 22, averageLevel: 3.9 },
        { address: '0x3m4n...5o6p', battlePower: 19200, powerRating: 'Space Admiral', fleetCount: 18, averageLevel: 3.5 },
        { address: '0x7q8r...9s0t', battlePower: 14500, powerRating: 'Space Admiral', fleetCount: 15, averageLevel: 3.8 },
        { address: '0xau2v...3w4x', battlePower: 9800, powerRating: 'Star Captain', fleetCount: 12, averageLevel: 3.2 },
        { address: '0x5y6z...7a8b', battlePower: 6750, powerRating: 'Star Captain', fleetCount: 10, averageLevel: 2.9 },
        { address: '0x9c0d...1e2f', battlePower: 4200, powerRating: 'Cruiser Captain', fleetCount: 8, averageLevel: 2.5 },
      ]

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setLeaderboard(mockLeaderboard)
      setIsLoading(false)
    }

    loadLeaderboard()
  }, [])

  return {
    leaderboard,
    isLoading,
    totalSupply: totalSupply ? Number(totalSupply) : 0,
    // TODO: 添加刷新功能
    refetch: () => {
      // 重新加载排行榜数据
    }
  }
}

// 用于获取特定用户战力数据的hook（如果需要）
export function useUserBattlePower(userAddress: string) {
  // TODO: 实现获取特定用户战力的逻辑
  // 这需要：
  // 1. 获取用户的所有NFT
  // 2. 获取每个NFT的等级和状态
  // 3. 获取用户的宝石余额
  // 4. 计算总战力
  
  return {
    battlePower: 0,
    isLoading: true,
  }
}