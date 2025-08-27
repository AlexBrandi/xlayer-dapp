export interface ShipInfo {
  tokenId: bigint
  level: number
  rarity: number
  hp: bigint
  effectiveHp: bigint
  durability: bigint
  maxDurability: bigint
  isVoyaging: boolean
  claimableReward?: bigint
  estimatedReward?: bigint
  lastClaimBlock?: bigint
}

export interface UpgradeCost {
  fuelCost: bigint
  gemCost: bigint
}

export enum Rarity {
  Common = 0,
  Rare = 1,
  Epic = 2,
  Legendary = 3
}