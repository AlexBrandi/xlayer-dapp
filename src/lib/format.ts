export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatTokenAmount(amount: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals)
  const beforeDecimal = amount / divisor
  const afterDecimal = amount % divisor
  
  const afterDecimalStr = afterDecimal.toString().padStart(decimals, '0')
  const significantDecimals = afterDecimalStr.slice(0, 4)
  
  return `${beforeDecimal}.${significantDecimals}`
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function formatPercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

export const RARITY_NAMES = ['Common', 'Rare', 'Epic', 'Legendary'] as const
export const RARITY_COLORS = {
  0: 'text-rarity-common',
  1: 'text-rarity-rare',
  2: 'text-rarity-epic',
  3: 'text-rarity-legend',
} as const

export function getShipImage(tokenId: number): string {
  // Use images from public/images directory (1.png to 15.png)
  const imageNumber = (tokenId % 15) + 1 // Map to 1-15 range
  return `/images/${imageNumber}.png`
}

export function getGemImage(gemType: number): string {
  // Map gem types to available images in public/images
  switch (gemType) {
    case 1: // Sapphire
      return '/images/sapphire.png'
    case 2: // Sunstone  
      return '/images/sunstone.png'
    case 3: // Lithium
      return '/images/lithium.png'
    default:
      return '/images/sapphire.png'
  }
}