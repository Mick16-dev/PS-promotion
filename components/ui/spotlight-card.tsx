'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  spotlightColor?: string
  className?: string
}

export function SpotlightCard({
  children,
  spotlightColor = 'rgba(215, 0, 20, 0.15)', // Custom Rotek Red glow
  className,
  ...props
}: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth springs for the spotlight movement
  const springConfig = { damping: 20, stiffness: 150 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const { left, top } = containerRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - left)
    mouseY.set(e.clientY - top)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative rounded-none border border-white/10 bg-[#0A0B0D] overflow-hidden group",
        className
      )}
      {...props}
    >
      {/* The Spotlight Overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [smoothX, smoothY],
            ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, ${spotlightColor}, transparent 40%)`
          ),
        }}
      />
      
      {/* Content wrapper to ensure children are above the spotlight if needed, or interact with it */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}
