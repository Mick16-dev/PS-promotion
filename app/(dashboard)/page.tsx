'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  ArrowUpRight,
  Music,
  CheckCircle2,
  AlertCircle,
  Search,
  User,
  Calendar,
  Clock4,
  ChevronRight,
  Filter,
  Layers,
  ArrowRight
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalShows: 0,
    awaitingDocs: 0,
    overdueDocs: 0
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
          overdueDocs: overdueList.length
        })
        setOverdueItems(overdueList.slice(0, 8))
      }
    } catch (err: any) {
      console.error('Data Fetch Failure:', err)
      toast.error('Sync Error', { description: 'Could not connect to database.' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-primary/20 border-t-primary rounded-full" />
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto pt-10 pb-20 px-8 animate-in fade-in duration-700">
      {/* Precision Header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-10 mb-12">
        <div>
           <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold px-2 py-0">LIVE</Badge>
              <span className="text-zinc-500 text-xs font-medium tracking-tight">Active Roster Monitoring</span>
           </div>
           <h1 className="text-4xl font-bold tracking-tight text-white inline-flex items-center gap-3">
             Production <span className="text-zinc-600 font-medium">/ Control</span>
           </h1>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="h-10 bg-zinc-900 border-white/10 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs px-4 rounded-lg">
             Customize View
           </Button>
           <Button className="h-10 bg-white hover:bg-zinc-200 text-[#0B0C0E] font-bold text-sm px-5 rounded-lg shadow-xl shadow-white/5 gap-2">
             <Plus size={16} strokeWidth={3} /> Add Engagement
           </Button>
        </div>
      </div>

      {/* Senior Stats Grid - High Precision */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
        {[
          { label: 'Active Advancements', value: stats.totalShows, icon: Calendar, accent: 'text-white' },
          { label: 'Materials Pipeline', value: stats.awaitingDocs, icon: Clock4, accent: 'text-amber-500' },
          { label: 'Priority Overdue', value: stats.overdueDocs, icon: AlertCircle, accent: 'text-rose-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#151618] border border-white/[0.04] rounded-xl p-8 hover:border-white/[0.08] transition-colors group relative overflow-hidden">
             <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{stat.label}</span>
                <stat.icon size={14} className="text-zinc-600 group-hover:text-zinc-300 transition-colors" />
             </div>
             <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold tracking-tight ${stat.accent}`}>{stat.value}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Records</span>
             </div>
          </div>
        ))}
      </div>

      {/* Main Content Area - Linear Pattern (Row-Based Feed) */}
      <div className="space-y-10">
        <div className="bg-[#151618] border border-white/[0.04] rounded-xl overflow-hidden shadow-2xl">
           <div className="px-8 py-5 border-b border-white/[0.04] flex items-center justify-between bg-white/[0.01]">
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                 <Layers size={14} className="text-zinc-500" />
                 Unresolved Deliverables
              </h2>
              <div className="flex items-center gap-4">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="h-6 w-6 rounded-full border-2 border-[#151618] bg-zinc-800" />)}
                 </div>
                 <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 border-none px-2 py-0 text-[10px] font-bold italic">{stats.overdueDocs} Items</Badge>
              </div>
           </div>

           <div className="divide-y divide-white/[0.02]">
              {overdueItems.length > 0 ? (
                overdueItems.map((item) => (
                  <div key={item.id} className="group flex items-center justify-between px-8 py-4 hover:bg-white/[0.02] cursor-pointer transition-all border-l-2 border-l-transparent hover:border-l-rose-500">
                    <div className="flex items-center gap-6 min-w-0">
                       <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                          <FileWarning size={14} strokeWidth={2.5} />
                       </div>
                       <div className="min-w-0">
                          <div className="flex items-center gap-3">
                             <span className="text-sm font-bold text-white tracking-tight">{item.artist}</span>
                             <span className="text-zinc-600 text-xs">•</span>
                             <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest truncate">{item.venue}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                             <span className="text-[12px] font-medium text-zinc-400">{item.document}</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-8 shrink-0">
                       <div className="bg-rose-500/5 px-3 py-1 rounded-md border border-rose-500/10">
                          <span className="text-[10px] font-bold text-rose-400 uppercase">Late: {item.deadline}</span>
                       </div>
                       <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight size={16} className="text-zinc-500" />
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center flex flex-col items-center justify-center opacity-40">
                   <CheckCircle2 size={32} className="mb-4 text-emerald-500" />
                   <p className="text-sm font-bold text-zinc-100">Zero Unresolved Items</p>
                   <p className="text-xs text-zinc-500 mt-1">Your shows are running perfectly according to schedule.</p>
                </div>
              )}
           </div>
           
           <div className="px-8 py-4 bg-white/[0.01] border-t border-white/[0.04]">
              <button className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">
                View Full Production Timeline
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}
