import { useState } from 'react'
import { RealOpenBox } from './RealOpenBox'

interface RealOpenBoxModalProps {
  availableTokenIds: bigint[]
  onClose: () => void
  onComplete: () => void
}

export function RealOpenBoxModal({ availableTokenIds, onClose, onComplete }: RealOpenBoxModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [showOpenBox, setShowOpenBox] = useState(false)

  const handleQuantityChange = (value: number) => {
    const maxQuantity = Math.min(availableTokenIds.length, 10)
    const newQuantity = Math.max(1, Math.min(maxQuantity, value))
    setQuantity(newQuantity)
  }

  const handleStartOpenBox = () => {
    setShowOpenBox(true)
  }

  const handleOpenBoxComplete = () => {
    setShowOpenBox(false)
    onComplete()
    onClose()
  }

  if (showOpenBox) {
    // 取前quantity个NFT进行开盒
    const selectedTokenIds = availableTokenIds.slice(0, quantity)
    return (
      <RealOpenBox
        tokenIds={selectedTokenIds}
        onComplete={handleOpenBoxComplete}
      />
    )
  }

  if (availableTokenIds.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        {/* 科幻宇宙背景 */}
        <div className="sci-fi-background"></div>
        <div className="spiral-depth"></div>
        
        <div className="glass-card p-8 max-w-lg w-full mx-4 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center text-gray-400 hover:text-white transition-all"
            >
              ✕
            </button>
          </div>

          <div className="text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-white mb-4">暂无可开启的战舰</h2>
            <p className="text-gray-400 mb-6">您还没有任何NFT战舰可以开启</p>
            <p className="text-sm text-cyan-400 mb-8">请先去铸造页面获得您的第一艘战舰！</p>
            
            <button
              onClick={onClose}
              className="w-full h-14 rounded-xl text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl"
              style={{
                background: 'linear-gradient(to right, #ff6b35, #e55527)',
                boxShadow: '0 25px 50px -12px rgba(255, 107, 53, 0.25)'
              }}
            >
              <span className="text-2xl">🚀</span>
              <span>去铸造战舰</span>
              <span className="text-2xl">⚡</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const maxQuantity = Math.min(availableTokenIds.length, 10)

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      {/* 科幻宇宙背景 */}
      <div className="sci-fi-background"></div>
      <div className="spiral-depth"></div>
      <div className="sci-fi-particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${8 + Math.random() * 12}s`
            }}
          />
        ))}
      </div>

      <div className="glass-card p-8 max-w-lg w-full mx-4 relative">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-white mb-2">开启战舰</h2>
          <p className="text-gray-400">选择要开启的战舰数量</p>
          <p className="text-sm text-cyan-400 mt-2">您拥有 {availableTokenIds.length} 艘未开启的战舰</p>
        </div>

        {/* 数量选择 */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-4 text-gray-300 text-center">开启数量 (最多 {maxQuantity} 个)</label>
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all flex items-center justify-center text-xl font-bold"
            >
              −
            </button>
            
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-24 h-12 bg-gray-800 border border-gray-600 rounded-xl text-center text-white font-bold text-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              style={{
                appearance: 'textfield',
                MozAppearance: 'textfield'
              }}
              min={1}
              max={maxQuantity}
            />
            
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-all flex items-center justify-center text-xl font-bold"
            >
              +
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {[1, 3, 5, Math.min(10, maxQuantity)].map((amt) => (
              <button
                key={amt}
                onClick={() => setQuantity(amt)}
                disabled={amt > maxQuantity}
                className={`py-3 rounded-lg text-sm font-medium transition-all ${
                  quantity === amt
                    ? 'text-white shadow-lg'
                    : amt > maxQuantity
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                style={quantity === amt ? {
                  background: 'linear-gradient(to right, #ff6b35, #e55527)',
                  boxShadow: '0 4px 14px 0 rgba(255, 107, 53, 0.25)'
                } : {}}
              >
                {amt}
              </button>
            ))}
          </div>
        </div>

        {/* 说明 */}
        <div className="glass-card p-4 bg-gray-800/30 mb-8">
          <h3 className="text-sm font-bold mb-3 text-cyan-400 flex items-center gap-2">
            <span>ℹ️</span>
            开启说明
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• 开启您真正拥有的NFT战舰</p>
            <p>• 查看每艘战舰的稀有度和等级</p>
            <p>• 每个NFT都有唯一的Token ID</p>
            <p>• 开启后可查看战舰的详细信息</p>
          </div>
        </div>

        {/* 开始按钮 */}
        <button
          onClick={handleStartOpenBox}
          className="w-full h-16 rounded-xl text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl"
          style={{
            background: 'linear-gradient(to right, #ff6b35, #e55527)',
            boxShadow: '0 25px 50px -12px rgba(255, 107, 53, 0.25)'
          }}
        >
          <span className="text-2xl">📦</span>
          <span>开启战舰 ({quantity} 个)</span>
          <span className="text-2xl">✨</span>
        </button>
      </div>
    </div>
  )
}