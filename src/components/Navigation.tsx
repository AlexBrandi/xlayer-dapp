import { Link, useLocation } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { formatAddress, formatTokenAmount } from '../lib/format'
import { useContracts } from '../hooks/useContracts'
import { CHAIN_ID } from '../lib/config'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/mint', label: 'Mint' },
  { path: '/upgrade-repair', label: 'Upgrade & Repair' },
  { path: '/market', label: 'Market' },
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
      toast.error('Please switch to X-Layer Mainnet', {
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
      toast.error('Failed to switch chain. Please switch manually in your wallet.')
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-blue-400">Ship Fleet DApp</h1>
            
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
                Switch to X-Layer
              </button>
            )}

            {isConnected && fuelBalance !== undefined && (
              <div className="text-right" style={{display: 'block'}}>
                <p className="text-xs text-gray-400">$FUEL Balance</p>
                <p className="text-sm font-bold">{formatTokenAmount(fuelBalance)}</p>
              </div>
            )}

            {!isConnected ? (
              <button onClick={handleConnect} className="btn-primary">
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Connected</p>
                  <p className="text-sm font-mono">{formatAddress(address!)}</p>
                </div>
                <button onClick={() => disconnect()} className="btn-secondary text-sm">
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{paddingBottom: '0.75rem', display: 'block'}}>
          <div className="flex gap-2" style={{overflowX: 'auto'}}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                style={{whiteSpace: 'nowrap'}}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}