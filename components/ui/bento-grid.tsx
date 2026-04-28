'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BentoPanelProps {
  children: React.ReactNode
  className?: string
  title?: string
  icon?: React.ElementType
  status?: 'healthy' | 'warning' | 'critical'
}

export function BentoPanel({ children, className, title, icon: Icon, status }: BentoPanelProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl bg-surface-elevated border-tactical hover-cockpit-glow group",
      className
    )}>
      {/* Subtle Background Detail */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      
      {/* Header (Optional) */}
      {(title || Icon) && (
        <div className="flex items-center justify-between p-4 pb-2 border-b border-white/[0.03]">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-primary" />}
            {title && <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">{title}</h3>}
          </div>
          {status && <StatusPing variant={status} />}
        </div>
      )}
      
      <div className="p-4 relative z-10">
        {children}
      </div>
    </div>
  )
}

export function StatusPing({ variant = 'healthy' }: { variant?: 'healthy' | 'warning' | 'critical' | 'teal' }) {
  const colors = {
    healthy: 'bg-success',
    warning: 'bg-warning',
    critical: 'bg-error',
    teal: 'bg-primary'
  }
  
  return (
    <div className="relative flex h-2 w-2">
      <span className={cn(
        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
        colors[variant]
      )}></span>
      <span className={cn(
        "relative inline-flex rounded-full h-2 w-2",
        colors[variant]
      )}></span>
    </div>
  )
}

export function TelemetryLine({ label, value, mono = true }: { label: string, value: string | number, mono?: boolean }) {
  return (
    <div className="flex justify-between items-baseline py-1.5 border-b border-white/[0.03] last:border-0">
      <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50">{label}</span>
      <span className={cn(
        "text-sm",
        mono ? "text-raw-data text-white italic" : "font-semibold text-foreground"
      )}>
        {value || '---'}
      </span>
    </div>
  )
}

interface ArtistStatusAvatarProps {
  src?: string
  fallback: string
  status: {
    contract: boolean
    rider: boolean
    presskit: boolean
  }
  size?: 'sm' | 'md' | 'lg'
}

export function ArtistStatusAvatar({ src, fallback, status, size = 'md' }: ArtistStatusAvatarProps) {
  const sizes = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  }
  
  const strokeWidth = 2
  const center = 32 // Based on md size (64px)
  const radius = center - strokeWidth
  const circumference = 2 * Math.PI * radius
  
  // 3 segments
  const segment = circumference / 3
  const gap = 2 // pixels gap between segments
  const dashLength = segment - gap
  
  return (
    <div className={cn("relative flex items-center justify-center", sizes[size])}>
      {/* Segmented SVG Ring */}
      <svg className="absolute inset-0 -rotate-90 w-full h-full" viewBox="0 0 64 64">
        {/* Contract Segment */}
        <circle
          cx="32" cy="32" r={radius}
          fill="none"
          stroke={status.contract ? "var(--primary)" : "rgba(255,255,255,0.05)"}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dashLength} ${circumference - dashLength}`}
          strokeDashoffset={0}
          className={cn("transition-all duration-700", status.contract && "drop-shadow-[0_0_3px_rgba(20,184,166,0.5)]")}
        />
        {/* Rider Segment */}
        <circle
          cx="32" cy="32" r={radius}
          fill="none"
          stroke={status.rider ? "var(--primary)" : "rgba(255,255,255,0.05)"}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dashLength} ${circumference - dashLength}`}
          strokeDashoffset={-segment}
          className={cn("transition-all duration-700 delay-100", status.rider && "drop-shadow-[0_0_3px_rgba(20,184,166,0.5)]")}
        />
        {/* Press Kit Segment */}
        <circle
          cx="32" cy="32" r={radius}
          fill="none"
          stroke={status.presskit ? "var(--primary)" : "rgba(255,255,255,0.05)"}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dashLength} ${circumference - dashLength}`}
          strokeDashoffset={-segment * 2}
          className={cn("transition-all duration-700 delay-200", status.presskit && "drop-shadow-[0_0_3px_rgba(20,184,166,0.5)]")}
        />
      </svg>
      
      {/* Avatar Image/Fallback */}
      <div className="h-[80%] w-[80%] rounded-full overflow-hidden bg-surface-base border border-white/10 relative z-10">
        {src ? (
          <img src={src} alt={fallback} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground font-bold uppercase italic">
            {(fallback || '??').substring(0, 2)}
          </div>
        )}
      </div>
    </div>
  )
}

export function DataStream({ color = 'var(--primary)' }: { color?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-[1px] w-full"
          style={{ 
            backgroundColor: color,
            top: `${20 + i * 15}%`,
            left: '-100%'
          }}
          animate={{ 
            left: ['-100%', '200%'],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}
