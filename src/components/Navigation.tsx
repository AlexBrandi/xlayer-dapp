import { Link, useLocation } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { formatEther } from 'viem'

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
import { useContracts } from '../hooks/useContracts'
import { CHAIN_ID } from '../lib/config'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

const navItems = [
  { path: '/', label: '控制台' },
  { path: '/mint', label: '铸造飞船' },
  { path: '/market', label: '宝石市场' },
]

export function Navigation() {
  const location = useLocation()
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { useFuelBalance } = useContracts()
  const { data: fuelBalance } = useFuelBalance()

  useEffect(() => {
    if (isConnected && chainId !== CHAIN_ID) {
      toast.error('请切换到 X-Layer 主网', {
        duration: 5000,
        position: 'top-center',
      })
    }
  }, [isConnected, chainId])

  const handleConnect = async () => {
    const connector = connectors[0]
    if (connector) {
      connect({ connector })
    }
  }

  const handleSwitchChain = async () => {
    try {
      await switchChain({ chainId: CHAIN_ID })
    } catch (error) {
      toast.error('切换链失败，请在钱包中手动切换。')
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-blue-400">星际舰队</h1>
            
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isConnected && chainId !== CHAIN_ID && (
              <button
                onClick={handleSwitchChain}
                className="px-3 py-2 bg-orange-600 text-white text-sm rounded-lg transition-colors"
                style={{backgroundColor: 'var(--orange-600)'}}
              >
                切换到 X-Layer
              </button>
            )}

            {isConnected && fuelBalance !== undefined && (
              <div className="text-right" style={{display: 'block'}}>
                <p className="text-xs text-gray-400">FUEL 余额</p>
                <p className="text-sm font-bold">{formatEther(fuelBalance as bigint)}</p>
              </div>
            )}

            {!isConnected ? (
              <button onClick={handleConnect} className="btn-primary">
                连接钱包
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-400">已连接</p>
                  <p className="text-sm font-mono">{formatAddress(address!)}</p>
                </div>
                <button onClick={() => disconnect()} className="btn-secondary text-sm">
                  断开连接
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}