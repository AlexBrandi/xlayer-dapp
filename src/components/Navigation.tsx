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
  { path: '/', label: 'Dashboard' },
  { path: '/mint', label: 'Mint Ships' },
  { path: '/market', label: 'Gem Market' },
  { path: '/whitepaper', label: 'Whitepaper' },
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
      toast.error('Please switch to BNB Chain', {
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
      toast.error('Chain switch failed. Please switch manually in your wallet.')
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-blue-400">Star Fleet</h1>
            
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
              
              <a
                href="https://x.com/ShipWarBnb"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link flex items-center gap-2 hover:text-blue-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isConnected && chainId !== CHAIN_ID && (
              <button
                onClick={handleSwitchChain}
                className="px-3 py-2 bg-orange-600 text-white text-sm rounded-lg transition-colors"
                style={{backgroundColor: 'var(--orange-600)'}}
              >
                Switch to BNB Chain
              </button>
            )}

            {isConnected && fuelBalance !== undefined && (
              <div className="text-right" style={{display: 'block'}}>
                <p className="text-xs text-gray-400">FUEL Balance</p>
                <p className="text-sm font-bold">{formatEther(fuelBalance as bigint)}</p>
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
      </div>
    </nav>
  )
}