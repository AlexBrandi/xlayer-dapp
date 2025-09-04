import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/mint', label: 'Mint Ships' },
  { path: '/market', label: 'Gem Market' },
  { path: '/whitepaper', label: 'Whitepaper' },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const currentPage = navItems.find(item => item.path === location.pathname)?.label || 'Menu'

  console.log('MobileNav Debug:', { isOpen, currentPage })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div style={{ position: 'relative' }}>
      {/* Dropdown Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          console.log('MobileNav button clicked, current state:', isOpen)
          setIsOpen(!isOpen)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: '#d1d5db',
          fontSize: '18px',
          fontWeight: '500',
          cursor: 'pointer',
          padding: '8px 0',
        }}
      >
        <span>{currentPage}</span>
        <svg 
          style={{
            width: '16px',
            height: '16px',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.3s'
          }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu - Using Portal to render outside nav container */}
      {isOpen && createPortal(
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            width: '100vw',
            backgroundColor: 'rgba(17, 24, 39, 0.98)',
            borderBottom: '1px solid rgba(156, 163, 175, 0.2)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            zIndex: 99999
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ padding: '16px 0' }}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: location.pathname === item.path ? '#60a5fa' : '#d1d5db',
                    backgroundColor: location.pathname === item.path ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                    borderLeft: location.pathname === item.path ? '4px solid #60a5fa' : '4px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)'
                      e.currentTarget.style.color = '#fff'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = '#d1d5db'
                    }
                  }}
                >
                  {item.label}
                </Link>
              ))}
              
              <a
                href="https://x.com/ShipWarBnb"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#d1d5db',
                  backgroundColor: 'transparent',
                  borderLeft: '4px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#d1d5db'
                }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}