import { useState } from 'react'
import { useContracts } from '../hooks/useContracts'
import toast from 'react-hot-toast'

interface BatchStakeModalProps {
  tokenIds: bigint[]
  onClose: () => void
  onSuccess: () => void
}


export function BatchStakeModal({ tokenIds, onClose }: BatchStakeModalProps) {
  const [selectedTokens, setSelectedTokens] = useState<bigint[]>([...tokenIds])
  const [isStaking, setIsStaking] = useState(false)
  
  const { 
    useStakeShips,
    useIsApprovedForAll,
    useApproveShips
  } = useContracts()
  
  const { stakeBatch } = useStakeShips()
  const { data: isApproved } = useIsApprovedForAll()
  const { approveAll, isPending: isApproving } = useApproveShips()

  const toggleToken = (tokenId: bigint) => {
    setSelectedTokens(prev => {
      if (prev.includes(tokenId)) {
        return prev.filter(id => id !== tokenId)
      } else {
        return [...prev, tokenId]
      }
    })
  }

  const selectAll = () => {
    setSelectedTokens([...tokenIds])
  }

  const selectNone = () => {
    setSelectedTokens([])
  }

  const handleBatchStake = async () => {
    if (selectedTokens.length === 0) {
      toast.error('请选择至少一艘战舰')
      return
    }

    try {
      setIsStaking(true)
      
      // 检查并批准
      if (!isApproved) {
        toast.loading('正在批准战舰...')
        await approveAll()
        toast.dismiss()
        toast.success('战舰批准成功')
      }

      // 批量质押
      toast.loading(`正在质押 ${selectedTokens.length} 艘战舰...`)
      await stakeBatch(selectedTokens)
      toast.dismiss()
      toast.success(`成功质押 ${selectedTokens.length} 艘战舰！`)
      
      onClose()
      // Data will be automatically refreshed by hooks
    } catch (error: any) {
      console.error('Batch stake error:', error)
      toast.dismiss()
      toast.error(error.message || '批量质押失败')
    } finally {
      setIsStaking(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="glass-card p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <h2 className="text-xl font-bold text-white mb-4 text-center">
          批量质押战舰
        </h2>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-400">
            选择了 <span className="text-cyan-400 font-bold">{selectedTokens.length}</span> / {tokenIds.length} 艘战舰
          </p>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-xs px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 transition-colors"
            >
              全选
            </button>
            <button
              onClick={selectNone}
              className="text-xs px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 transition-colors"
            >
              取消全选
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tokenIds.map((tokenId) => {
              const isSelected = selectedTokens.includes(tokenId)
              return (
                <div
                  key={tokenId.toString()}
                  onClick={() => toggleToken(tokenId)}
                  className={`relative glass-card p-4 cursor-pointer transition-all duration-300 transform ${
                    isSelected
                      ? 'border-2 border-cyan-400 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 scale-[1.02] shadow-lg shadow-cyan-500/30'
                      : 'border-2 border-gray-700 hover:border-gray-500 hover:bg-gray-800/50 hover:scale-[1.01]'
                  }`}
                >
                  {/* 选中时的光晕效果 */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400/10 to-blue-400/10 animate-pulse" />
                  )}
                  
                  <div className="relative flex items-center gap-4">
                    {/* 复选框 */}
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-400 shadow-lg shadow-cyan-500/50'
                        : 'border-gray-500 bg-gray-800'
                    }`}>
                      {isSelected && (
                        <svg className="w-4 h-4 text-white animate-scale-in" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    {/* 战舰信息 */}
                    <div className="flex-1">
                      <p className={`font-bold transition-colors duration-200 ${
                        isSelected ? 'text-cyan-300' : 'text-white'
                      }`}>
                        战舰 #{tokenId.toString()}
                      </p>
                      <p className={`text-xs transition-colors duration-200 ${
                        isSelected ? 'text-cyan-400' : 'text-gray-400'
                      }`}>
                        {isSelected ? '已选择' : '点击选择'}
                      </p>
                    </div>
                    
                    {/* 选中标记 */}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-ping" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isStaking}
            className="flex-1 btn-secondary"
          >
            取消
          </button>
          <button
            onClick={handleBatchStake}
            disabled={isStaking || isApproving || selectedTokens.length === 0}
            className="flex-1 btn-primary bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700"
          >
            {isStaking || isApproving ? '质押中...' : `质押 ${selectedTokens.length} 艘战舰`}
          </button>
        </div>
      </div>
    </div>
  )
}