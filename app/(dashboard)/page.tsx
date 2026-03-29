'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { 
  Music, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  ArrowRight,
  Send,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export default function DashboardHome() {
  const router = useRouter()
  const [stats, setStats] = React.useState([
    { name: 'Total Shows', value: '--', icon: Music, color: 'text-primary' },
    { name: 'Pending Materials', value: '--', icon: Clock, color: 'text-yellow-500' },
    { name: 'Submitted Materials', value: '--', icon: CheckCircle2, color: 'text-green-500' },
    { name: 'Overdue Materials', value: '--', icon: AlertCircle, color: 'text-red-500' },
  ])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // Simulated fetching for the dashboard stats
    setTimeout(() => {
      setStats([
        { name: 'Total Shows', value: '24', icon: Music, color: 'text-primary' },
        { name: 'Pending Materials', value: '12', icon: Clock, color: 'text-yellow-500' },
        { name: 'Submitted Materials', value: '45', icon: CheckCircle2, color: 'text-green-500' },
        { name: 'Overdue Materials', value: '3', icon: AlertCircle, color: 'text-red-500' },
      ])
      setLoading(false)
    }, 500)
  }, [])

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">ShowReady Dashboard</h1>
          <p className="text-muted-foreground mt-2 font-medium">System status: <span className="text-emerald-400">All nodes operational</span>. Welcome back, Protocol Lead.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => router.push('/shows')}
            className="h-12 px-8 border-white/10 bg-muted/20 hover:bg-muted/40 font-pro-data tracking-widest uppercase text-xs"
          >
            Monitor Shows
          </Button>
          <Button 
             onClick={() => router.push('/artists')}
             className="h-12 px-8 bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 font-pro-data tracking-widest uppercase text-xs"
          >
            Artist Network
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-8 rounded-3xl flex flex-col justify-between group hover:border-primary/40 transition-all duration-500 bg-muted/5 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                <stat.icon size={80} />
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div className={`p-3 rounded-2xl bg-muted/30 border border-white/5 ${stat.color} group-hover:bg-primary group-hover:text-white transition-all`}>
                  <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground/40 group-hover:text-primary transition-colors">实时 Live</span>
            </div>
            <div className="mt-8 relative z-10">
              <p className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground font-bold">{stat.name}</p>
              <p className="text-4xl font-black mt-2 tracking-tight italic font-pro-data">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Production Feed */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black uppercase tracking-tighter italic">Production Activity</h3>
            <Link href="/shows" className="text-[10px] font-pro-data uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
              View Audit Log <ArrowRight size={12} />
            </Link>
          </div>
          <div className="glass-card rounded-3xl overflow-hidden border-white/5 divide-y divide-white/5 bg-muted/5">
            {[
              { artist: 'Luna Shadows', activity: 'Technical Rider Approved', time: '2h ago', icon: CheckCircle2, color: 'text-emerald-400' },
              { artist: 'Neon Dreams', activity: 'Hospitality Request Sent', time: '5h ago', icon: Send, color: 'text-primary' },
              { artist: 'Echo Pulse', activity: 'Backline Specs Overdue', time: '1d ago', icon: AlertCircle, color: 'text-red-400' },
              { artist: 'The Midnight', activity: 'Stage Plot Received', time: '2d ago', icon: Clock, color: 'text-yellow-400' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all group cursor-pointer" onClick={() => toast.info(`Viewing details for ${activity.artist}...`)}>
                <div className="flex items-center gap-5">
                  <div className={`h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center ${activity.color} group-hover:scale-110 transition-all border border-white/5`}>
                    <activity.icon size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg tracking-tight group-hover:text-primary transition-colors">{activity.artist}</p>
                    <p className="text-sm text-muted-foreground font-medium">{activity.activity}</p>
                  </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/30">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Network Health */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
            <h3 className="text-lg font-black uppercase tracking-tighter italic px-2">Artist Network</h3>
            <div className="glass-card rounded-3xl p-8 border-white/5 bg-muted/10 space-y-8 flex-1">
                <div className="space-y-6">
                    {[
                        { name: 'Luna Shadows', status: 'Online', id: '1' },
                        { name: 'Echo Pulse', status: 'Syncing', id: '2' },
                        { name: 'Neon Dreams', status: 'Active', id: '3' },
                    ].map((artist) => (
                    <div key={artist.id} className="flex items-center justify-between border-b border-white/5 pb-6 last:border-0 last:pb-0 group" onClick={() => toast.success(`${artist.name} production sync verified.`)}>
                        <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/10">
                            <Music size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-white group-hover:text-primary transition-colors">{artist.name}</div>
                            <div className="text-[10px] text-muted-foreground font-pro-data uppercase tracking-widest">Protocol Active</div>
                        </div>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] animate-pulse" />
                    </div>
                    ))}
                </div>
                
                <div className="pt-4">
                    <Button 
                        variant="ghost" 
                        className="w-full h-14 bg-white/[0.02] hover:bg-primary hover:text-white transition-all rounded-2xl border border-white/5 font-pro-data uppercase tracking-widest text-xs gap-3"
                        onClick={() => router.push('/artists')}
                    >
                        Expand Network <ArrowRight size={16} />
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
