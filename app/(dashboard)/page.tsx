'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Music, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

import { supabase } from '@/lib/supabase'

export default function DashboardHome() {
  const [stats, setStats] = React.useState([
    { name: 'Total Shows', value: '--', icon: Music, color: 'text-primary' },
    { name: 'Pending Materials', value: '--', icon: Clock, color: 'text-yellow-500' },
    { name: 'Submitted Materials', value: '--', icon: CheckCircle2, color: 'text-green-500' },
    { name: 'Overdue Materials', value: '--', icon: AlertCircle, color: 'text-red-500' },
  ])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchStats() {
      // In a real app, these would be separate counts from Supabase
      // e.g. supabase.from('shows').select('*', { count: 'exact' })
      
      // Delaying for effect if needed, but in reality just set counts
      setTimeout(() => {
        setStats([
          { name: 'Total Shows', value: '24', icon: Music, color: 'text-primary' },
          { name: 'Pending Materials', value: '12', icon: Clock, color: 'text-yellow-500' },
          { name: 'Submitted Materials', value: '45', icon: CheckCircle2, color: 'text-green-500' },
          { name: 'Overdue Materials', value: '3', icon: AlertCircle, color: 'text-red-500' },
        ])
        setLoading(false)
      }, 500)
    }
    fetchStats()
  }, [])
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Summary</h1>
          <p className="text-muted-foreground mt-2">Welcome back. Manage your upcoming shows and materials with precision.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/shows">
            <Button variant="outline" className="h-11 px-6 border-white/5 bg-muted/20 hover:bg-muted/40">
              View Shows
            </Button>
          </Link>
          <Link href="/artists">
            <Button className="h-11 px-6 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20">
              Manage Artists
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-6 rounded-xl flex flex-col justify-between group hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <stat.icon className={`h-6 w-6 ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <span className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/60">Live</span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground truncate">{stat.name}</p>
              <p className="text-3xl font-pro-data mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Shows Table */}
        <div className="glass-card rounded-xl overflow-hidden lg:col-span-2">
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight">Recent Activity</h3>
            <Link href="/shows" className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors flex items-center gap-1 group">
              View All <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-muted/30 flex items-center justify-center">
              <Clock size={28} className="text-muted-foreground/40" />
            </div>
            <div>
              <p className="text-sm font-medium">No recent materials found</p>
              <p className="text-xs text-muted-foreground mt-1">Start by requesting production riders from your artists.</p>
            </div>
            <Button size="sm" variant="outline" className="mt-2 h-9 border-white/10 hover:bg-white/5">
              Request Materials
            </Button>
          </div>
        </div>

        {/* Artist Network Status */}
        <div className="glass-card rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold tracking-tight">Artist Network</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Music size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Artist {i}</div>
                    <div className="text-[10px] text-muted-foreground font-pro-data uppercase tracking-wider">Sync Active</div>
                  </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full text-xs font-pro-data border-t border-white/5 rounded-none pt-4 h-auto hover:bg-transparent hover:text-primary">
            EXPAND NETWORK →
          </Button>
        </div>
      </div>
    </div>
  )
}
