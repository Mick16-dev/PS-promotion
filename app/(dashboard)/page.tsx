'use client'

import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronRight, 
  Bell, 
  ArrowUpRight,
  TrendingUp,
  Music,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Search,
  User,
  ExternalLink,
  MapPin,
  Clock4,
  Plus
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalShows: 0,
    awaitingDocs: 0,
    overdueDocs: 0,
    upcomingDeals: 0
  })
  
  const [overdueItems, setOverdueItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function fetchDashboardData() {
    try {
      setIsLoading(true)
      const { data: shows, error: showsErr } = await supabase
        .from('shows')
        .select('*')
        .order('show_date')
      
      const { data: materials, error: matsErr } = await supabase
        .from('materials')
        .select('*')
        .not('status', 'eq', 'delivered')
        .not('status', 'eq', 'submitted')

      if (showsErr || matsErr) throw showsErr || matsErr

      if (shows) {
        let awaitingCount = 0
        const overdueList: any[] = []
        const now = new Date()

        shows?.forEach((show: any) => {
          const showMats = materials?.filter((m: any) => m.show_id === show.id) || []
          
          if (showMats.length === 0) {
            // Respect the user's 5-document standard with human terminology
            awaitingCount += 5
          } else {
            showMats.forEach((mat: any) => {
              const deadline = mat.deadline ? new Date(mat.deadline) : null
              const isLate = deadline && deadline < now
              
              if (isLate) {
                overdueList.push({
                  id: mat.id,
                  artist: show.artist_name,
                  venue: show.venue,
                  document: mat.item_name || 'Requirement',
                  deadline: mat.deadline,
                  showId: show.id
                })
              } else {
                awaitingCount++
              }
            })
          }
        })

        setStats({
          totalShows: shows.length,
          awaitingDocs: awaitingCount,
          overdueDocs: overdueList.length,
          upcomingDeals: 0
        })
        setOverdueItems(overdueList.slice(0, 5))
      }
    } catch (err: any) {
      console.error('Data Fetch Failure:', err)
      toast.error('Sync Error', { description: 'Check your connection' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()

    const showsSub = supabase.channel('shows-dash').on('postgres_changes', { event: '*', schema: 'public', table: 'shows' }, () => fetchDashboardData()).subscribe()
    const matsSub = supabase.channel('mats-dash').on('postgres_changes', { event: '*', schema: 'public', table: 'materials' }, () => fetchDashboardData()).subscribe()

    return () => {
      supabase.removeChannel(showsSub)
      supabase.removeChannel(matsSub)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="h-12 w-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">Preparing your space</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto pb-20 pt-8">
      {/* Header Section - Human Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Live Updates Active</span>
           </div>
           <h1 className="text-6xl font-bold tracking-[-0.05em] text-white leading-tight">
            Hi, Promoter. <br/>
            <span className="text-white/40">Here is your week.</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
           <Button variant="outline" className="h-14 w-14 rounded-2xl bg-white/[0.03] border-white/5 text-white/40 hover:text-white transition-all">
             <Bell size={20} />
           </Button>
           <Button className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-white/90 gap-3 font-bold text-sm tracking-tight transition-transform active:scale-95 shadow-2xl shadow-white/10">
             <Plus size={20} /> Add New Show
           </Button>
        </div>
      </div>

      {/* Main Stats - Minimal & Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { label: 'Upcoming Shows', value: stats.totalShows, icon: CalendarIcon, color: 'text-white' },
          { label: 'Awaiting Documents', value: stats.awaitingDocs, icon: Clock4, color: 'text-amber-400' },
          { label: 'Overdue Clearances', value: stats.overdueDocs, icon: AlertCircle, color: 'text-rose-500' }
        ].map((stat, i) => (
          <div key={i} className="group glass-card p-10 rounded-[3rem] border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-700 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-all group-hover:scale-110">
                <stat.icon size={120} strokeWidth={1} />
             </div>
             <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-6">{stat.label}</p>
             <div className="flex items-end gap-3">
                <span className={`text-6xl font-bold tracking-tight leading-none ${stat.color}`}>{stat.value}</span>
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white/40 transition-colors mb-1">
                   <ArrowUpRight size={20} />
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Overdue Section - Human Centric */}
        <div className="md:col-span-8 flex flex-col">
          <div className="glass-card rounded-[3rem] p-10 border-white/5 bg-white/[0.02] relative min-h-[500px]">
             <div className="flex items-center justify-between mb-12">
                <div>
                   <h3 className="text-2xl font-bold text-white tracking-tight">Requires Attention</h3>
                   <p className="text-sm text-muted-foreground/50 mt-1">Items that missed their scheduled deadline.</p>
                </div>
                <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-primary/60 hover:text-primary">
                  View Full Report
                </Button>
             </div>

             <div className="space-y-4">
                {overdueItems.length > 0 ? (
                  overdueItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="group flex items-center justify-between p-6 bg-white/[0.02] border border-white/[0.03] rounded-3xl hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 cursor-pointer"
                    >
                      <div className="flex items-center gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-2xl shadow-rose-500/10 group-hover:scale-110 transition-transform">
                          <AlertCircle size={22} />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-white tracking-tight">{item.artist}</p>
                          <div className="flex items-center gap-3 mt-1 opacity-40">
                             <span className="text-[11px] font-bold uppercase tracking-widest">{item.venue}</span>
                             <span className="h-1 w-1 rounded-full bg-white/40" />
                             <span className="text-[11px] text-rose-500/80 font-bold uppercase tracking-widest">Late: {item.deadline}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <Badge className="bg-white/5 text-muted-foreground/60 border-white/5 font-bold uppercase text-[9px] tracking-[0.2em] px-4 h-8 rounded-full">
                           {item.document}
                         </Badge>
                         <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                           <ChevronRight size={18} className="text-white" />
                         </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-24 flex flex-col items-center justify-center text-center opacity-30">
                    <CheckCircle2 size={40} className="mb-4" />
                    <p className="font-bold uppercase tracking-widest text-xs">All requirements on schedule.</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Quick Links - Premium Style */}
        <div className="md:col-span-4 flex flex-col gap-8">
           <div className="glass-card rounded-[3.5rem] p-10 bg-white border-white shadow-[0_30px_60px_-15px_rgba(255,255,255,0.1)] group">
              <Music className="text-black mb-8 group-hover:rotate-12 transition-transform" size={40} strokeWidth={1.5} />
              <h4 className="text-2xl font-bold text-black tracking-tight leading-tight mb-4">Launch New Artist Roster</h4>
              <p className="text-sm text-black/50 font-medium leading-relaxed mb-10">Start a new collection workflow and share the portal with your artist.</p>
              <Button className="w-full h-16 bg-black text-white hover:bg-zinc-800 rounded-3xl font-bold text-sm tracking-tight transition-transform active:scale-95">
                Get Started
              </Button>
           </div>

           <div className="glass-card rounded-[3.5rem] p-10 border-white/5 bg-white/[0.02] flex flex-col gap-6">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/30 mb-2">Live Support</h5>
              <div className="flex items-center gap-4 group">
                 <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-primary transition-colors">
                   <Clock size={20} />
                 </div>
                 <div>
                    <p className="font-bold text-white tracking-tight text-sm">Scheduled Maintenance</p>
                    <p className="text-xs text-muted-foreground/40 mt-1">Today at 2:00 AM UTC</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
