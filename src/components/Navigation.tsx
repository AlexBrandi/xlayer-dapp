import { Link, useLocation } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { formatEther } from 'viem'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useContracts } from '../hooks/useContracts'
import { CHAIN_ID } from '../lib/config'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { MobileNav } from './MobileNav'

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/mint', label: 'Mint Ships' },
  { path: '/market', label: 'Gem Market' },
  { path: '/whitepaper', label: 'Whitepaper' },
]

export function Navigation() {
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  
  console.log('Navigation Debug - isDesktop:', isDesktop, 'window width:', typeof window !== 'undefined' ? window.innerWidth : 'SSR')
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
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 md:gap-8">
              {/* Mobile Navigation - Only show on mobile */}
              {!isDesktop && <MobileNav />}
              
              {/* Desktop Title - Only show on desktop */}
              {isDesktop && (
                <h1 className="text-xl font-bold text-blue-400">Star Fleet</h1>
              )}
              
              {/* Desktop Navigation - Only show on desktop */}
              {isDesktop && (
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
              )}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Chain Switch Button - Hidden on mobile */}
              {isConnected && chainId !== CHAIN_ID && (
                <button
                  onClick={handleSwitchChain}
                  className="hidden md:block px-3 py-2 bg-orange-600 text-white text-sm rounded-lg transition-colors"
                  style={{backgroundColor: 'var(--orange-600)'}}
                >
                  Switch to BNB Chain
                </button>
              )}

              {/* FUEL Balance - Hidden on mobile */}
              {isDesktop && isConnected && fuelBalance !== undefined && (
                <div className="text-right">
                  <p className="text-xs text-gray-400">FUEL Balance</p>
                  <p className="text-sm font-bold">{formatEther(fuelBalance as bigint)}</p>
                </div>
              )}

              {/* Wallet Connection */}
              {!isConnected ? (
                <button onClick={handleConnect} className="btn-primary text-sm md:text-base px-3 md:px-6">
                  <span className="hidden sm:inline">Connect Wallet</span>
                  <span className="sm:hidden">Connect</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 md:gap-3">
                  {isDesktop && (
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Connected</p>
                      <p className="text-sm font-mono">{formatAddress(address!)}</p>
                    </div>
                  )}
                  {!isDesktop && (
                    <div className="text-right">
                      <p className="text-xs font-mono">{formatAddress(address!)}</p>
                    </div>
                  )}
                  <button onClick={() => disconnect()} className="btn-secondary text-xs md:text-sm px-2 md:px-4">
                    <span className="hidden sm:inline">Disconnect</span>
                    <span className="sm:hidden">Exit</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}