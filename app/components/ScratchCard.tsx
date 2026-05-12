"use client"

import { useEffect, useRef, useState, ReactNode } from 'react'

type ScratchCardProps = {
  onReveal?: () => void
  children?: ReactNode
}

export default function ScratchCard({ onReveal, children }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [revealed, setRevealed] = useState(false)
  
  // Set dimensions dynamically based on container content
  const [dimensions, setDimensions] = useState({ width: 420, height: 250 })

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      // Use fallback minimums if it renders too small early on
      setDimensions({ width: Math.max(width, 300), height: Math.max(height, 200) })
    }
  }, [children])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Create an elegant gold scratch layer
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#856A28')
    gradient.addColorStop(0.5, '#C9A653')
    gradient.addColorStop(1, '#6F5419')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add pattern or noise
    ctx.fillStyle = 'rgba(255,255,255,0.1)'
    for(let i=0; i < 500; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2)
    }

    ctx.fillStyle = '#0a0a0a'
    ctx.font = '600 18px sans-serif'
    ctx.textAlign = 'center'
    ctx.letterSpacing = '4px'
    ctx.fillText('ZOTRITE PRE ODOMKNUTIE', canvas.width / 2, canvas.height / 2)
  }, [dimensions])

  const scratch = (clientX: number, clientY: number) => {
    if (revealed) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(clientX - rect.left, clientY - rect.top, 30, 0, Math.PI * 2)
    ctx.fill()

    const image = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let cleared = 0
    for (let index = 3; index < image.data.length; index += 4) {
      if (image.data[index] === 0) cleared += 1
    }
    
    // Reveal if 50% is cleared
    if (cleared / (canvas.width * canvas.height) > 0.5 && !revealed) {
      setRevealed(true)
      onReveal?.()
    }
  }

  return (
    <div className="relative group mx-auto w-full max-w-sm rounded-lg overflow-hidden border border-[#c4a661]/40" ref={containerRef}>
      {/* Background content (The real details to be revealed) */}
      <div className="bg-black/40 backdrop-blur-sm p-8 min-h-[250px] flex items-center justify-center pointer-events-none">
        {children}
      </div>
      
      {/* Scratch canvas overlay */}
      {!revealed && (
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="absolute inset-0 z-10 w-full h-full touch-none cursor-pointer"
          onPointerDown={(event) => scratch(event.clientX, event.clientY)}
          onPointerMove={(event) => event.buttons === 1 && scratch(event.clientX, event.clientY)}
        />
      )}
    </div>
  )
}