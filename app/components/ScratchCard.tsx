"use client"

import { useEffect, useRef, useState, ReactNode } from 'react'

type ScratchCardProps = {
  onReveal?: () => void
  children?: ReactNode
  containerClassName?: string
  contentClassName?: string
}

export default function ScratchCard({
  onReveal,
  children,
  containerClassName,
  contentClassName,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [revealed, setRevealed] = useState(false)
  
  // Set dimensions dynamically based on container content
  const [dimensions, setDimensions] = useState({ width: 680, height: 280 })

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      // Use fallback minimums if it renders too small early on
      setDimensions({ width: Math.max(width, 420), height: Math.max(height, 220) })
    }
  }, [children])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Create a modern dark-blue scratch layer
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#0a1730')
    gradient.addColorStop(0.5, '#15335d')
    gradient.addColorStop(1, '#091523')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add pattern or noise
    ctx.fillStyle = 'rgba(120,170,245,0.16)'
    for(let i=0; i < 500; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2)
    }

    ctx.fillStyle = 'rgba(228,238,255,0.92)'
    ctx.font = '600 17px sans-serif'
    ctx.textAlign = 'center'
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
    <div
      className={`relative group mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[rgba(53,88,140,0.55)] ${containerClassName ?? ''}`}
      ref={containerRef}
    >
      {/* Background content (The real details to be revealed) */}
      <div
        className={`min-h-[240px] bg-[rgba(7,10,20,0.92)] px-6 py-8 sm:px-10 flex items-center justify-center pointer-events-none ${contentClassName ?? ''}`}
      >
        {children}
      </div>
      
      {/* Scratch canvas overlay */}
      {!revealed && (
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          data-scratch-overlay="true"
          className="absolute inset-0 z-10 w-full h-full touch-none cursor-pointer"
          onPointerDown={(event) => scratch(event.clientX, event.clientY)}
          onPointerMove={(event) => event.buttons === 1 && scratch(event.clientX, event.clientY)}
        />
      )}
    </div>
  )
}
