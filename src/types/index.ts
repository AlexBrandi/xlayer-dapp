export interface ShipInfo {
  tokenId: bigint
  level: number
  imageId: number
  isStaked: boolean
  pendingReward?: bigint
  stakingBlock?: bigint
}

export interface GemBalance {
  sapphire: bigint  // ID: 1
  sunstone: bigint  // ID: 2
  lithium: bigint   // ID: 3
}

export interface UpgradeCost {
  sapphire: bigint
  sunstone: bigint
  lithium: bigint
}

export interface UserStatus {
  allNFTs: bigint[]
  stakedNFTs: bigint[]
  unstakedNFTs: bigint[]
}

export const GemType = {
  SAPPHIRE: 1,
  SUNSTONE: 2,
  LITHIUM: 3
} as const

export const Rarity = {
  Common: 0,
  Rare: 1,
  Epic: 2,
  Legendary: 3
} as const

export const ShipLevel = {
  MIN: 1,
  MAX: 5
} as const