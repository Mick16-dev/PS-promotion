'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, User, LogOut, CheckCircle2, AlertCircle, Clock3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { supabase } from '@/lib/supabase'

export function Navbar() {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center border-b border-white/5 bg-background/80 backdrop-blur-xl px-10">
      <div className="flex flex-1 items-center space-x-6">
        {/* Search Bar */}
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search by artist or venue..."
            className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold tracking-tight focus:border-primary/50 focus:bg-white/10 transition-all outline-none text-white placeholder:text-muted-foreground/40"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group">
              <Bell className="h-5 w-5 text-muted-foreground group-hover:text-white" />
              <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-red-500 border-[3px] border-background animate-pulse flex items-center justify-center text-[8px] font-black text-white">
                 3
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 bg-ebony-900/95 backdrop-blur-3xl border-white/10 p-2 rounded-3xl shadow-2xl">
              <DropdownMenuLabel className="font-pro-data uppercase tracking-widest text-[10px] text-muted-foreground/60 px-4 py-3 border-b border-white/5 mb-2">Recent Notifications</DropdownMenuLabel>
              
              <DropdownMenuItem className="p-4 rounded-2xl hover:bg-white/5 cursor-pointer flex gap-4 items-start mb-1 transition-all">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mt-0.5">
                      <CheckCircle2 size={18} />
                  </div>
                  <div>
                      <p className="font-medium text-sm leading-snug">
                          <strong className="text-white">Daisy Chapman</strong> delivered <strong className="text-emerald-400">EPK</strong><br/>
                          for Lagerhaus Bremen
                      </p>
                      <span className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/40 font-bold mt-2 block">2 hours ago</span>
                  </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="p-4 rounded-2xl hover:bg-white/5 cursor-pointer flex gap-4 items-start mb-1 transition-all">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mt-0.5">
                      <AlertCircle size={18} />
                  </div>
                  <div>
                      <p className="font-medium text-sm leading-snug">
                          <strong className="text-red-400">Technical Rider</strong> is 3 days late<br/>
                          <strong className="text-white">Luna Shadows</strong> — O2 Academy
                      </p>
                      <span className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/40 font-bold mt-2 block">1 day ago</span>
                  </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="p-4 rounded-2xl hover:bg-white/5 cursor-pointer flex gap-4 items-start transition-all">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mt-0.5">
                      <Clock3 size={18} />
                  </div>
                  <div>
                      <p className="font-medium text-sm leading-snug">
                          <strong className="text-amber-400">Contract</strong> due in 2 days<br/>
                          <strong className="text-white">Echo Pulse</strong> — Printworks
                      </p>
                      <span className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/40 font-bold mt-2 block">2 days ago</span>
                  </div>
              </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex items-center space-x-4 pl-6 border-l border-white/5">
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-white hover:bg-white/5 gap-2 px-4 rounded-xl font-pro-data uppercase tracking-widest text-xs font-bold h-11"
            onClick={handleSignOut}
          >
              <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
