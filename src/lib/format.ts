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
  const ships = [
    '亚伯号.png',
    '冒险者号.png',
    '切诺亚号.png',
    '卡佩奇号.png',
    '卡文迪号.png',
    '哈布斯号.png',
    '嘉百列号.png',
    '坎贝尔号.png',
    '惊恐号.png',
    '摩尔号.png',
    '敦刻尔克号.png',
    '玛丽亚号.png',
    '珍珠号.png',
    '莱特号.png',
    '雷德尔号.png',
  ]
  // Use tokenId to deterministically select a ship image
  const index = tokenId % ships.length
  return `/gem/ship/${ships[index]}`
}

export function getGemImage(gemType: number): string {
  const gems = [
    '太阳石.png',
    '海蓝石.png',
    '猫眼石.png',
    '白银.png',
    '石榴石.png',
    '紫水晶.png',
    '红水晶.png',
    '绿水晶.png',
    '翡翠石.png',
    '蓝宝石.png',
    '蓝水晶.png',
    '金刚石.png',
    '钢铁.png',
    '锂矿石.png',
    '青铜.png',
    '黄金.png',
    '黑暗水晶.png',
    '黑曜石.png',
  ]
  const index = gemType % gems.length
  return `/gem/gem/${gems[index]}`
}