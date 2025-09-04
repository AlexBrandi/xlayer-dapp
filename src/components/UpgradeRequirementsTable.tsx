import { useUpgradeRequirements } from '../hooks/useUpgradeRequirements'

interface Props {
  compact?: boolean
}

export function UpgradeRequirementsTable({ compact = false }: Props) {
  const { level1to2, level2to3, level3to4, level4to5, isLoading } = useUpgradeRequirements()

  if (isLoading || !level1to2 || !level2to3 || !level3to4 || !level4to5) {
    return (
      <div className="text-center py-4">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-400 text-sm mt-2">Loading upgrade requirements...</p>
      </div>
    )
  }

  if (compact) {
    // Compact view for Market page
    return (
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Level 1 → 2:</span>
          <span className="text-white">{level1to2.sapphire} Sapphire + {level1to2.sunstone} Sunstone + {level1to2.lithium} Lithium</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Level 2 → 3:</span>
          <span className="text-white">{level2to3.sapphire} Sapphire + {level2to3.sunstone} Sunstone + {level2to3.lithium} Lithium</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Level 3 → 4:</span>
          <span className="text-white">{level3to4.sapphire} Sapphire + {level3to4.sunstone} Sunstone + {level3to4.lithium} Lithium</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Level 4 → 5:</span>
          <span className="text-white">{level4to5.sapphire} Sapphire + {level4to5.sunstone} Sunstone + {level4to5.lithium} Lithium</span>
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
            <td className="py-3 text-white">{level1to2.sapphire}</td>
            <td className="py-3 text-white">{level1to2.sunstone}</td>
            <td className="py-3 text-white">{level1to2.lithium}</td>
            <td className="py-3 text-white">{level1to2.fuel} FUEL</td>
          </tr>
          <tr className="border-b border-gray-700/50">
            <td className="py-3 text-cyan-400 font-bold">2 → 3</td>
            <td className="py-3 text-white">{level2to3.sapphire}</td>
            <td className="py-3 text-white">{level2to3.sunstone}</td>
            <td className="py-3 text-white">{level2to3.lithium}</td>
            <td className="py-3 text-white">{level2to3.fuel} FUEL</td>
          </tr>
          <tr className="border-b border-gray-700/50">
            <td className="py-3 text-cyan-400 font-bold">3 → 4</td>
            <td className="py-3 text-white">{level3to4.sapphire}</td>
            <td className="py-3 text-white">{level3to4.sunstone}</td>
            <td className="py-3 text-white">{level3to4.lithium}</td>
            <td className="py-3 text-white">{level3to4.fuel} FUEL</td>
          </tr>
          <tr>
            <td className="py-3 text-cyan-400 font-bold">4 → 5</td>
            <td className="py-3 text-white">{level4to5.sapphire}</td>
            <td className="py-3 text-white">{level4to5.sunstone}</td>
            <td className="py-3 text-white">{level4to5.lithium}</td>
            <td className="py-3 text-white">{level4to5.fuel} FUEL</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}