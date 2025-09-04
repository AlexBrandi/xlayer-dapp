import { UpgradeRequirementsTable } from '../components/UpgradeRequirementsTable'

export function Whitepaper() {
  return (
    <>
      {/* Sci-fi universe background */}
      <div className="sci-fi-background"></div>
      <div className="spiral-depth"></div>
      <div className="sci-fi-particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${8 + Math.random() * 12}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                🚀 Star Fleet Whitepaper 🚀
              </span>
            </h1>
            <p className="text-lg text-gray-300">Blockchain-Based Fleet Management Game</p>
          </div>

          <div className="space-y-8">
            {/* Game Overview */}
            <section>
              <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <span>🎮</span> Game Overview
              </h2>
              <div className="glass-card p-6 bg-gray-800/30">
                <p className="text-gray-300 leading-relaxed">
                  Star Fleet is a blockchain-based space exploration game where players collect, upgrade, and manage fleets of unique starships. 
                  Each ship is an NFT with distinct attributes and earning potential. Players can stake their ships to earn FUEL tokens, 
                  purchase rare gems to upgrade their vessels, and build the ultimate space fleet.
                </p>
              </div>
            </section>

            {/* Core Mechanics */}
            <section>
              <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <span>⚙️</span> Core Game Mechanics
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card p-6 bg-blue-500/10 border border-blue-500/30">
                  <h3 className="text-lg font-bold text-blue-400 mb-3">🛸 Ship Collection</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Mint unique starships with random attributes</li>
                    <li>• 15 different ship designs with varying rarities</li>
                    <li>• Each ship has levels 1-5 with upgrade potential</li>
                    <li>• Ships generate FUEL tokens when staked</li>
                  </ul>
                </div>

                <div className="glass-card p-6 bg-green-500/10 border border-green-500/30">
                  <h3 className="text-lg font-bold text-green-400 mb-3">💎 Staking System</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Stake ships to earn FUEL rewards over time</li>
                    <li>• Higher level ships earn more rewards</li>
                    <li>• Claim rewards anytime without unstaking</li>
                    <li>• Batch staking for multiple ships</li>
                  </ul>
                </div>

                <div className="glass-card p-6 bg-purple-500/10 border border-purple-500/30">
                  <h3 className="text-lg font-bold text-purple-400 mb-3">⬆️ Ship Upgrades</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Upgrade ships using FUEL + gems</li>
                    <li>• 3 gem types: Sapphire, Sunstone, Lithium</li>
                    <li>• Higher levels require more resources</li>
                    <li>• Upgraded ships earn significantly more FUEL</li>
                  </ul>
                </div>

                <div className="glass-card p-6 bg-orange-500/10 border border-orange-500/30">
                  <h3 className="text-lg font-bold text-orange-400 mb-3">💰 Economy</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• FUEL: Primary currency for purchases</li>
                    <li>• Purchase gems with FUEL in the market</li>
                    <li>• Deflationary model through upgrades</li>
                    <li>• Sustainable reward distribution</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Ship Details */}
            <section>
              <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <span>🛸</span> Ship Classification
              </h2>
              
              <div className="glass-card p-6 bg-gray-800/30">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-400 mb-3">Rarity Tiers</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Common</span>
                        <span className="text-gray-400 text-sm">Ships 0-3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-400">Rare</span>
                        <span className="text-blue-400 text-sm">Ships 4-7</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-400">Epic</span>
                        <span className="text-purple-400 text-sm">Ships 8-10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-orange-400">Legendary</span>
                        <span className="text-orange-400 text-sm">Ships 11-14</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-green-400 mb-3">Level Benefits</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Level 1:</span>
                        <span className="text-white">Base FUEL earning rate</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Level 2:</span>
                        <span className="text-white">+25% FUEL rewards</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Level 3:</span>
                        <span className="text-white">+50% FUEL rewards</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Level 4:</span>
                        <span className="text-white">+100% FUEL rewards</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Level 5:</span>
                        <span className="text-white">+200% FUEL rewards</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Upgrade Costs */}
            <section>
              <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <span>💎</span> Upgrade Requirements
              </h2>
              
              <div className="glass-card p-6 bg-gray-800/30">
                <UpgradeRequirementsTable />
              </div>
            </section>

            {/* Tokenomics */}
            <section>
              <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <span>🪙</span> Tokenomics
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card p-6 bg-green-500/10 border border-green-500/30">
                  <h3 className="text-lg font-bold text-green-400 mb-3">FUEL Token</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Primary game currency (ERC-20)</li>
                    <li>• Earned through ship staking</li>
                    <li>• Used to purchase gems</li>
                    <li>• Required for ship upgrades</li>
                    <li>• Deflationary through game mechanics</li>
                  </ul>
                </div>

                <div className="glass-card p-6 bg-purple-500/10 border border-purple-500/30">
                  <h3 className="text-lg font-bold text-purple-400 mb-3">NFT Assets</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Ships: ERC-721 collectibles</li>
                    <li>• Gems: ERC-1155 consumable resources</li>
                    <li>• Permanent ownership and trading</li>
                    <li>• Cross-platform compatibility</li>
                    <li>• Provable rarity and uniqueness</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Game Strategy */}
            <section>
              <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <span>🎯</span> Strategy Guide
              </h2>
              
              <div className="glass-card p-6 bg-gray-800/30">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-3">Early Game Strategy</h3>
                    <ol className="space-y-2 text-gray-300 text-sm list-decimal list-inside">
                      <li>Mint your first ships to start earning FUEL</li>
                      <li>Stake all ships immediately to begin reward generation</li>
                      <li>Accumulate FUEL before purchasing expensive gems</li>
                      <li>Focus on upgrading one ship to level 2-3 first</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-3">Mid Game Strategy</h3>
                    <ol className="space-y-2 text-gray-300 text-sm list-decimal list-inside">
                      <li>Purchase gems strategically based on upgrade costs</li>
                      <li>Prioritize upgrading rare/epic ships for better returns</li>
                      <li>Balance between expanding fleet and upgrading existing ships</li>
                      <li>Consider gem market prices before large purchases</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-3">Advanced Strategy</h3>
                    <ol className="space-y-2 text-gray-300 text-sm list-decimal list-inside">
                      <li>Build a diverse fleet with multiple high-level ships</li>
                      <li>Optimize staking schedules for maximum FUEL generation</li>
                      <li>Plan upgrade paths to achieve level 5 legendary ships</li>
                      <li>Manage resource allocation across multiple assets</li>
                    </ol>
                  </div>
                </div>
              </div>
            </section>

            {/* Technical Details */}
            <section>
              <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <span>🔧</span> Technical Implementation
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card p-6 bg-blue-500/10 border border-blue-500/30">
                  <h3 className="text-lg font-bold text-blue-400 mb-3">Smart Contracts</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-400">Ship NFT Contract:</p>
                      <p className="text-white font-mono text-xs break-all">0xe80312d9F235ac2f816D5f63C4f06941F2c0d687</p>
                    </div>
                    <div>
                      <p className="text-gray-400">FUEL Token Contract:</p>
                      <p className="text-white font-mono text-xs break-all">0x41aA73453681fa67D42F35162C20998C60e4459F</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Gem NFT Contract:</p>
                      <p className="text-white font-mono text-xs break-all">0x152De2380eBb164173E855D2feFe09d98dC965dc</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Game Controller:</p>
                      <p className="text-white font-mono text-xs break-all">0xC7616b62aFb1E9Edbd1aA4F932342db829E4e1Fc</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 bg-orange-500/10 border border-orange-500/30">
                  <h3 className="text-lg font-bold text-orange-400 mb-3">Blockchain Features</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Deployed on BNB Chain</li>
                    <li>• ERC-721 ships with metadata</li>
                    <li>• ERC-1155 multi-token gems</li>
                    <li>• ERC-20 FUEL token standard</li>
                    <li>• Immutable game logic</li>
                    <li>• Decentralized ownership</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Gem Market */}
            <section>
              <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <span>💎</span> Gem Market & Resources
              </h2>
              
              <div className="glass-card p-6 bg-gray-800/30">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-blue-500/30 rounded-lg bg-blue-500/10">
                    <div className="mb-4">
                      <img 
                        src="/images/sapphire.png" 
                        alt="Sapphire"
                        className="w-16 h-16 mx-auto object-contain drop-shadow-lg"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-blue-400 mb-2">Sapphire</h3>
                    <p className="text-gray-300 text-sm">Rare blue gems essential for ship upgrades. The primary resource needed for most upgrade levels.</p>
                  </div>

                  <div className="text-center p-4 border border-orange-500/30 rounded-lg bg-orange-500/10">
                    <div className="mb-4">
                      <img 
                        src="/images/sunstone.png" 
                        alt="Sunstone"
                        className="w-16 h-16 mx-auto object-contain drop-shadow-lg"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-orange-400 mb-2">Sunstone</h3>
                    <p className="text-gray-300 text-sm">Radiant gems that power ship systems. Required in moderate quantities for upgrades.</p>
                  </div>

                  <div className="text-center p-4 border border-purple-500/30 rounded-lg bg-purple-500/10">
                    <div className="mb-4">
                      <img 
                        src="/images/lithium.png" 
                        alt="Lithium"
                        className="w-16 h-16 mx-auto object-contain drop-shadow-lg"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-purple-400 mb-2">Lithium</h3>
                    <p className="text-gray-300 text-sm">Essential minerals for advanced upgrades. Rare resource needed for higher-level ships.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Roadmap */}
            <section>
              <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <span>🗺️</span> Roadmap & Future Features
              </h2>
              
              <div className="glass-card p-6 bg-gray-800/30">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-lg font-bold text-green-400">Phase 1: Core Game ✅</h3>
                      <p className="text-gray-300 text-sm">Ship minting, staking system, upgrade mechanics, gem market</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-lg font-bold text-yellow-400">Phase 2: Enhanced Features 🚧</h3>
                      <p className="text-gray-300 text-sm">Ship battles, fleet missions, leaderboards, additional ship types</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-lg font-bold text-blue-400">Phase 3: Ecosystem Expansion 🔮</h3>
                      <p className="text-gray-300 text-sm">Cross-chain integration, governance tokens, community features, mobile app</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* How to Play */}
            <section>
              <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <span>🎮</span> How to Play
              </h2>
              
              <div className="glass-card p-6 bg-gray-800/30">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-green-400 mb-4">Getting Started</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="bg-cyan-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">1</span>
                        <div>
                          <p className="text-white font-medium">Connect Wallet</p>
                          <p className="text-gray-400 text-sm">Connect your Web3 wallet to BNB Chain</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <span className="bg-cyan-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">2</span>
                        <div>
                          <p className="text-white font-medium">Mint Ships</p>
                          <p className="text-gray-400 text-sm">Purchase your first starships with FUEL tokens</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <span className="bg-cyan-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">3</span>
                        <div>
                          <p className="text-white font-medium">Stake & Earn</p>
                          <p className="text-gray-400 text-sm">Stake ships to start earning FUEL rewards</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-green-400 mb-4">Advanced Gameplay</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="bg-purple-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">4</span>
                        <div>
                          <p className="text-white font-medium">Buy Gems</p>
                          <p className="text-gray-400 text-sm">Purchase upgrade materials in the gem market</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <span className="bg-purple-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">5</span>
                        <div>
                          <p className="text-white font-medium">Upgrade Ships</p>
                          <p className="text-gray-400 text-sm">Use gems and FUEL to increase ship levels</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <span className="bg-purple-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">6</span>
                        <div>
                          <p className="text-white font-medium">Optimize Fleet</p>
                          <p className="text-gray-400 text-sm">Build a diverse, high-level fleet for maximum returns</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Important Notes */}
            <section>
              <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <span>⚠️</span> Important Information
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400">💡</span>
                    <span className="text-sm font-medium text-yellow-400">Tip</span>
                  </div>
                  <p className="text-sm text-yellow-300">
                    Higher level ships generate significantly more FUEL rewards. Prioritize upgrading frequently used ships for optimal returns.
                  </p>
                </div>

                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-400">⚠️</span>
                    <span className="text-sm font-medium text-red-400">Risk Notice</span>
                  </div>
                  <p className="text-sm text-red-300">
                    This is a blockchain game involving real cryptocurrency transactions. Only invest what you can afford to lose. 
                    Smart contracts are audited but may contain risks.
                  </p>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-400">🛡️</span>
                    <span className="text-sm font-medium text-blue-400">Security</span>
                  </div>
                  <p className="text-sm text-blue-300">
                    Always verify contract addresses and never share your private keys. Use official links only and be cautious of phishing attempts.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact & Community */}
            <section>
              <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <span>🌐</span> Community & Updates
              </h2>
              
              <div className="glass-card p-6 bg-gray-800/30">
                <div className="text-center">
                  <p className="text-gray-300 mb-4">
                    Stay connected with the Star Fleet community for updates, strategy discussions, and announcements.
                  </p>
                  
                  <div className="flex justify-center">
                    <a
                      href="https://x.com/ShipWarBnb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Follow @ShipWarBnb
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}