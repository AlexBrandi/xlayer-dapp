export function Market() {
  // Placeholder token address for FUEL - replace with actual token address
  const fuelTokenAddress = import.meta.env.VITE_FUEL || '0x0000000000000000000000000000000000000001'
  
  // DexScreener embed URL for WOKB/FUEL pair on X-Layer
  // Replace with actual pair address when available
  const dexScreenerUrl = `https://dexscreener.com/xlayer/${fuelTokenAddress}`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">FUEL Market</h1>
        <a
          href={dexScreenerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Open in DexScreener →
        </a>
      </div>

      <div className="glass-card p-1 rounded-2xl" style={{ height: '80vh' }}>
        <iframe
          src={dexScreenerUrl}
          className="w-full h-full rounded-xl"
          title="DexScreener Chart"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="mt-6 glass-card p-6">
        <h3 className="text-lg font-bold mb-4">Trading Information</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">Token Pair</p>
            <p className="font-mono">WOKB / FUEL</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Network</p>
            <p>X-Layer Mainnet</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">FUEL Contract</p>
            <p className="font-mono text-sm break-all">{fuelTokenAddress}</p>
          </div>
        </div>
      </div>
    </div>
  )
}