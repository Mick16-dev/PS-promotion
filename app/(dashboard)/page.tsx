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
        {/* Recent Activity Feed */}
        <div className="glass-card rounded-xl overflow-hidden lg:col-span-2">
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-muted/20">
            <h3 className="text-lg font-semibold tracking-tight">Recent Production Activity</h3>
            <Link href="/shows" className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors flex items-center gap-1 group uppercase tracking-widest font-pro-data">
              Global Feed <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { artist: 'Luna Shadows', activity: 'Technical Rider Approved', time: '2h ago', icon: CheckCircle2, color: 'text-emerald-400' },
              { artist: 'Neon Dreams', activity: 'Hospitality Request Sent', time: '5h ago', icon: Send, color: 'text-primary' },
              { artist: 'Echo Pulse', activity: 'Backline Specs Overdue', time: '1d ago', icon: AlertCircle, color: 'text-red-400' },
              { artist: 'The Midnight', activity: 'Stage Plot Received', time: '2d ago', icon: Clock, color: 'text-yellow-400' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 hover:bg-white/[0.01] transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center ${activity.color} group-hover:scale-110 transition-transform`}>
                    <activity.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{activity.artist}</p>
                    <p className="text-xs text-muted-foreground">{activity.activity}</p>
                  </div>
                </div>
                <span className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/40">{activity.time}</span>
              </div>
            ))}
          </div>
          <div className="p-4 bg-muted/10 border-t border-white/5 text-center">
             <Button variant="ghost" size="sm" className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-transparent">
                REFRESH AUDIT LOG
             </Button>
          </div>
        </div>

        {/* Artist Network Status */}
        <div className="glass-card rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold tracking-tight uppercase font-pro-data tracking-[0.15em] text-white/80">Artist Network</h3>
          <div className="space-y-4">
            {[
              { name: 'Luna Shadows', status: 'Online', id: '1' },
              { name: 'Echo Pulse', status: 'Syncing', id: '2' },
              { name: 'Neon Dreams', status: 'Active', id: '3' },
            ].map((artist) => (
              <div key={artist.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/10 border border-white/5 group hover:border-primary/20 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Music size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold group-hover:text-primary transition-colors">{artist.name}</div>
                    <div className="text-[10px] text-muted-foreground font-pro-data uppercase tracking-wider">Production Sync</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[9px] font-pro-data text-muted-foreground/60 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">LIVE</span>
                   <div className="h-2 w-2 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <Link href="/artists">
            <Button variant="ghost" className="w-full text-xs font-pro-data border-t border-white/5 rounded-none pt-4 h-auto hover:bg-transparent hover:text-primary uppercase tracking-widest mt-2">
              EXPAND NETWORK →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
