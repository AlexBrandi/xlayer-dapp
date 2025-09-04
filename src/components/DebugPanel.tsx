import { useAccount } from 'wagmi'
import { useContracts } from '../hooks/useContracts'
import { useShips } from '../hooks/useShips'

export function DebugPanel() {
  const { address } = useAccount()
  const { useTokensOfOwner, useTokensOfOwnerImageIds, useShipBalance } = useContracts()
  const { allShips, userImageIds, useAllShipsDetails } = useShips()
  
  const { data: tokens, error: tokensError, isLoading: tokensLoading } = useTokensOfOwner()
  const { data: imageIds, error: imageIdsError, isLoading: imageIdsLoading } = useTokensOfOwnerImageIds()
  const { data: balance, error: balanceError, isLoading: balanceLoading } = useShipBalance()
  const allShipsDetails = useAllShipsDetails()

  return (
    <div className="glass-card p-6 mb-6">
      <h3 className="text-lg font-bold mb-4 text-orange-400">🔍 Debug Info</h3>
      
      <div className="space-y-3 text-xs font-mono">
        <div>
          <p className="text-gray-400">Wallet Address:</p>
          <p className="text-white break-all">{address || 'Not connected'}</p>
        </div>

        <div>
          <p className="text-gray-400">Ship NFT Contract Address:</p>
          <p className="text-white break-all">0x41aA73453681fa67D42F35162C20998C60e4459F</p>
        </div>

        <div>
          <p className="text-gray-400">NFT Balance (balanceOf):</p>
          <p className="text-white">
            {balanceLoading ? 'Loading...' : balanceError ? `Error: ${balanceError.message}` : balance?.toString() || '0'}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Token IDs (tokensOfOwner):</p>
          <p className="text-white break-all">
            {tokensLoading ? 'Loading...' : 
             tokensError ? `Error: ${tokensError.message}` : 
             tokens ? JSON.stringify((tokens as bigint[]).map(t => t.toString())) : '[]'}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Image IDs (tokensOfOwnerImageIds):</p>
          <p className="text-white break-all">
            {imageIdsLoading ? 'Loading...' : 
             imageIdsError ? `Error: ${imageIdsError.message}` : 
             imageIds ? JSON.stringify(imageIds) : '[]'}
          </p>
        </div>

        <div>
          <p className="text-gray-400">allShips (from hook):</p>
          <p className="text-white break-all">
            {JSON.stringify(allShips.map(id => id.toString()))}
          </p>
        </div>

        <div>
          <p className="text-gray-400">userImageIds (from hook):</p>
          <p className="text-white break-all">
            {JSON.stringify(userImageIds)}
          </p>
        </div>

        <div>
          <p className="text-gray-400">allShipsDetails:</p>
          <p className="text-white break-all">
            {JSON.stringify(allShipsDetails.map(s => ({
              tokenId: s.tokenId.toString(),
              imageId: s.imageId,
              isStaked: s.isStaked
            })))}
          </p>
        </div>
      </div>
    </div>
  )
}