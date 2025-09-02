import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface UpgradeState {
  tokenId: bigint | null
  currentLevel: number | null
  isOpen: boolean
}

interface UpgradeContextValue {
  upgradeState: UpgradeState
  openUpgradeModal: (tokenId: bigint, currentLevel: number) => void
  closeUpgradeModal: () => void
}

const UpgradeContext = createContext<UpgradeContextValue | undefined>(undefined)

export function useUpgrade() {
  const context = useContext(UpgradeContext)
  if (context === undefined) {
    throw new Error('useUpgrade must be used within an UpgradeProvider')
  }
  return context
}

interface UpgradeProviderProps {
  children: ReactNode
}

export function UpgradeProvider({ children }: UpgradeProviderProps) {
  const [upgradeState, setUpgradeState] = useState<UpgradeState>({
    tokenId: null,
    currentLevel: null,
    isOpen: false,
  })

  const openUpgradeModal = (tokenId: bigint, currentLevel: number) => {
    setUpgradeState({
      tokenId,
      currentLevel,
      isOpen: true,
    })
  }

  const closeUpgradeModal = () => {
    setUpgradeState({
      tokenId: null,
      currentLevel: null,
      isOpen: false,
    })
  }

  return (
    <UpgradeContext.Provider
      value={{
        upgradeState,
        openUpgradeModal,
        closeUpgradeModal,
      }}
    >
      {children}
    </UpgradeContext.Provider>
  )
}