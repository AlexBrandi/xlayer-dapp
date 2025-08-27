import { useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import type { ShipInfo } from '../types'
import { formatTokenAmount, RARITY_NAMES, RARITY_COLORS, getShipImage, getGemImage } from '../lib/format'
import { useShips } from '../hooks/useShips'
import { useContracts } from '../hooks/useContracts'
import { CONTRACT_ADDRESSES } from '../lib/config'
import { CONTROLLER_ABI } from '../lib/abis'

export function UpgradeRepair() {
  const { isConnected } = useAccount()
  const { ships } = useShips()
  const [selectedShip, setSelectedShip] = useState<ShipInfo | null>(null)
  const { useUpgradeShip, useRepairShip, useFuelBalance } = useContracts()
  
  const { upgrade, isPending: isUpgrading } = useUpgradeShip()
  const { repair, isPending: isRepairing } = useRepairShip()
  const { data: fuelBalance } = useFuelBalance()

  // Get upgrade cost for selected ship
  const { data: upgradeCost } = useReadContract({
    address: CONTRACT_ADDRESSES.REWARD_CONTROLLER,
    abi: CONTROLLER_ABI,
    functionName: 'getUpgradeCost',
    args: selectedShip ? [selectedShip.tokenId] : undefined,
  })

  // Get repair cost for selected ship
  const { data: repairCost } = useReadContract({
    address: CONTRACT_ADDRESSES.REWARD_CONTROLLER,
    abi: CONTROLLER_ABI,
    functionName: 'getRepairCost',
    args: selectedShip ? [selectedShip.tokenId] : undefined,
  })

  const handleUpgrade = async () => {
    if (selectedShip) {
      await upgrade(selectedShip.tokenId)
    }
  }

  const handleRepair = async () => {
    if (selectedShip) {
      await repair(selectedShip.tokenId)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Wallet</h2>
          <p className="text-gray-400">Connect your wallet to upgrade and repair ships</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Upgrade & Repair Ships</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Ship Selection */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Select Ship</h2>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            {ships.map((ship) => (
              <button
                key={ship.tokenId.toString()}
                onClick={() => setSelectedShip(ship)}
                className={`w-full glass-card p-4 text-left transition-all ${
                  selectedShip?.tokenId === ship.tokenId
                    ? 'ring-2 ring-blue-500'
                    : 'hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={getShipImage(Number(ship.tokenId))}
                    alt={`Ship #${ship.tokenId}`}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-bold">Ship #{ship.tokenId.toString()}</p>
                    <p className={`text-sm ${RARITY_COLORS[ship.rarity as keyof typeof RARITY_COLORS]}`}>
                      {RARITY_NAMES[ship.rarity]} • Level {ship.level}
                    </p>
                  </div>
                  {ship.isVoyaging && (
                    <span className="text-xs text-green-400">Voyaging</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Ship Details */}
        <div className="lg:col-span-2">
          {selectedShip ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ship Info */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-4">Ship Details</h3>
                <img
                  src={getShipImage(Number(selectedShip.tokenId))}
                  alt={`Ship #${selectedShip.tokenId}`}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Token ID:</span>
                    <span className="font-mono">#{selectedShip.tokenId.toString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rarity:</span>
                    <span className={RARITY_COLORS[selectedShip.rarity as keyof typeof RARITY_COLORS]}>
                      {RARITY_NAMES[selectedShip.rarity]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Level:</span>
                    <span>{selectedShip.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">HP:</span>
                    <span>{selectedShip.hp.toString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Durability:</span>
                    <span className={Number(selectedShip.durability) < 30 ? 'text-orange-400' : ''}>
                      {selectedShip.durability.toString()}/{selectedShip.maxDurability.toString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-6">
                {/* Upgrade Section */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-4">Upgrade Ship</h3>
                  
                  {selectedShip.isVoyaging ? (
                    <p className="text-orange-400 text-sm mb-4">⚠️ Stop voyage before upgrading</p>
                  ) : (
                    <>
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">Upgrade Cost:</p>
                        {upgradeCost && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>FUEL:</span>
                              <span className="font-bold">
                                {formatTokenAmount(upgradeCost[0])} $FUEL
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <img 
                                src={getGemImage(selectedShip.level)} 
                                alt="Gem"
                                className="w-6 h-6"
                              />
                              <span>Gems:</span>
                              <span className="font-bold">{upgradeCost[1].toString()}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={handleUpgrade}
                        disabled={isUpgrading || selectedShip.isVoyaging}
                        className="w-full btn-primary"
                      >
                        {isUpgrading ? 'Upgrading...' : `Upgrade to Level ${selectedShip.level + 1}`}
                      </button>
                    </>
                  )}
                </div>

                {/* Repair Section */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-4">Repair Ship</h3>
                  
                  {selectedShip.isVoyaging ? (
                    <p className="text-orange-400 text-sm mb-4">⚠️ Stop voyage before repairing</p>
                  ) : Number(selectedShip.durability) === Number(selectedShip.maxDurability) ? (
                    <p className="text-green-400">Ship is at full durability</p>
                  ) : (
                    <>
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">Repair Cost:</p>
                        {repairCost !== undefined && (
                          <p className="font-bold">{formatTokenAmount(repairCost)} $FUEL</p>
                        )}
                      </div>
                      
                      <button
                        onClick={handleRepair}
                        disabled={isRepairing || selectedShip.isVoyaging}
                        className="w-full btn-primary bg-orange-600 hover:bg-orange-700"
                      >
                        {isRepairing ? 'Repairing...' : 'Repair Ship'}
                      </button>
                    </>
                  )}
                </div>

                {/* Balance Info */}
                <div className="glass-card p-4 bg-gray-800/50">
                  <p className="text-sm text-gray-400">Your FUEL Balance:</p>
                  <p className="text-xl font-bold">
                    {formatTokenAmount(fuelBalance || BigInt(0))} $FUEL
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <p className="text-gray-400">Select a ship to upgrade or repair</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}