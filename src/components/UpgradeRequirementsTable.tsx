import { useUpgradeRequirements } from '../hooks/useUpgradeRequirements'

interface Props {
  compact?: boolean
}

// Default values based on the pattern: Level 1->2 base, then 1.5x each level
const DEFAULT_REQUIREMENTS = {
  level1to2: { sapphire: '20', sunstone: '10', lithium: '5', fuel: '0' },
  level2to3: { sapphire: '30', sunstone: '15', lithium: '7', fuel: '0' }, // 1.5x (rounded down for 7.5)
  level3to4: { sapphire: '45', sunstone: '22', lithium: '11', fuel: '0' }, // 1.5x (rounded down for 22.5, 11.25)
  level4to5: { sapphire: '67', sunstone: '33', lithium: '16', fuel: '0' }, // 1.5x (rounded down for 67.5, 33.75, 16.875)
}

export function UpgradeRequirementsTable({ compact = false }: Props) {
  const { level1to2, level2to3, level3to4, level4to5 } = useUpgradeRequirements()

  // Use contract data if available, otherwise use defaults
  const requirements = {
    level1to2: level1to2 || DEFAULT_REQUIREMENTS.level1to2,
    level2to3: level2to3 || DEFAULT_REQUIREMENTS.level2to3,
    level3to4: level3to4 || DEFAULT_REQUIREMENTS.level3to4,
    level4to5: level4to5 || DEFAULT_REQUIREMENTS.level4to5,
  }

  if (compact) {
    // Compact view for Market page
    return (
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Level 1 → 2:</span>
          <span className="text-white">{requirements.level1to2.sapphire} Sapphire + {requirements.level1to2.sunstone} Sunstone + {requirements.level1to2.lithium} Lithium</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Level 2 → 3:</span>
          <span className="text-white">{requirements.level2to3.sapphire} Sapphire + {requirements.level2to3.sunstone} Sunstone + {requirements.level2to3.lithium} Lithium</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Level 3 → 4:</span>
          <span className="text-white">{requirements.level3to4.sapphire} Sapphire + {requirements.level3to4.sunstone} Sunstone + {requirements.level3to4.lithium} Lithium</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Level 4 → 5:</span>
          <span className="text-white">{requirements.level4to5.sapphire} Sapphire + {requirements.level4to5.sunstone} Sunstone + {requirements.level4to5.lithium} Lithium</span>
        </div>
      </div>
    )
  }

  // Full table view for Whitepaper
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="text-left py-3 text-gray-400">Level</th>
            <th className="text-left py-3 text-blue-400">Sapphire</th>
            <th className="text-left py-3 text-orange-400">Sunstone</th>
            <th className="text-left py-3 text-purple-400">Lithium</th>
            <th className="text-left py-3 text-green-400">FUEL Cost</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr className="border-b border-gray-700/50">
            <td className="py-3 text-cyan-400 font-bold">1 → 2</td>
            <td className="py-3 text-white">{requirements.level1to2.sapphire}</td>
            <td className="py-3 text-white">{requirements.level1to2.sunstone}</td>
            <td className="py-3 text-white">{requirements.level1to2.lithium}</td>
            <td className="py-3 text-white">{Number(requirements.level1to2.fuel) > 0 ? `${requirements.level1to2.fuel} FUEL` : '-'}</td>
          </tr>
          <tr className="border-b border-gray-700/50">
            <td className="py-3 text-cyan-400 font-bold">2 → 3</td>
            <td className="py-3 text-white">{requirements.level2to3.sapphire}</td>
            <td className="py-3 text-white">{requirements.level2to3.sunstone}</td>
            <td className="py-3 text-white">{requirements.level2to3.lithium}</td>
            <td className="py-3 text-white">{Number(requirements.level2to3.fuel) > 0 ? `${requirements.level2to3.fuel} FUEL` : '-'}</td>
          </tr>
          <tr className="border-b border-gray-700/50">
            <td className="py-3 text-cyan-400 font-bold">3 → 4</td>
            <td className="py-3 text-white">{requirements.level3to4.sapphire}</td>
            <td className="py-3 text-white">{requirements.level3to4.sunstone}</td>
            <td className="py-3 text-white">{requirements.level3to4.lithium}</td>
            <td className="py-3 text-white">{Number(requirements.level3to4.fuel) > 0 ? `${requirements.level3to4.fuel} FUEL` : '-'}</td>
          </tr>
          <tr>
            <td className="py-3 text-cyan-400 font-bold">4 → 5</td>
            <td className="py-3 text-white">{requirements.level4to5.sapphire}</td>
            <td className="py-3 text-white">{requirements.level4to5.sunstone}</td>
            <td className="py-3 text-white">{requirements.level4to5.lithium}</td>
            <td className="py-3 text-white">{Number(requirements.level4to5.fuel) > 0 ? `${requirements.level4to5.fuel} FUEL` : '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}