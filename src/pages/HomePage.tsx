import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { useState } from 'react'

const DOG_CHARACTERS = [
  {
    id: 1,
    name: "FluffyInu",
    title: "The Emotional Investor",
    image: "/dog/Generated Image September 06, 2025 - 6_58PM (1).jpeg",
    description: "Feeling sad about missed opportunities? FluffyInu knows the pain.",
    personality: "Melancholic but loyal",
    special: "Gold Chain Collector",
    icon: "📉"
  },
  {
    id: 2,
    name: "RocketCorgi",
    title: "The Moon Chaser",
    image: "/dog/Generated Image September 06, 2025 - 6_58PM (2).jpeg",
    description: "Ready to rocket to the moon! This corgi never misses a pump.",
    personality: "Adventurous & Bold",
    special: "Jetpack Navigator",
    icon: "🚀"
  },
  {
    id: 3,
    name: "ValueRetriever",
    title: "The Optimistic Trader",
    image: "/dog/Generated Image September 06, 2025 - 6_58PM (3).jpeg",
    description: "Finding value where others see trash. Always optimistic!",
    personality: "Cheerful & Resourceful",
    special: "Dumpster Diving Expert",
    icon: "💰"
  },
  {
    id: 4,
    name: "BizBulldog",
    title: "The Serious Trader",
    image: "/dog/Generated Image September 06, 2025 - 6_58PM (4).jpeg",
    description: "All business, no bark. This bulldog means serious profits.",
    personality: "Professional & Focused",
    special: "OKX Certified",
    icon: "📊"
  },
  {
    id: 5,
    name: "TreasureDachshund",
    title: "The Hidden Gem Finder",
    image: "/dog/Generated Image September 06, 2025 - 6_58PM.jpeg",
    description: "Digging deep for those hidden treasures others overlook.",
    personality: "Persistent & Lucky",
    special: "Treasure Hunter",
    icon: "💎"
  }
]

export function HomePage() {
  const { isConnected } = useAccount()
  const [selectedDog, setSelectedDog] = useState<number | null>(null)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100 opacity-50"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text animate-pulse">
            BabyDog Dumpster Retrievers
          </h1>
          <p className="text-2xl md:text-3xl mb-8 text-poop-brown-dark font-handwritten">
            Finding treasure where others see trash! 🗑️💰
          </p>
          
          {/* Floating dog emojis */}
          <div className="absolute -top-10 left-10 text-4xl animate-float">🐕</div>
          <div className="absolute -top-5 right-20 text-3xl animate-float" style={{animationDelay: '1s'}}>🦴</div>
          <div className="absolute bottom-0 left-1/4 text-4xl animate-float" style={{animationDelay: '2s'}}>🗑️</div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-12">
            <Link to="/mint" className="btn btn-primary text-2xl px-8 py-4 transform hover:scale-110 transition-all">
              🐕 Mint Your BabyDog
            </Link>
            {!isConnected && (
              <p className="text-lg text-poop-brown-medium">Connect wallet to start minting!</p>
            )}
          </div>
        </div>
      </section>

      {/* Characters Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">
            Meet the Dumpster Retriever Crew
          </h2>
          <p className="text-xl text-center mb-12 text-poop-brown-medium">
            Each BabyDog has unique traits and personalities!
          </p>

          {/* Character Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {DOG_CHARACTERS.map((dog) => (
              <div
                key={dog.id}
                className={`glass-card p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                  selectedDog === dog.id ? 'ring-4 ring-cute-pink' : ''
                }`}
                onClick={() => setSelectedDog(dog.id)}
              >
                <div className="relative mb-4">
                  <img 
                    src={dog.image} 
                    alt={dog.name}
                    className="w-full h-48 object-cover rounded-xl border-4 border-poop-brown-medium"
                  />
                  <span className="absolute top-2 right-2 text-3xl">{dog.icon}</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-1">{dog.name}</h3>
                <p className="text-sm text-cute-purple font-semibold mb-2">{dog.title}</p>
                <p className="text-sm mb-3">{dog.description}</p>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">Personality:</span>
                    <span className="text-poop-brown-medium">{dog.personality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Special:</span>
                    <span className="text-cute-orange">{dog.special}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Dog Details */}
          {selectedDog && (
            <div className="glass-card p-8 max-w-2xl mx-auto animate-scale-in">
              <h3 className="text-3xl font-bold mb-4 text-center gradient-text">
                You selected {DOG_CHARACTERS.find(d => d.id === selectedDog)?.name}!
              </h3>
              <p className="text-center text-lg mb-6">
                Great choice! Each BabyDog NFT will be randomly assigned traits, but they all share the spirit of finding value in unexpected places.
              </p>
              <Link to="/mint" className="btn btn-primary w-full text-xl">
                Mint This Dumpster Retriever! 🐕
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-transparent to-bg-light-pink">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
            Why BabyDog NFTs?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">Unique Art</h3>
              <p>Hand-drawn characters with personality and charm</p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-xl font-bold mb-2">Hidden Value</h3>
              <p>Like finding treasure in trash, each NFT has potential</p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="text-5xl mb-4">🌐</div>
              <h3 className="text-xl font-bold mb-2">OKX Chain</h3>
              <p>Low fees and fast transactions on OKX blockchain</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 gradient-text">
            Ready to Join the Pack? 
          </h2>
          <p className="text-2xl mb-8 text-poop-brown-medium">
            Don't let these treasures slip away!
          </p>
          <Link to="/mint" className="btn btn-primary text-3xl px-12 py-6 transform hover:scale-110 transition-all inline-flex items-center gap-3">
            <span>Start Minting</span>
            <span className="animate-bounce">🐕</span>
          </Link>
        </div>
      </section>
    </div>
  )
}