'use client'

import React from 'react'
import { Bell, Search, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-border bg-background/80 backdrop-blur-md px-6">
      <div className="flex flex-1 items-center space-x-4">
        {/* Pro Search Bar */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Quick hunt for shows or artists..."
            className="w-full bg-muted/40 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary/40 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center space-x-5">
        <button className="relative p-2 rounded-full hover:bg-muted/50 transition-all group">
          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-background animate-pulse" />
        </button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-border group cursor-pointer transition-all">
          <div className="text-right">
            <p className="text-sm font-semibold tracking-tight leading-none group-hover:text-primary transition-colors">Mick G.</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 font-mono">Promoter</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted border border-border overflow-hidden">
             <User size={20} className="text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  )
}
