import { useEffect, useState } from 'react'

export function DogTailCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isClicking, setIsClicking] = useState(false)
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])
  
  return (
    <>
      <div 
        className="custom-cursor"
        style={{
          position: 'fixed',
          left: position.x - 15,
          top: position.y - 15,
          width: '30px',
          height: '30px',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: isClicking ? 'scale(0.8)' : 'scale(1)',
          transition: 'transform 0.1s ease'
        }}
      >
        <span style={{ fontSize: '24px' }}>🐾</span>
      </div>
      
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        a, button, input, textarea, select {
          cursor: none !important;
        }
      `}</style>
    </>
  )
}