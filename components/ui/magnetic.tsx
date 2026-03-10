'use client'

import React from 'react'

interface MagneticProps {
  children: React.ReactElement
  strength?: number
  className?: string
}

export function Magnetic({ children, strength = 0.5, className }: MagneticProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}
