import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { CONTRACT_ADDRESSES } from '../lib/config'
import { GAME_ABI } from '../lib/contractAbis'

interface TestLeaderboardEntry {
  address: string
  battlePower: number
  powerRating: string
  fleetCount: number
  averageLevel: number
}

export function useTestLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<TestLeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState('')
  
  const publicClient = usePublicClient()

  useEffect(() => {
    const fetchTestData = async () => {
      if (!publicClient) return

      try {
        setIsLoading(true)
        setDebugInfo('开始测试已知用户数据...')

        // 测试你的地址
        const testAddress = '0xfA7029fd4de9Aa319b24F4E4136946AAffA8F9e1'
        
        console.log('测试地址:', testAddress)
        setDebugInfo(`正在查询 ${testAddress} 的数据...`)

        // 获取用户的NFT状态
        const userStatus = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.GAME_CONTROLLER,
          abi: GAME_ABI,
          functionName: 'getAllNFTsStatus',
          args: [testAddress as `0x${string}`]
        }) as [bigint[], bigint[], bigint[]]

        console.log('用户状态:', {
          allNFTs: userStatus[0].length,
          stakedNFTs: userStatus[1].length,
          unstakedNFTs: userStatus[2].length,
          firstFewTokens: userStatus[0].slice(0, 5).map(t => Number(t))
        })

        const fleetCount = userStatus[0].length
        setDebugInfo(`发现 ${fleetCount} 艘飞船，正在计算战力...`)

        if (fleetCount === 0) {
          setDebugInfo('用户没有飞船')
          setLeaderboard([])
          setIsLoading(false)
          return
        }

        // 简化的战力计算
        let totalPower = 0
        userStatus[0].forEach(tokenId => {
          const tokenNum = Number(tokenId)
          // 使用固定的基础战力
          const basePower = 100 // 所有船都按普通稀有度计算
          const stakingBonus = userStatus[1].includes(tokenId) ? 1.2 : 1.0
          totalPower += basePower * stakingBonus
        })

        // 舰队规模加成
        const fleetSizeBonus = Math.min(Math.floor(fleetCount / 5) * 0.05, 0.5)
        const bonusPower = totalPower * fleetSizeBonus
        totalPower = Math.floor(totalPower + bonusPower)

        // 等级评定
        let powerRating = 'Space Recruit'
        if (totalPower >= 15000) powerRating = 'Fleet Commander'
        else if (totalPower >= 8000) powerRating = 'Space Admiral'
        else if (totalPower >= 5000) powerRating = 'Star Captain'
        else if (totalPower >= 3000) powerRating = 'Cruiser Captain'

        console.log('计算结果:', {
          totalPower,
          powerRating,
          fleetCount,
          fleetSizeBonus
        })

        setLeaderboard([{
          address: testAddress,
          battlePower: totalPower,
          powerRating,
          fleetCount,
          averageLevel: 1.0
        }])

        setDebugInfo(`测试完成！战力: ${totalPower}`)
        setIsLoading(false)

      } catch (error) {
        console.error('测试失败:', error)
        setDebugInfo(`测试失败: ${error}`)
        setIsLoading(false)
      }
    }

    fetchTestData()
  }, [publicClient])

  return {
    leaderboard,
    isLoading,
    debugInfo,
    refetch: () => {
      window.location.reload()
    }
  }
}