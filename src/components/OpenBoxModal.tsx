import { useState } from 'react'
import { OpenBox } from './OpenBox'

interface OpenBoxModalProps {
  onClose: () => void
  onComplete: () => void
}

export function OpenBoxModal({ onClose, onComplete }: OpenBoxModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [showOpenBox, setShowOpenBox] = useState(false)

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(10, value))
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
    return (
      <OpenBox
        quantity={quantity}
        onComplete={handleOpenBoxComplete}
      />
    )
  }

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
          <h2 className="text-2xl font-bold text-white mb-2">开盒体验</h2>
          <p className="text-gray-400">体验神秘战舰开盒的乐趣！</p>
        </div>

        {/* 数量选择 */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-4 text-gray-300 text-center">选择开盒数量</label>
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
              max={10}
            />
            
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-all flex items-center justify-center text-xl font-bold"
            >
              +
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {[1, 3, 5, 10].map((amt) => (
              <button
                key={amt}
                onClick={() => setQuantity(amt)}
                className={`py-3 rounded-lg text-sm font-medium transition-all ${
                  quantity === amt
                    ? 'text-white shadow-lg'
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
            开盒说明
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• 这是一个模拟开盒体验，用于展示随机获得战舰的乐趣</p>
            <p>• 概率分布基于真实的游戏设定</p>
            <p>• 传奇战舰有特殊的视觉效果</p>
            <p>• 开盒结束后可查看获得的所有战舰</p>
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
          <span>开始开盒体验 ({quantity} 个)</span>
          <span className="text-2xl">✨</span>
        </button>
      </div>
    </div>
  )
}