import { useEffect, useState } from 'react'

export function FloatingPoops() {
  const [poops, setPoops] = useState<{ id: number; left: number; animationDelay: number }[]>([])
  
  useEffect(() => {
    const generatePoops = () => {
      const newPoops = []
      for (let i = 0; i < 15; i++) {
        newPoops.push({
          id: i,
          left: Math.random() * 100,
          animationDelay: Math.random() * 10
        })
      }
      setPoops(newPoops)
    }
    
    generatePoops()
  }, [])
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {poops.map((poop) => (
        <div
          key={poop.id}
          className="poop-particle"
          style={{
            left: `${poop.left}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${poop.animationDelay}s`
          }}
        >
          💩
        </div>
      ))}
    </div>
  )
}